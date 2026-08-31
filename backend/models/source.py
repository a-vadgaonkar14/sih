from datetime import datetime
from backend.database.db import db

class Source(db.Model):
    __tablename__ = 'sources'
    
    source_id = db.Column(db.String, primary_key=True)
    source_name = db.Column(db.String, nullable=False)
    domain = db.Column(db.String, nullable=False)
    
    robots_url = db.Column(db.String, nullable=True)
    robots_status = db.Column(db.String, nullable=True)
    terms_review_status = db.Column(db.String, nullable=True)
    scraping_allowed = db.Column(db.Boolean, default=False)
    last_compliance_check = db.Column(db.DateTime, nullable=True)
    
    rate_limit = db.Column(db.Integer, default=1) # requests per minute, etc.
    enabled = db.Column(db.Boolean, default=True)
    
    last_attempt = db.Column(db.DateTime, nullable=True)
    last_success = db.Column(db.DateTime, nullable=True)
    last_failure = db.Column(db.DateTime, nullable=True)
    
    success_rate = db.Column(db.Float, default=0.0)
    current_status = db.Column(db.String, default="NOT_CONFIGURED") # LIVE, NOT_CONFIGURED, SOURCE_UNAVAILABLE, COMPLIANCE_BLOCKED, SIMULATED
    
    def to_dict(self):
        return {
            "source_id": self.source_id,
            "source_name": self.source_name,
            "domain": self.domain,
            "scraping_allowed": self.scraping_allowed,
            "enabled": self.enabled,
            "last_compliance_check": self.last_compliance_check.isoformat() if self.last_compliance_check else None,
            "last_attempt": self.last_attempt.isoformat() if self.last_attempt else None,
            "last_success": self.last_success.isoformat() if self.last_success else None,
            "last_failure": self.last_failure.isoformat() if self.last_failure else None,
            "success_rate": self.success_rate,
            "current_status": self.current_status
        }
