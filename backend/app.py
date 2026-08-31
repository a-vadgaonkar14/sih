"""
AVIA (Airfare Variation & Index Analytics) / APIx India
Policy-Grade Analytics & CPI Augmentation Web Server
Modular Backend Architecture - Real Data Only
"""
import os
import sys
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

with app.app_context():
    db.create_all()
    # Initialize basic DB rows if empty
    from backend.models import Route, Source

    if not Route.query.first():
        db.session.add(Route(origin="DEL", destination="BOM"))
        try:
            db.session.commit()
        except IntegrityError:
            # Another worker process already inserted this row — safe to ignore.
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
        # Ensure Google Flights row exists even if sources were previously seeded
        from sqlalchemy.exc import IntegrityError as IE
        if not Source.query.filter_by(source_id="GF").first():
            try:
                db.session.add(Source(source_id="GF", source_name="Google Flights", domain="https://www.google.com/flights", scraping_allowed=True, current_status="LIVE"))
                db.session.commit()
            except IE:
                db.session.rollback()

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
