"""
Standalone Full Pipeline Scraper (SIH26056 Production Pipeline)
Scrapes all 6 mandatory routes × 5 lead times = 30 tasks
Rewrites scraped_data.json with genuine, live-scraped observations.
Computes real-time ILO Jevons indices for each route.
"""
import asyncio
import sys
import os
import json
from datetime import datetime, timedelta

ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ROOT)

from backend.app import app, db
from backend.models import FlightObservation, Route
from backend.scrapers.airlines.google_flights import GoogleFlightsScraper
from backend.scrapers.manager import _rewrite_json
from backend.scrapers.log import emit_log
from backend.pipelines.analytics import compute_route_index, calculate_jevons_index

ROUTES = [
    ("DEL", "BOM"),
    ("BLR", "HYD"),
    ("BOM", "BLR"),
    ("DEL", "BLR"),
    ("DEL", "CCU"),
    ("MAA", "DEL"),
]

LEAD_TIMES = [1, 7, 15, 30, 45]


async def run_full_scrape():
    scraper = GoogleFlightsScraper(None)
    all_valid = []
    total_found = 0
    total_rejected = 0
    task_num = 0
    total_tasks = len(ROUTES) * len(LEAD_TIMES)

    print(f"\n{'='*75}", flush=True)
    print(f"  AVIA / SIH26056 REAL-TIME AIRFARE SCRAPING PIPELINE — 30 TASKS", flush=True)
    print(f"  Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S IST')}", flush=True)
    print(f"  Source: Google Flights Direct Live Query", flush=True)
    print(f"{'='*75}\n", flush=True)

    for origin, dest in ROUTES:
        for lead in LEAD_TIMES:
            task_num += 1
            travel_date = (datetime.now().date() + timedelta(days=lead)).strftime('%Y-%m-%d')

            print(f"[TASK {task_num:02d}/30] Route: {origin} → {dest} | Lead: T+{lead:02d} | Date: {travel_date}", flush=True)

            try:
                observations = await scraper.search(
                    origin=origin,
                    destination=dest,
                    travel_date=travel_date,
                    lead_days=lead
                )

                raw_count = len(observations)
                total_found += raw_count
                valid_count = 0
                reject_count = 0

                for obs in observations:
                    # Strict zero-tolerance validation
                    if obs.origin != origin or obs.destination != dest:
                        reject_count += 1
                        continue
                    if obs.travel_date != travel_date:
                        reject_count += 1
                        continue
                    if not obs.total_fare or obs.total_fare <= 0:
                        reject_count += 1
                        continue

                    obs.provenance = json.dumps({"job_id": "FULL-PIPELINE-RUN", "source": "GF", "lead_days": lead})
                    try:
                        db.session.merge(obs)
                        all_valid.append(obs)
                        valid_count += 1
                    except Exception as e:
                        reject_count += 1
                        print(f"  [DB WARN] Record duplicate/error: {e}", flush=True)

                db.session.commit()
                total_rejected += reject_count

                print(f"  ↳ Results: {raw_count} extracted | {valid_count} valid | {reject_count} rejected\n", flush=True)

            except Exception as e:
                print(f"  ↳ [ERROR] Scrape failed on {origin}-{dest} T+{lead}: {e}\n", flush=True)

    print(f"{'='*75}", flush=True)
    print(f"  SCRAPE RUN FINISHED", flush=True)
    print(f"  Total raw records extracted: {total_found}", flush=True)
    print(f"  Total valid flights stored:   {len(all_valid)}", flush=True)
    print(f"  Total records rejected:       {total_rejected}", flush=True)
    print(f"{'='*75}\n", flush=True)

    if all_valid:
        print("[STORAGE] Rewriting scraped_data.json atomically with clean verified data...", flush=True)
        _rewrite_json(all_valid, emit_log)
        print(f"[STORAGE] ✅ Successfully written {len(all_valid)} flights to scraped_data.json", flush=True)

        print("\n[ANALYTICS] Computing ILO Jevons elementary indices for all corridors...", flush=True)
        for origin, dest in ROUTES:
            r_id = f"{origin}-{dest}"
            t_date = (datetime.now().date() + timedelta(days=7)).strftime('%Y-%m-%d')
            idx_rec = compute_route_index(r_id, t_date, base_price=5000.0)
            if idx_rec:
                print(f"  ↳ Route {r_id} (T+7): Jevons Index = {idx_rec.index_value} (Obs: {idx_rec.observation_count})", flush=True)
        print("[ANALYTICS] ✅ Index computation complete.\n", flush=True)
    else:
        print("[STORAGE] ⚠️ No valid observations were extracted. JSON not modified.", flush=True)

    return all_valid


if __name__ == "__main__":
    with app.app_context():
        results = asyncio.run(run_full_scrape())
        print(f"PIPELINE COMPLETED: {len(results)} live flights in database.")
