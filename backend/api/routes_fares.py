from flask import Blueprint, jsonify, request
from backend.models import FlightObservation
from backend.database.db import db
from backend.pipelines.preprocessing import annotate_observations_with_outliers

fares_bp = Blueprint('fares', __name__)

@fares_bp.route('/api/fares/latest', methods=['GET'])
def get_latest_fares():
    # Only return verified observations
    obs = FlightObservation.query.filter_by(
        availability_status="OBSERVED",
        is_synthetic=False,
        is_replay=False
    ).order_by(FlightObservation.scraped_at.desc()).limit(150).all()
    
    raw = [o.to_dict() for o in obs]
    annotated = annotate_observations_with_outliers(raw)
    
    return jsonify({
        "status": "success",
        "dataset_status": "LIVE" if obs else "UNAVAILABLE",
        "data": annotated
    })

@fares_bp.route('/api/fares/route/<route_id>', methods=['GET'])
def get_route_fares(route_id):
    origin, destination = route_id.split("-")
    obs = FlightObservation.query.filter_by(
        origin=origin,
        destination=destination,
        availability_status="OBSERVED",
        is_synthetic=False
    ).order_by(FlightObservation.scraped_at.desc()).limit(100).all()
    
    raw = [o.to_dict() for o in obs]
    annotated = annotate_observations_with_outliers(raw)

    return jsonify({
        "status": "success",
        "route": route_id,
        "data": annotated
    })
