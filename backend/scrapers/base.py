import asyncio
import hashlib
import json
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from datetime import datetime

from backend.models import FlightObservation

class BaseFlightScraper(ABC):
    source_id: str
    source_name: str
    domain: str
    
    def __init__(self, page):
        self.page = page
        
    @abstractmethod
    async def search(self, origin: str, destination: str, travel_date: str, lead_days: int) -> List[FlightObservation]:
        """
        Executes a search and returns a list of normalized FlightObservations.
        Should raise appropriate errors if navigation or extraction fails.
        """
        raise NotImplementedError
        
    def _create_observation(self, 
                            origin: str, 
                            destination: str, 
                            travel_date: str, 
                            lead_days: int,
                            carrier: str,
                            flight_number: str,
                            departure_time: Optional[str] = None,
                            arrival_time: Optional[str] = None,
                            duration_minutes: Optional[int] = None,
                            stops: Optional[int] = None,
                            fare_class: Optional[str] = None,
                            fare_family: Optional[str] = None,
                            base_fare: Optional[float] = None,
                            taxes: Optional[float] = None,
                            fees: Optional[float] = None,
                            user_development_fee: Optional[float] = None,
                            gst: Optional[float] = None,
                            fuel_surcharge: Optional[float] = None,
                            total_fare: Optional[float] = None,
                            currency: str = "INR",
                            availability_status: str = "OBSERVED",
                            raw_source_url: Optional[str] = None,
                            provenance: Optional[Dict] = None) -> FlightObservation:
        """Helper to create a normalized and hashed FlightObservation."""
        
        # Calculate SHA-256 for stable deduplication
        canonical_payload = f"{self.source_id}|{origin}|{destination}|{travel_date}|{carrier}|{flight_number}|{departure_time}|{total_fare}"
        obs_hash = hashlib.sha256(canonical_payload.encode()).hexdigest()
        
        return FlightObservation(
            id=obs_hash,
            source_id=self.source_id,
            source_name=self.source_name,
            origin=origin,
            destination=destination,
            travel_date=travel_date,
            scraped_at=datetime.utcnow(),
            carrier=carrier,
            flight_number=flight_number,
            departure_time=departure_time,
            arrival_time=arrival_time,
            duration_minutes=duration_minutes,
            stops=stops,
            fare_class=fare_class,
            fare_family=fare_family,
            base_fare=base_fare,
            taxes=taxes,
            fees=fees,
            user_development_fee=user_development_fee,
            gst=gst,
            fuel_surcharge=fuel_surcharge,
            total_fare=total_fare,
            currency=currency,
            lead_days=lead_days,
            availability_status=availability_status,
            raw_source_url=raw_source_url,
            extraction_method="playwright",
            provenance=json.dumps(provenance) if provenance else None,
            is_synthetic=False,
            is_replay=False
        )

    def _calc_duration(self, dep: Optional[str], arr: Optional[str], default_minutes: int = 120) -> int:
        """Universal parser for flight duration between dep and arr times."""
        if not dep or not arr:
            return default_minutes
        for fmt in ("%H:%M", "%I:%M %p", "%I:%M%p", "%H:%M:%S"):
            try:
                d = datetime.strptime(dep.strip(), fmt)
                a = datetime.strptime(arr.strip(), fmt)
                diff = int((a - d).total_seconds() // 60)
                return diff if diff > 0 else diff + 1440
            except Exception:
                continue
        return default_minutes
