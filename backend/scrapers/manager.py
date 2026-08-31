import asyncio
import json
import os
from datetime import datetime

from backend.database.db import db
from backend.models import ScrapeJob, Source
from backend.scrapers.registry import get_scraper_class
from backend.scrapers.compliance import check_source_compliance

from backend.scrapers.log import log_queue, emit_log


async def run_scrape_job(job_id: str, app_context):
    """
    Executes a single scrape job by calling the airline scraper directly.
    Uses a minimal async browser context for scrapers that need it.
    """
    with app_context():
        job = db.session.get(ScrapeJob, job_id)
        if not job:
            emit_log("error", f"Job {job_id} not found in DB")
            return

        source_model = db.session.get(Source, job.source)
        if not source_model:
            job.status = "FAILED"
            job.error_message = "Source not found in DB"
            db.session.commit()
            emit_log("error", f"Source {job.source} not found")
            return

        job.status = "RUNNING"
        job.started_at = datetime.utcnow()
        db.session.commit()

        emit_log("info", f"🚀 Starting job {job_id} | {source_model.source_name} | {job.origin}→{job.destination} | {job.travel_date}")

        # Check compliance before running
        if not check_source_compliance(source_model.source_id, source_model.domain):
            job.status = "COMPLIANCE_BLOCKED"
            job.error_message = "Scraping disallowed by compliance check"
            job.completed_at = datetime.utcnow()
            source_model.last_failure = datetime.utcnow()
            db.session.commit()
            emit_log("warning", f"⚠️  Compliance blocked for {source_model.source_name}")
            return

        scraper_cls = get_scraper_class(job.source)
        if not scraper_cls:
            job.status = "NOT_CONFIGURED"
            job.error_message = f"No scraper implementation for {job.source}"
            job.completed_at = datetime.utcnow()
            source_model.last_failure = datetime.utcnow()
            db.session.commit()
            emit_log("error", f"❌ No scraper configured for {job.source}")
            return

        start_time = datetime.utcnow()
        try:
            emit_log("info", f"🌐 Launching scraper for {source_model.source_name} ({source_model.domain})...")

            emit_log("info", f"🔬 [{job.source}] Executing live scraper for {source_model.source_name}...")
            scraper = scraper_cls(None)
            observations = await scraper.search(
                origin=job.origin,
                destination=job.destination,
                travel_date=job.travel_date,
                lead_days=job.lead_days
            )
            emit_log("info", f"📊 Scraper finished. Live observations: {len(observations)}")

            # Validate and insert observations (skip duplicates)
            valid_obs = []
            for obs in observations:
                obs.provenance = json.dumps({"job_id": job.job_id, "source": job.source})
                try:
                    db.session.merge(obs)   # merge handles duplicate primary keys
                    valid_obs.append(obs)
                except Exception as e:
                    emit_log("warning", f"⚠️  Skipping duplicate: {obs.id[:12]}... ({e})")

            job.records_found = len(observations)
            job.records_valid = len(valid_obs)

            if job.records_valid > 0:
                job.status = "SUCCESS"
                source_model.last_success = datetime.utcnow()
                source_model.current_status = "LIVE"
                emit_log("success", f"✅ Indexed {len(valid_obs)} flights | {job.origin}→{job.destination} | {source_model.source_name}")

                # Save to JSON file
                _save_to_json(job, valid_obs, emit_log)
            else:
                job.status = "SOURCE_UNAVAILABLE"
                job.error_message = "No valid observations extracted"
                source_model.last_failure = datetime.utcnow()
                source_model.current_status = "SOURCE_UNAVAILABLE"
                emit_log("warning", f"⚠️  No flights found for {job.origin}→{job.destination}")

            job.completed_at = datetime.utcnow()
            job.duration_ms = int((job.completed_at - start_time).total_seconds() * 1000)
            db.session.commit()

        except Exception as e:
            job.status = "FAILED"
            job.error_type = type(e).__name__
            job.error_message = str(e)
            job.completed_at = datetime.utcnow()
            job.duration_ms = int((job.completed_at - start_time).total_seconds() * 1000)
            source_model.last_failure = datetime.utcnow()
            source_model.current_status = "SOURCE_UNAVAILABLE"
            db.session.commit()
            emit_log("error", f"💥 Scraper Exception [{type(e).__name__}]: {str(e)}")


def _save_to_json(job, valid_obs, emit_log_fn):
    """Persist scraped observations to the data JSON file."""
    try:
        data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
        os.makedirs(data_dir, exist_ok=True)
        json_path = os.path.join(data_dir, "scraped_data.json")

        existing_data = {"metadata": {}, "observations": []}
        if os.path.exists(json_path):
            with open(json_path, 'r') as f:
                existing_data = json.load(f)

        if "observations" not in existing_data:
            existing_data = {"metadata": {}, "observations": []}

        # Append, avoiding duplicates by id
        existing_ids = {o.get("id") for o in existing_data["observations"]}
        new_records = [o.to_dict() for o in valid_obs if o.id not in existing_ids]
        existing_data["observations"].extend(new_records)
        existing_data["metadata"]["last_scrape"] = datetime.utcnow().isoformat()
        existing_data["metadata"]["last_job_id"] = job.job_id
        existing_data["metadata"]["total_records"] = len(existing_data["observations"])

        with open(json_path, 'w') as f:
            json.dump(existing_data, f, indent=2, default=str)

        emit_log_fn("success", f"💾 Saved {len(new_records)} new records to scraped_data.json (total: {len(existing_data['observations'])})")
    except Exception as e:
        emit_log_fn("warning", f"⚠️  Failed to save JSON: {e}")

def _rewrite_json(valid_obs, emit_log_fn):
    """Overwrite scraped_data.json completely with fresh, preprocessed, outlier-tagged observations."""
    try:
        from backend.pipelines.preprocessing import annotate_observations_with_outliers, get_outlier_summary_stats

        data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
        os.makedirs(data_dir, exist_ok=True)
        json_path = os.path.join(data_dir, "scraped_data.json")

        raw_records = [o.to_dict() for o in valid_obs]
        
        # Preprocessing: Z-score & Modified Z-score outlier detection
        annotated_records = annotate_observations_with_outliers(raw_records)
        outlier_summary = get_outlier_summary_stats(annotated_records)

        new_data = {
            "metadata": {
                "last_scrape": datetime.utcnow().isoformat(),
                "last_job_id": "BATCH-METRO",
                "total_records": len(annotated_records),
                "preprocessing": {
                    "algorithm": "Z-Score & Modified Z-Score (MAD)",
                    "outlier_summary": outlier_summary
                }
            },
            "observations": annotated_records
        }

        with open(json_path, 'w') as f:
            json.dump(new_data, f, indent=2, default=str)

        emit_log_fn("success", f"💾 Rewrote scraped_data.json with {len(annotated_records)} records (Outliers detected: {outlier_summary['outlier_count']})")
    except Exception as e:
        emit_log_fn("warning", f"⚠️  Failed to rewrite JSON: {e}")

FULL_SCRAPE_JOBS = {}

async def run_full_pipeline_job(app_context, job_id):
    """Sequentially scrape 6 routes x 5 lead times and rewrite JSON."""
    FULL_SCRAPE_JOBS[job_id] = {
        "status": "RUNNING",
        "total_tasks": 30,
        "completed_tasks": 0,
        "current_route": "",
        "current_lead_time": 0,
        "current_source": "Google Flights",
        "records_found": 0,
        "valid_records": 0,
        "rejected_records": 0
    }
    
    with app_context():
        routes = [
            ("DEL", "BOM"), ("BLR", "HYD"), ("BOM", "BLR"), 
            ("DEL", "BLR"), ("DEL", "CCU"), ("MAA", "DEL")
        ]
        lead_times = [1, 7, 15, 30, 45]
        
        from backend.scrapers.airlines.google_flights import GoogleFlightsScraper
        from datetime import timedelta, date
        import json
        
        scraper = GoogleFlightsScraper(None)
        all_valid_obs = []
        
        emit_log("info", f"🚀 Starting Full 30-Task Pipeline Scrape [Job: {job_id}]")
        
        for origin, dest in routes:
            for lead in lead_times:
                FULL_SCRAPE_JOBS[job_id]["current_route"] = f"{origin}-{dest}"
                FULL_SCRAPE_JOBS[job_id]["current_lead_time"] = lead
                
                travel_date_obj = datetime.utcnow().date() + timedelta(days=lead)
                travel_date_str = travel_date_obj.strftime('%Y-%m-%d')
                
                emit_log("info", f"🚄 Scrape ({FULL_SCRAPE_JOBS[job_id]['completed_tasks']+1}/30): {origin}→{dest} T+{lead} ({travel_date_str})")
                
                try:
                    observations = await scraper.search(origin=origin, destination=dest, travel_date=travel_date_str, lead_days=lead)
                    
                    FULL_SCRAPE_JOBS[job_id]["records_found"] += len(observations)
                    
                    for obs in observations:
                        # Strict validation
                        if obs.origin != origin or obs.destination != dest:
                            FULL_SCRAPE_JOBS[job_id]["rejected_records"] += 1
                            continue
                        if obs.travel_date != travel_date_str:
                            FULL_SCRAPE_JOBS[job_id]["rejected_records"] += 1
                            continue
                        if not obs.total_fare or obs.total_fare <= 0:
                            FULL_SCRAPE_JOBS[job_id]["rejected_records"] += 1
                            continue
                            
                        obs.provenance = json.dumps({"job_id": job_id, "source": "GF"})
                        try:
                            db.session.merge(obs)
                            all_valid_obs.append(obs)
                            FULL_SCRAPE_JOBS[job_id]["valid_records"] += 1
                        except Exception as e:
                            FULL_SCRAPE_JOBS[job_id]["rejected_records"] += 1
                            emit_log("warning", f"⚠️  Skipping duplicate in DB: {e}")
                            
                    db.session.commit()
                except Exception as e:
                    emit_log("error", f"💥 Scrape Error on {origin}-{dest} T+{lead}: {e}")
                
                FULL_SCRAPE_JOBS[job_id]["completed_tasks"] += 1

        FULL_SCRAPE_JOBS[job_id]["status"] = "COMPLETED"
        
        if all_valid_obs:
            _rewrite_json(all_valid_obs, emit_log)
            emit_log("success", f"✅ Full Pipeline Completed! Total {len(all_valid_obs)} valid flights indexed.")
        else:
            emit_log("warning", "⚠️ Full Pipeline completed but no valid observations were found.")
