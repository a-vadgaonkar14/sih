import uuid
from datetime import datetime, timedelta
from backend.database.db import db
from backend.models import ScrapeJob, Route, Source

def generate_schedule(app_context):
    """
    Generates ScrapeJobs for all active routes, sources, and lead times.
    """
    with app_context():
        routes = Route.query.filter_by(active=True).all()
        sources = Source.query.filter_by(enabled=True).all()
        lead_times = [1, 7, 15, 30, 45]
        
        today = datetime.utcnow().date()
        
        jobs_created = 0
        for route in routes:
            for source in sources:
                for lead in lead_times:
                    travel_date = (today + timedelta(days=lead)).isoformat()
                    
                    job_id = f"JOB-{uuid.uuid4().hex[:8]}"
                    
                    job = ScrapeJob(
                        job_id=job_id,
                        source=source.source_id,
                        origin=route.origin,
                        destination=route.destination,
                        travel_date=travel_date,
                        lead_days=lead,
                        status="QUEUED"
                    )
                    db.session.add(job)
                    jobs_created += 1
                    
        db.session.commit()
        return jobs_created
