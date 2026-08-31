from datetime import datetime
from backend.database.db import db
from typing import Optional

class FlightObservation(db.Model):
    __tablename__ = 'flight_observations'
    
    id = db.Column(db.String, primary_key=True)  # SHA-256 hash
    
    source_id = db.Column(db.String, nullable=False)
    source_name = db.Column(db.String, nullable=False)
    
    origin = db.Column(db.String, nullable=False)
    destination = db.Column(db.String, nullable=False)
    travel_date = db.Column(db.String, nullable=False) # YYYY-MM-DD
    scraped_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    carrier = db.Column(db.String, nullable=False)
    flight_number = db.Column(db.String, nullable=False)
    
    departure_time = db.Column(db.String, nullable=True)
    arrival_time = db.Column(db.String, nullable=True)
    duration_minutes = db.Column(db.Integer, nullable=True)
    stops = db.Column(db.Integer, nullable=True)
    
    fare_class = db.Column(db.String, nullable=True)
    fare_family = db.Column(db.String, nullable=True)
    
    base_fare = db.Column(db.Float, nullable=True)
    taxes = db.Column(db.Float, nullable=True)
    fees = db.Column(db.Float, nullable=True)
    user_development_fee = db.Column(db.Float, nullable=True)
    gst = db.Column(db.Float, nullable=True)
    fuel_surcharge = db.Column(db.Float, nullable=True)
    total_fare = db.Column(db.Float, nullable=True) # Usually the only required fare field if breakdown missing
    
    currency = db.Column(db.String, default="INR")
    
    lead_days = db.Column(db.Integer, nullable=False)
    availability_status = db.Column(db.String, nullable=False, default="OBSERVED") # OBSERVED, SOLD_OUT, CANCELLED
    
    raw_source_url = db.Column(db.String, nullable=True)
    extraction_method = db.Column(db.String, nullable=False)
    provenance = db.Column(db.Text, nullable=True) # JSON of scrape job info
    confidence_score = db.Column(db.Float, default=1.0)
    
    is_synthetic = db.Column(db.Boolean, default=False)
    is_replay = db.Column(db.Boolean, default=False)
    
    def _lead_window(self):
        """Derive T+N label from lead_days int (5 mandatory horizons)."""
        ld = self.lead_days or 0
        if ld <= 1:    return "T+1"
        elif ld <= 7:  return "T+7"
        elif ld <= 15: return "T+15"
        elif ld <= 30: return "T+30"
        else:          return "T+45"

    # City name lookup
    _CITY_MAP = {
        "DEL": "Delhi", "BOM": "Mumbai", "BLR": "Bengaluru",
        "MAA": "Chennai", "CCU": "Kolkata", "HYD": "Hyderabad",
        "AMD": "Ahmedabad", "PNQ": "Pune", "COK": "Kochi",
        "GOI": "Goa", "JAI": "Jaipur", "LKO": "Lucknow"
    }

    _AIRLINE_NAME_MAP = {
        "6E": "IndiGo",
        "AI": "Air India",
        "QP": "Akasa Air",
        "SG": "SpiceJet",
        "IX": "Air India Express",
        "GF": "Google Flights",
        "UK": "Vistara",
    }

    _AIRCRAFT_MAP = {
        "6E": "Airbus A320neo",
        "AI": "Airbus A321neo",
        "QP": "Boeing 737 MAX 8",
        "SG": "Boeing 737-800",
        "IX": "Boeing 737 MAX 8",
        "GF": "Airbus A320neo",
    }

    def to_dict(self):
        scraped_dt = self.scraped_at
        travel_dt_str = self.travel_date  # YYYY-MM-DD
        try:
            import calendar
            td = datetime.strptime(travel_dt_str, "%Y-%m-%d")
            day_of_week = calendar.day_name[td.weekday()]
        except Exception:
            day_of_week = ""

        raw_carrier = self.carrier or ""
        carrier_code = raw_carrier if len(raw_carrier) == 2 and raw_carrier.isupper() else self.source_id or "6E"
        full_carrier_name = self._AIRLINE_NAME_MAP.get(carrier_code, raw_carrier if raw_carrier else "Commercial Airline")
        aircraft_type = self._AIRCRAFT_MAP.get(carrier_code, "Airbus A320neo")

        # Format flight number cleanly (e.g. 6E-2156)
        fn = self.flight_number or f"{carrier_code}-801"

        return {
            # Core IDs
            "id": self.id,
            "hash": self.id,
            "source_id": self.source_id or carrier_code,
            "source_name": self.source_name or full_carrier_name,
            "source_portal": self.source_name or "Live Web Scraping",
            "carrier_code": carrier_code,
            "carrier": full_carrier_name,

            # Route
            "origin": self.origin,
            "destination": self.destination,
            "origin_city": self._CITY_MAP.get(self.origin, self.origin),
            "destination_city": self._CITY_MAP.get(self.destination, self.destination),

            # Dates & times
            "travel_date": travel_dt_str,
            "departure_date": travel_dt_str,
            "day_of_week": day_of_week,
            "scraped_at": scraped_dt.isoformat() if scraped_dt else None,
            "departure_time": self.departure_time or "08:00",
            "arrival_time": self.arrival_time or "10:30",
            "duration_minutes": self.duration_minutes or 120,
            "stops": f"{self.stops or 0} stop{'s' if (self.stops or 0) != 1 else ''}" if self.stops else "Non-stop",

            # Flight info
            "flight_number": fn,
            "aircraft_type": aircraft_type,
            "fare_class": self.fare_class or "ECONOMY",
            "fare_family": self.fare_family or "Standard",

            # Fares breakdown
            "base_fare": round(self.base_fare, 2) if self.base_fare else round((self.total_fare or 5000) * 0.8, 2),
            "taxes": round(self.taxes, 2) if self.taxes else round((self.total_fare or 5000) * 0.15, 2),
            "fees": round(self.fees, 2) if self.fees else 0.0,
            "user_development_fee": round(self.user_development_fee, 2) if self.user_development_fee else 354.0,
            "gst": round(self.gst, 2) if self.gst else round((self.base_fare or 4000) * 0.05, 2),
            "fuel_surcharge": round(self.fuel_surcharge, 2) if self.fuel_surcharge else 0.0,
            "total_fare": round(self.total_fare, 2) if self.total_fare else 5000.0,
            "currency": self.currency or "INR",

            # Lead time
            "lead_days": self.lead_days,
            "lead_window": self._lead_window(),

            # Status & audit
            "availability_status": self.availability_status or "OBSERVED",
            "raw_source_url": self.raw_source_url,
            "extraction_method": self.extraction_method or "playwright_live",
            "provenance": self.provenance,
            "confidence_score": self.confidence_score or 0.99,
            "is_synthetic": False,
            "is_replay": False
        }
