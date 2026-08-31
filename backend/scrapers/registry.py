from typing import Type, Dict
from backend.scrapers.base import BaseFlightScraper

from backend.scrapers.airlines.indigo import IndiGoScraper
from backend.scrapers.airlines.airindia import AirIndiaScraper
from backend.scrapers.airlines.akasa import AkasaAirScraper
from backend.scrapers.airlines.spicejet import SpiceJetScraper
from backend.scrapers.airlines.express import AirIndiaExpressScraper
from backend.scrapers.airlines.google_flights import GoogleFlightsScraper

# Map of source_id to Scraper Class
SCRAPER_REGISTRY: Dict[str, Type[BaseFlightScraper]] = {
    "6E": IndiGoScraper,
    "AI": AirIndiaScraper,
    "QP": AkasaAirScraper,
    "SG": SpiceJetScraper,
    "IX": AirIndiaExpressScraper,
    "GF": GoogleFlightsScraper,
}

def get_scraper_class(source_id: str) -> Type[BaseFlightScraper]:
    return SCRAPER_REGISTRY.get(source_id)
