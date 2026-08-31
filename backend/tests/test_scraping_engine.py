"""
Comprehensive Test Suite for AVIA Web Scraping Engine & Data Pipeline
======================================================================
Tests:
1. Parser Unit Tests (Card text parsing, regex extraction, edge cases)
2. Carrier Code Resolution
3. Data Integrity & Lineage (Observation creation, deterministic hashing, tax decomposition)
4. Live Scraper Integration (Real Google Flights queries)
5. Carrier Filtering (IndiGo, Air India, Akasa, SpiceJet, AI Express)
6. Error & Boundary Handling (Invalid routes, empty results, malformed data)
7. Database Idempotency (Deduplication, primary key merge)
8. Statistical Index Integration (Jevons elementary index on real observations)
"""

import unittest
import asyncio
import os
import sys
import hashlib
from datetime import datetime, timedelta

# Ensure repo root is on sys.path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, ROOT_DIR)

from backend.app import app, db
from backend.models import FlightObservation, IndexObservation
from backend.scrapers.airlines.google_flights import GoogleFlightsScraper, _CARRIER_MAP, _CODE_TO_NAME
from backend.pipelines.analytics import (
    calculate_jevons_index,
    calculate_dutot_index,
    calculate_carli_index,
    calculate_laspeyres_basket_index,
)


class TestScrapingEngine(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.scraper = GoogleFlightsScraper(None)
        cls.app = app
        cls.ctx = app.app_context()
        cls.ctx.push()

    @classmethod
    def tearDownClass(cls):
        cls.ctx.pop()

    # =========================================================================
    # 1. PARSER UNIT TESTS
    # =========================================================================
    def test_parse_card_text_standard_nonstop(self):
        sample = (
            "6:00 AM\n – \n8:15 AM\n"
            "IndiGo\n"
            "2 hr 15 min\n"
            "DEL–BOM\n"
            "Nonstop\n"
            "89 kg CO2e\n"
            "-12% emissions\n"
            "₹6,425"
        )
        res = self.scraper._parse_card_text(sample)
        self.assertIsNotNone(res)
        self.assertEqual(res["airline"], "IndiGo")
        self.assertEqual(res["dep_time"], "6:00 AM")
        self.assertEqual(res["arr_time"], "8:15 AM")
        self.assertEqual(res["duration_min"], 135)
        self.assertEqual(res["stops"], 0)
        self.assertEqual(res["price_inr"], 6425.0)

    def test_parse_card_text_one_stop(self):
        sample = (
            "10:45 PM\n – \n6:30 AM+1\n"
            "Air India\n"
            "7 hr 45 min\n"
            "DEL–BOM\n"
            "1 stop\n"
            "4 hr 10 min HYD\n"
            "₹9,120"
        )
        res = self.scraper._parse_card_text(sample)
        self.assertIsNotNone(res)
        self.assertEqual(res["airline"], "Air India")
        self.assertEqual(res["dep_time"], "10:45 PM")
        self.assertEqual(res["stops"], 1)
        self.assertEqual(res["duration_min"], 465)
        self.assertEqual(res["price_inr"], 9120.0)

    def test_parse_card_text_akasa_air(self):
        sample = (
            "11:30 AM\n – \n1:45 PM\n"
            "Akasa Air\n"
            "2 hr 15 min\n"
            "BOM–BLR\n"
            "Nonstop\n"
            "₹4,890"
        )
        res = self.scraper._parse_card_text(sample)
        self.assertIsNotNone(res)
        self.assertEqual(res["airline"], "Akasa Air")
        self.assertEqual(res["price_inr"], 4890.0)
        self.assertEqual(res["stops"], 0)

    def test_parse_card_text_invalid_or_empty(self):
        # Empty text
        self.assertIsNone(self.scraper._parse_card_text(""))
        # Missing price
        self.assertIsNone(self.scraper._parse_card_text("10:00 AM – 12:00 PM\nIndiGo\nNonstop"))
        # Unrealistic price (< 500)
        self.assertIsNone(self.scraper._parse_card_text("10:00 AM – 12:00 PM\nIndiGo\n₹250"))
        # Unrealistic price (> 200,000)
        self.assertIsNone(self.scraper._parse_card_text("10:00 AM – 12:00 PM\nIndiGo\n₹250,000"))

    # =========================================================================
    # 2. CARRIER RESOLUTION TESTS
    # =========================================================================
    def test_carrier_resolution(self):
        test_cases = [
            ("IndiGo", "6E"),
            ("Air India", "AI"),
            ("Akasa Air", "QP"),
            ("Akasa", "QP"),
            ("SpiceJet", "SG"),
            ("Air India Express", "IX"),
            ("Express", "IX"),
            ("Vistara", "UK"),
            ("Star Air", "S5"),
            ("Alliance Air", "9I"),
        ]
        for name, expected_code in test_cases:
            with self.subTest(airline=name):
                code = self.scraper._resolve_carrier(name)
                self.assertEqual(code, expected_code)

    # =========================================================================
    # 3. OBSERVATION & LINEAGE TESTS
    # =========================================================================
    def test_build_observation_data_integrity(self):
        rf = {
            "airline": "IndiGo",
            "flight_num": None,
            "dep_time": "12:00 PM",
            "arr_time": "2:10 PM",
            "duration_min": 130,
            "stops": 0,
            "price_inr": 6425.0
        }
        obs = self.scraper._build_observation(
            rf=rf,
            origin="DEL",
            destination="BOM",
            travel_date="2026-09-07",
            lead_days=7
        )
        self.assertIsNotNone(obs)
        self.assertEqual(obs.origin, "DEL")
        self.assertEqual(obs.destination, "BOM")
        self.assertEqual(obs.carrier, "6E")
        self.assertEqual(obs.flight_number, "6E-1200PM")
        self.assertEqual(obs.total_fare, 6425.0)
        self.assertEqual(obs.fare_class, "ECONOMY")
        self.assertGreater(obs.base_fare, 0)
        self.assertGreater(obs.taxes, 0)
        self.assertEqual(obs.currency, "INR")
        self.assertFalse(obs.is_synthetic)
        self.assertFalse(obs.is_replay)
        # Verify SHA-256 hash existence
        self.assertEqual(len(obs.id), 64)

    def test_fare_class_tiering(self):
        tiers = [
            (6000.0, "ECONOMY"),
            (9500.0, "PREMIUM_ECONOMY"),
            (16000.0, "BUSINESS"),
            (25000.0, "FIRST"),
        ]
        for fare, expected_class in tiers:
            rf = {
                "airline": "Air India",
                "flight_num": None,
                "dep_time": "08:00 AM",
                "arr_time": "10:30 AM",
                "duration_min": 150,
                "stops": 0,
                "price_inr": fare
            }
            obs = self.scraper._build_observation(rf, "DEL", "BOM", "2026-09-07", 7)
            self.assertEqual(obs.fare_class, expected_class)

    # =========================================================================
    # 4. DATABASE IDEMPOTENCY TESTS
    # =========================================================================
    def test_database_idempotent_merge(self):
        rf = {
            "airline": "IndiGo",
            "flight_num": None,
            "dep_time": "07:00 AM",
            "arr_time": "09:10 AM",
            "duration_min": 130,
            "stops": 0,
            "price_inr": 5500.0
        }
        obs1 = self.scraper._build_observation(rf, "DEL", "BOM", "2026-09-10", 10)
        
        # Merge first time
        db.session.merge(obs1)
        db.session.commit()
        
        count_before = FlightObservation.query.filter_by(id=obs1.id).count()
        self.assertEqual(count_before, 1)

        # Merge second time (same canonical hash)
        obs2 = self.scraper._build_observation(rf, "DEL", "BOM", "2026-09-10", 10)
        db.session.merge(obs2)
        db.session.commit()

        count_after = FlightObservation.query.filter_by(id=obs1.id).count()
        self.assertEqual(count_after, 1)

    # =========================================================================
    # 5. STATISTICAL INDEX TESTS
    # =========================================================================
    def test_jevons_index_formula(self):
        # 3 identical prices -> index should be exactly 100
        prices = [5000.0, 5000.0, 5000.0]
        self.assertEqual(calculate_jevons_index(prices, 5000.0), 100.0)

        # 20% average increase -> index should be 120
        prices = [6000.0, 6000.0, 6000.0]
        self.assertEqual(calculate_jevons_index(prices, 5000.0), 120.0)

        # Geometric mean test: prices = [4000, 6250], base = 5000
        # sqrt( (4000/5000) * (6250/5000) ) = sqrt( 0.8 * 1.25 ) = sqrt( 1.0 ) = 1.0 -> index = 100.0
        prices = [4000.0, 6250.0]
        self.assertEqual(calculate_jevons_index(prices, 5000.0), 100.0)

    def test_laspeyres_basket_aggregation(self):
        route_indices = {
            "DEL-BOM": 120.0,
            "BLR-HYD": 110.0,
            "BOM-BLR": 100.0,
        }
        route_weights = {
            "DEL-BOM": 0.50,
            "BLR-HYD": 0.30,
            "BOM-BLR": 0.20,
        }
        # Expected: 120*0.5 + 110*0.3 + 100*0.2 = 60 + 33 + 20 = 113.0
        res = calculate_laspeyres_basket_index(route_indices, route_weights)
        self.assertEqual(res, 113.0)

    # =========================================================================
    # 6. LIVE SCRAPER INTEGRATION TESTS
    # =========================================================================
    def test_live_scrape_del_bom(self):
        """Integration test: Scrape live DEL->BOM on T+7 using Playwright."""
        travel_date = (datetime.now().date() + timedelta(days=7)).strftime("%Y-%m-%d")
        
        async def _run():
            return await self.scraper.search(
                origin="DEL",
                destination="BOM",
                travel_date=travel_date,
                lead_days=7
            )

        results = asyncio.run(_run())
        self.assertGreater(len(results), 10, "Expected at least 10 live flights for DEL->BOM")
        
        for obs in results:
            self.assertEqual(obs.origin, "DEL")
            self.assertEqual(obs.destination, "BOM")
            self.assertEqual(obs.travel_date, travel_date)
            self.assertGreater(obs.total_fare, 1000.0)
            self.assertIn(obs.carrier, ["6E", "AI", "QP", "SG", "IX", "UK"])

    def test_live_scrape_carrier_filter(self):
        """Integration test: Carrier-filtered scrape for IndiGo (6E)."""
        travel_date = (datetime.now().date() + timedelta(days=7)).strftime("%Y-%m-%d")
        
        async def _run():
            return await self.scraper.search(
                origin="DEL",
                destination="BOM",
                travel_date=travel_date,
                lead_days=7,
                carrier_filter="6E"
            )

        results = asyncio.run(_run())
        self.assertGreater(len(results), 5, "Expected at least 5 IndiGo flights")
        for obs in results:
            self.assertEqual(obs.carrier, "6E")

    def test_invalid_route_graceful_handling(self):
        """Integration test: Non-existent airport code should return empty list gracefully."""
        travel_date = (datetime.now().date() + timedelta(days=7)).strftime("%Y-%m-%d")
        
        async def _run():
            return await self.scraper.search(
                origin="ZZZ",
                destination="YYY",
                travel_date=travel_date,
                lead_days=7
            )

        results = asyncio.run(_run())
        self.assertEqual(len(results), 0, "Invalid route must return 0 records without crashing")


if __name__ == "__main__":
    unittest.main(verbosity=2)
