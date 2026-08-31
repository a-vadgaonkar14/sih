from datetime import datetime
from backend.database.db import db

class ScrapeJob(db.Model):
    __tablename__ = 'scrape_jobs'
    
    job_id = db.Column(db.String, primary_key=True)
    source = db.Column(db.String, nullable=False)
    origin = db.Column(db.String, nullable=False)
    destination = db.Column(db.String, nullable=False)
    travel_date = db.Column(db.String, nullable=False)
    lead_days = db.Column(db.Integer, nullable=False)
    
    status = db.Column(db.String, nullable=False, default="QUEUED") # QUEUED, RUNNING, SUCCESS, PARTIAL, SOURCE_UNAVAILABLE, BLOCKED, COMPLIANCE_BLOCKED, TIMEOUT, FAILED
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    records_found = db.Column(db.Integer, default=0)
    records_valid = db.Column(db.Integer, default=0)
    records_rejected = db.Column(db.Integer, default=0)
    
    error_type = db.Column(db.String, nullable=True)
    error_message = db.Column(db.Text, nullable=True)
    
    duration_ms = db.Column(db.Integer, nullable=True)
    
    def to_dict(self):
        return {
            "job_id": self.job_id,
            "source": self.source,
            "origin": self.origin,
            "destination": self.destination,
            "travel_date": self.travel_date,
            "lead_days": self.lead_days,
            "status": self.status,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "records_found": self.records_found,
            "records_valid": self.records_valid,
            "records_rejected": self.records_rejected,
            "error_type": self.error_type,
            "error_message": self.error_message,
            "duration_ms": self.duration_ms
        }
