"""
Integration Tests for AVIA / APIx India REST Endpoints & Index Pipelines
========================================================================
"""

import unittest
import os
import sys
import json
from datetime import datetime

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, ROOT_DIR)

from backend.app import app, db
from backend.models import FlightObservation, Route, Source
from backend.pipelines import (
    calculate_jevons_index,
    calculate_dutot_index,
    calculate_carli_index,
    calculate_laspeyres_basket_index,
    compute_route_index,
)


class TestAviaEndpointsAndPipelines(unittest.TestCase):

    def setUp(self):
        self.app = app
        self.client = app.test_client()
        self.ctx = app.app_context()
        self.ctx.push()

        # Seed sample verified observations if empty for endpoint testing
        obs = FlightObservation(
            id="test_obs_hash_001",
            source_id="GF",
            source_name="Google Flights",
            origin="DEL",
            destination="BOM",
            travel_date="2026-09-07",
            carrier="6E",
            flight_number="6E-101",
            departure_time="08:00 AM",
            arrival_time="10:15 AM",
            duration_minutes=135,
            stops=0,
            fare_class="ECONOMY",
            fare_family="Saver",
            base_fare=5000.0,
            taxes=1000.0,
            total_fare=6000.0,
            currency="INR",
            lead_days=7,
            availability_status="OBSERVED",
            extraction_method="playwright",
            is_synthetic=False,
            is_replay=False
        )
        db.session.merge(obs)
        db.session.commit()

    def tearDown(self):
        self.ctx.pop()

    # -------------------------------------------------------------
    # 1. API Endpoints
    # -------------------------------------------------------------
    def test_get_overview_endpoint(self):
        res = self.client.get('/api/overview')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("kpis", data)
        self.assertIn("dataset_status", data)
        self.assertEqual(data["dataset_status"], "LIVE")
        self.assertIn("lead_time_curves", data)
        self.assertGreaterEqual(len(data["lead_time_curves"]), 1)

    def test_get_operations_endpoint(self):
        res = self.client.get('/api/operations')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("operations", data)
        self.assertIn("sources", data["operations"])
        self.assertIn("kpis", data["operations"])

    def test_get_latest_fares_endpoint(self):
        res = self.client.get('/api/fares/latest')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("data", data)
        self.assertGreater(len(data["data"]), 0)

    def test_get_trust_endpoint(self):
        res = self.client.get('/api/trust')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["status"], "success")
        self.assertIn("trust_metrics", data)
        tm = data["trust_metrics"]
        self.assertIn("lineage_coverage_pct", tm)
        self.assertEqual(tm["lineage_coverage_pct"], 100.0)
        self.assertIn("outlier_queue", tm)
        self.assertIn("outlier_metrics", tm)
        self.assertIn("cleaning_pipeline_steps", tm)
        self.assertEqual(len(tm["cleaning_pipeline_steps"]), 5)

    def test_get_lineage_endpoint(self):
        res = self.client.get('/api/lineage/test_obs_hash_001')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["status"], "success")
        self.assertIn("lineage", data)
        lin = data["lineage"]
        self.assertIn("sha256_hash", lin)
        self.assertIn("route", lin)
        self.assertIn("carrier", lin)
        self.assertIn("normalization_pipeline", lin)
        self.assertIn("step_2_tax_split", lin["normalization_pipeline"])
        self.assertIn("raw_dom_evidence", lin)

    def test_get_scrape_status_not_found(self):
        res = self.client.get('/api/scrape/status/NON_EXISTENT_JOB_ID')
        self.assertEqual(res.status_code, 404)

    # -------------------------------------------------------------
    # 2. Pipeline Math Verification
    # -------------------------------------------------------------
    def test_jevons_vs_carli_vs_dutot(self):
        prices = [4000.0, 6000.0]
        jevons = calculate_jevons_index(prices, 5000.0)
        carli = calculate_carli_index(prices, 5000.0)
        dutot = calculate_dutot_index(prices, 5000.0)

        self.assertEqual(carli, 100.0)
        self.assertEqual(dutot, 100.0)
        self.assertEqual(jevons, 97.98)
        self.assertLessEqual(jevons, carli)


if __name__ == "__main__":
    unittest.main(verbosity=2)
