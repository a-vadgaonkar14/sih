from typing import List
from backend.models import FlightObservation
from backend.scrapers.airlines.google_flights import GoogleFlightsScraper

class AirIndiaScraper(GoogleFlightsScraper):
    source_id = "AI"
    source_name = "Air India"
    domain = "https://www.airindia.com"

    async def search(self, origin: str, destination: str, travel_date: str, lead_days: int) -> List[FlightObservation]:
        """Live web scraping for Air India flights without hardcoded datasets."""
        return await super().search(
            origin=origin,
            destination=destination,
            travel_date=travel_date,
            lead_days=lead_days,
            carrier_filter="AI"
        )
