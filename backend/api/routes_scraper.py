from flask import Blueprint, jsonify, request, Response, current_app
from backend.models import ScrapeJob, Source
from backend.database.db import db
from backend.scrapers.manager import run_scrape_job, emit_log
from backend.scrapers.log import log_queue
import uuid
import threading
import asyncio
import json
from datetime import datetime

scraper_bp = Blueprint('scraper', __name__)


def _calc_lead_days(travel_date_str: str) -> int:
    """Calculate lead days from today to the travel date."""
    try:
        travel_dt = datetime.strptime(travel_date_str, "%Y-%m-%d").date()
        today = datetime.utcnow().date()
        delta = (travel_dt - today).days
        return max(0, delta)
    except Exception:
        return 7  # safe default


def _create_and_queue_job(source: str, origin: str, dest: str, travel_date: str, app_context) -> str:
    """Create a ScrapeJob in DB and launch it in a background thread. Returns job_id."""
    job_id = f"JOB-LIVE-{uuid.uuid4().hex[:6]}"
    lead_days = _calc_lead_days(travel_date)
    job = ScrapeJob(
        job_id=job_id,
        source=source,
        origin=origin,
        destination=dest,
        travel_date=travel_date,
        lead_days=lead_days,
        status="QUEUED"
    )
    db.session.add(job)
    return job_id


# ---------------------------------------------------------------------------
# GET /api/scraper/health
# ---------------------------------------------------------------------------
@scraper_bp.route('/api/scraper/health', methods=['GET'])
def get_scraper_health():
    sources = Source.query.all()
    return jsonify({
        "status": "success",
        "data": [s.to_dict() for s in sources]
    })


# ---------------------------------------------------------------------------
# GET /api/scraper/jobs
# ---------------------------------------------------------------------------
@scraper_bp.route('/api/scraper/jobs', methods=['GET'])
def get_scraper_jobs():
    jobs = ScrapeJob.query.order_by(ScrapeJob.started_at.desc()).limit(50).all()
    return jsonify({
        "status": "success",
        "data": [j.to_dict() for j in jobs]
    })


# ---------------------------------------------------------------------------
# GET /api/stream-logs  (SSE)
# ---------------------------------------------------------------------------
@scraper_bp.route('/api/stream-logs', methods=['GET'])
def stream_logs():
    def event_stream():
        import queue
        from backend.scrapers.log import recent_logs
        
        # Replay recent history first
        for log in list(recent_logs):
            yield f"data: {json.dumps(log)}\n\n"

        while True:
            try:
                log = log_queue.get(timeout=10)
                yield f"data: {json.dumps(log)}\n\n"
            except queue.Empty:
                yield f"data: {json.dumps({'level': 'ping', 'message': 'keep-alive'})}\n\n"

    return Response(event_stream(), mimetype="text/event-stream")


# ---------------------------------------------------------------------------
# GET|POST /api/scrape  — single route scrape
# ---------------------------------------------------------------------------
@scraper_bp.route('/api/scrape', methods=['GET', 'POST'])
def scrape():
    origin = request.args.get('origin', 'DEL')
    dest = request.args.get('dest', 'BOM')
    travel_date = request.args.get('date', '')
    carrier = request.args.get('carrier', '6E')

    # Default travel_date to 7 days from today if not provided
    if not travel_date:
        from datetime import timedelta
        travel_date = (datetime.utcnow().date() + timedelta(days=7)).strftime('%Y-%m-%d')

    if carrier == 'ALL':
        sources = ['6E', 'AI', 'QP', 'SG', 'IX']
    else:
        sources = [carrier]

    app_context = current_app.app_context
    jobs_created = []

    for src in sources:
        job_id = _create_and_queue_job(src, origin, dest, travel_date, app_context)
        jobs_created.append(job_id)

    db.session.commit()

    def run_jobs_bg(jobs, ctx):
        for jid in jobs:
            asyncio.run(run_scrape_job(jid, ctx))

    threading.Thread(target=run_jobs_bg, args=(jobs_created, app_context), daemon=True).start()

    return jsonify({
        "status": "success",
        "count": len(jobs_created),
        "jobs": jobs_created
    })


# ---------------------------------------------------------------------------
# POST /api/batch-scrape  — multiple routes / carriers
# ---------------------------------------------------------------------------
@scraper_bp.route('/api/batch-scrape', methods=['POST'])
def batch_scrape():
    """
    Expected payload:
    {
        "routes": [
            {"origin": "DEL", "dest": "BOM", "date": "2026-09-15", "carrier": "ALL"},
            ...
        ]
    }
    """
    payload = request.get_json(silent=True) or {}
    # Frontend sends 'sectors', plan accepts 'routes' — support both
    routes = payload.get('routes') or payload.get('sectors', [])

    if not routes:
        return jsonify({"status": "error", "message": "No routes provided"}), 400

    app_context = current_app.app_context
    all_job_ids = []

    for route in routes:
        origin = route.get('origin', 'DEL').upper()
        dest = route.get('dest', 'BOM').upper()
        travel_date = route.get('date', '')
        carrier = route.get('carrier', 'ALL')

        if not travel_date:
            from datetime import timedelta
            travel_date = (datetime.utcnow().date() + timedelta(days=7)).strftime('%Y-%m-%d')

        if carrier == 'ALL':
            sources = ['6E', 'AI', 'QP', 'SG', 'IX']
        else:
            sources = [carrier.upper()]

        for src in sources:
            job_id = _create_and_queue_job(src, origin, dest, travel_date, app_context)
            all_job_ids.append(job_id)

    db.session.commit()

    def run_jobs_bg(jobs, ctx):
        for jid in jobs:
            asyncio.run(run_scrape_job(jid, ctx))

    threading.Thread(target=run_jobs_bg, args=(all_job_ids, app_context), daemon=True).start()

    return jsonify({
        "status": "success",
        "count": len(all_job_ids),
        "jobs": all_job_ids
    })


# ---------------------------------------------------------------------------
# GET /api/scrape/status/<job_id>
# ---------------------------------------------------------------------------
@scraper_bp.route('/api/scrape/status/<job_id>', methods=['GET'])
def get_scrape_status(job_id):
    # Check in-memory batch jobs first
    from backend.scrapers.manager import FULL_SCRAPE_JOBS
    if job_id in FULL_SCRAPE_JOBS:
        return jsonify({
            "job_id": job_id,
            **FULL_SCRAPE_JOBS[job_id]
        })

    # Check DB ScrapeJob
    job = ScrapeJob.query.filter_by(job_id=job_id).first()
    if job:
        return jsonify({
            "job_id": job.job_id,
            "status": job.status,
            "route": f"{job.origin}-{job.destination}",
            "travel_date": job.travel_date,
            "lead_days": job.lead_days,
            "records_found": job.records_found,
            "valid_records": job.records_valid,
            "error": job.error_message,
            "duration_ms": job.duration_ms
        })

    return jsonify({"status": "error", "message": "Job not found"}), 404


# ---------------------------------------------------------------------------
# POST /api/scrape/all
# ---------------------------------------------------------------------------
@scraper_bp.route('/api/scrape/all', methods=['POST'])
def full_pipeline_scrape():
    """
    Scrape all 6 mandatory routes x 5 lead times and overwrite the JSON file.
    """
    from backend.scrapers.manager import run_full_pipeline_job
    import uuid
    app_context = current_app.app_context
    job_id = f"FULL-RUN-{uuid.uuid4().hex[:8].upper()}"

    def run_full_bg(ctx, jid):
        asyncio.run(run_full_pipeline_job(ctx, jid))

    threading.Thread(target=run_full_bg, args=(app_context, job_id), daemon=True).start()

    return jsonify({
        "job_id": job_id,
        "status": "QUEUED"
    })

