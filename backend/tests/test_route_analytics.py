"""
Unit and Integration Tests for Route Analytics, Heatmap Matrix, and Carrier Spread Pipelines
============================================================================================
"""

import unittest
import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.app import app, db
from backend.models import FlightObservation


class TestRouteAnalyticsAndHeatmap(unittest.TestCase):

    def setUp(self):
        self.app = app
        self.client = app.test_client()
        self.ctx = app.app_context()
        self.ctx.push()

    def tearDown(self):
        self.ctx.pop()

    def test_heatmap_endpoint_structure(self):
        res = self.client.get('/api/analytics/heatmap')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["status"], "success")
        self.assertIn("windows", data)
        self.assertIn("routes", data)
        self.assertIn("matrix", data)
        self.assertIn("global_stats", data)

        # Check windows
        self.assertIn("T+1", data["windows"])
        self.assertIn("T+7", data["windows"])
        self.assertIn("T+15", data["windows"])
        self.assertIn("T+30", data["windows"])
        self.assertIn("T+45", data["windows"])

    def test_heatmap_corridors_and_matrix_cells(self):
        res = self.client.get('/api/analytics/heatmap')
        data = res.get_json()
        
        # Verify routes contain standard trunk routes
        route_ids = [r["route_id"] for r in data["routes"]]
        self.assertIn("DEL-BOM", route_ids)
        self.assertIn("BOM-BLR", route_ids)
        self.assertIn("DEL-BLR", route_ids)

        # Check DEL-BOM T+7 cell
        del_bom = data["matrix"].get("DEL-BOM")
        self.assertIsNotNone(del_bom)
        t7_cell = del_bom.get("T+7")
        if t7_cell:
            self.assertIn("avg_fare", t7_cell)
            self.assertIn("quote_count", t7_cell)
            self.assertIn("jevons_index", t7_cell)
            self.assertGreater(t7_cell["quote_count"], 0)
            self.assertGreater(t7_cell["avg_fare"], 0)

    def test_carrier_analytics_endpoint(self):
        res = self.client.get('/api/analytics/carriers')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["status"], "success")
        self.assertIn("carriers", data)
        self.assertIn("fsc_vs_lcc", data)

        carriers = data["carriers"]
        self.assertGreater(len(carriers), 0)

        # Check market share sum
        total_share = sum(c["market_share_percent"] for c in carriers)
        self.assertAlmostEqual(total_share, 100.0, delta=1.5)

        # Check IndiGo and Air India present
        carrier_codes = [c["code"] for c in carriers]
        self.assertIn("6E", carrier_codes)
        self.assertIn("AI", carrier_codes)

    def test_fsc_vs_lcc_spread_computation(self):
        res = self.client.get('/api/analytics/carriers')
        data = res.get_json()
        fsc_vs_lcc = data.get("fsc_vs_lcc", {})
        
        self.assertIn("fsc_mean", fsc_vs_lcc)
        self.assertIn("lcc_mean", fsc_vs_lcc)
        self.assertIn("fsc_premium_percent", fsc_vs_lcc)

        # FSC mean should be positive and computed from real quotes
        if fsc_vs_lcc["fsc_quote_count"] > 0 and fsc_vs_lcc["lcc_quote_count"] > 0:
            self.assertGreater(fsc_vs_lcc["fsc_mean"], 0)
            self.assertGreater(fsc_vs_lcc["lcc_mean"], 0)

    def test_explain_endpoint_all_tabs(self):
        for tab in ['route', 'horizon', 'fare', 'source']:
            res = self.client.get(f'/api/explain?tab={tab}')
            self.assertEqual(res.status_code, 200)
            data = res.get_json()
            self.assertEqual(data["status"], "success")
            self.assertEqual(data["tab"], tab)
            self.assertIn("waterfall", data)
            self.assertIn("ledger", data)
            self.assertIn("aixplain", data)
            self.assertGreater(len(data["waterfall"]), 0)
            self.assertGreater(len(data["ledger"]), 0)
            self.assertIn("headline", data["aixplain"])


if __name__ == "__main__":
    unittest.main()
