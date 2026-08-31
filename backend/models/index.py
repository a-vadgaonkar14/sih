from datetime import datetime
from backend.database.db import db

class IndexObservation(db.Model):
    __tablename__ = 'index_observations'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.String, nullable=False) # YYYY-MM-DD
    frequency = db.Column(db.String, nullable=False) # DAILY, WEEKLY, MONTHLY
    
    route = db.Column(db.String, nullable=False) # e.g. "DEL-BOM" or "NATIONAL"
    index_value = db.Column(db.Float, nullable=False)
    
    base_period = db.Column(db.String, nullable=False)
    base_price = db.Column(db.Float, nullable=False)
    
    observation_count = db.Column(db.Integer, default=0)
    
    calculated_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date,
            "frequency": self.frequency,
            "route": self.route,
            "index_value": self.index_value,
            "base_period": self.base_period,
            "base_price": self.base_price,
            "observation_count": self.observation_count,
            "calculated_at": self.calculated_at.isoformat() if self.calculated_at else None
        }
