from typing import List
from backend.models import FlightObservation
from backend.scrapers.airlines.google_flights import GoogleFlightsScraper

class IndiGoScraper(GoogleFlightsScraper):
    source_id = "6E"
    source_name = "IndiGo"
    domain = "https://www.goindigo.in"

    async def search(self, origin: str, destination: str, travel_date: str, lead_days: int) -> List[FlightObservation]:
        """Live web scraping for IndiGo flights without hardcoded datasets."""
        return await super().search(
            origin=origin,
            destination=destination,
            travel_date=travel_date,
            lead_days=lead_days,
            carrier_filter="6E"
        )
