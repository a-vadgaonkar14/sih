"""
AVIA (Airfare Variation & Index Analytics) / APIx India
Policy-Grade Analytics & CPI Augmentation Web Server
Modular Backend Architecture - Real Data Only
"""
import os
import sys
import json
import hashlib
from datetime import datetime
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from sqlalchemy.exc import IntegrityError

# Add root directory to sys.path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT_DIR)
DIST_DIR = os.path.join(ROOT_DIR, "frontend", "dist")

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from backend.config import Config
from backend.database.db import db
from backend.api import fares_bp, scraper_bp, frontend_bp

app = Flask(__name__, static_folder=DIST_DIR, static_url_path="")
app.config.from_object(Config)

db.init_app(app)
CORS(app)

app.register_blueprint(fares_bp)
app.register_blueprint(scraper_bp)
app.register_blueprint(frontend_bp)


def seed_from_json():
    """
    Load all observations from scraped_data.json into the SQLite DB if the
    flight_observations table is empty.  This ensures data is always visible
    on Render (ephemeral FS) and other clean-slate deployments.
    """
    from backend.models import FlightObservation

    if FlightObservation.query.first():
        return  # DB already has data — skip seeding

    json_path = os.path.join(ROOT_DIR, "backend", "data", "scraped_data.json")
    if not os.path.exists(json_path):
        print("[SEED] scraped_data.json not found — skipping seed.", flush=True)
        return

    try:
        with open(json_path, "r", encoding="utf-8") as f:
            payload = json.load(f)
    except Exception as e:
        print(f"[SEED] Failed to read scraped_data.json: {e}", flush=True)
        return

    observations = payload.get("observations", [])
    if not observations:
        print("[SEED] scraped_data.json has no observations.", flush=True)
        return

    inserted = 0
    skipped = 0
    BATCH = 200

    for i, rec in enumerate(observations):
        try:
            # Build a stable ID if missing
            obs_id = rec.get("id") or rec.get("hash")
            if not obs_id:
                canonical = (
                    f"{rec.get('source_id')}|{rec.get('origin')}|"
                    f"{rec.get('destination')}|{rec.get('travel_date')}|"
                    f"{rec.get('carrier_code')}|{rec.get('flight_number')}|"
                    f"{rec.get('departure_time')}|{rec.get('total_fare')}"
                )
                obs_id = hashlib.sha256(canonical.encode()).hexdigest()

            # Parse scraped_at
            scraped_at = None
            raw_scraped = rec.get("scraped_at")
            if raw_scraped:
                for fmt in ("%Y-%m-%dT%H:%M:%S.%f", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d"):
                    try:
                        scraped_at = datetime.strptime(raw_scraped, fmt)
                        break
                    except ValueError:
                        continue
            if not scraped_at:
                scraped_at = datetime.utcnow()

            # stops field: JSON stores "Non-stop" / "1 stop" strings
            raw_stops = rec.get("stops", 0)
            if isinstance(raw_stops, str):
                import re
                m = re.search(r"\d+", raw_stops)
                stops_int = int(m.group()) if m else 0
            else:
                stops_int = int(raw_stops) if raw_stops else 0

            obs = FlightObservation(
                id=obs_id,
                source_id=rec.get("source_id", "GF"),
                source_name=rec.get("source_name", "Google Flights"),
                origin=rec.get("origin", "DEL"),
                destination=rec.get("destination", "BOM"),
                travel_date=rec.get("travel_date", ""),
                scraped_at=scraped_at,
                carrier=rec.get("carrier_code") or rec.get("carrier", "6E"),
                flight_number=rec.get("flight_number", ""),
                departure_time=rec.get("departure_time"),
                arrival_time=rec.get("arrival_time"),
                duration_minutes=rec.get("duration_minutes"),
                stops=stops_int,
                fare_class=rec.get("fare_class", "ECONOMY"),
                fare_family=rec.get("fare_family", "Standard"),
                base_fare=rec.get("base_fare"),
                taxes=rec.get("taxes"),
                fees=rec.get("fees", 0.0),
                user_development_fee=rec.get("user_development_fee", 354.0),
                gst=rec.get("gst"),
                fuel_surcharge=rec.get("fuel_surcharge", 0.0),
                total_fare=rec.get("total_fare"),
                currency=rec.get("currency", "INR"),
                lead_days=rec.get("lead_days", 7),
                availability_status=rec.get("availability_status", "OBSERVED"),
                raw_source_url=rec.get("raw_source_url"),
                extraction_method=rec.get("extraction_method", "playwright"),
                provenance=rec.get("provenance") if isinstance(rec.get("provenance"), str) else json.dumps(rec.get("provenance")) if rec.get("provenance") else None,
                confidence_score=rec.get("confidence_score", 0.99),
                is_synthetic=bool(rec.get("is_synthetic", False)),
                is_replay=bool(rec.get("is_replay", False)),
            )
            db.session.merge(obs)  # merge handles duplicates by primary key
            inserted += 1

            # Commit in batches to avoid one massive transaction
            if inserted % BATCH == 0:
                db.session.commit()
                print(f"[SEED] ... {inserted} records committed", flush=True)

        except Exception as e:
            skipped += 1
            db.session.rollback()
            print(f"[SEED] Skipping record {i}: {e}", flush=True)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"[SEED] Final commit error: {e}", flush=True)

    print(f"[SEED] Done — {inserted} inserted, {skipped} skipped from scraped_data.json", flush=True)


with app.app_context():
    db.create_all()
    # Initialize basic DB rows if empty
    from backend.models import Route, Source

    if not Route.query.first():
        routes_to_seed = [
            Route(origin="DEL", destination="BOM"),
            Route(origin="BLR", destination="HYD"),
            Route(origin="BOM", destination="BLR"),
            Route(origin="DEL", destination="BLR"),
            Route(origin="DEL", destination="CCU"),
            Route(origin="MAA", destination="DEL"),
        ]
        for r in routes_to_seed:
            db.session.add(r)
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()

    if not Source.query.first():
        sources_to_add = [
            Source(source_id="6E", source_name="IndiGo", domain="https://www.goindigo.in", scraping_allowed=True, current_status="LIVE"),
            Source(source_id="AI", source_name="Air India", domain="https://www.airindia.com", scraping_allowed=True, current_status="LIVE"),
            Source(source_id="QP", source_name="Akasa Air", domain="https://www.akasaair.com", scraping_allowed=True, current_status="LIVE"),
            Source(source_id="SG", source_name="SpiceJet", domain="https://www.spicejet.com", scraping_allowed=True, current_status="LIVE"),
            Source(source_id="IX", source_name="Air India Express", domain="https://www.airindiaexpress.com", scraping_allowed=True, current_status="LIVE"),
            Source(source_id="GF", source_name="Google Flights", domain="https://www.google.com/flights", scraping_allowed=True, current_status="LIVE"),
        ]
        for s in sources_to_add:
            db.session.add(s)
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
    else:
        from sqlalchemy.exc import IntegrityError as IE
        if not Source.query.filter_by(source_id="GF").first():
            try:
                db.session.add(Source(source_id="GF", source_name="Google Flights", domain="https://www.google.com/flights", scraping_allowed=True, current_status="LIVE"))
                db.session.commit()
            except IE:
                db.session.rollback()

    # Seed flight observations from JSON if DB is empty
    seed_from_json()


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if path != "" and os.path.exists(os.path.join(DIST_DIR, path)):
        return send_from_directory(DIST_DIR, path)
    elif os.path.exists(os.path.join(DIST_DIR, "index.html")):
        return send_from_directory(DIST_DIR, "index.html")
    else:
        return jsonify({
            "status": "online",
            "service": "AVIA APIx Server - Strict Compliance Mode",
            "mode": "REAL DATA ONLY"
        })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)
