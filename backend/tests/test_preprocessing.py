"""
Unit and Integration Tests for Preprocessing & Outlier Detection Pipeline
========================================================================
"""

import unittest
import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.app import app, db
from backend.pipelines.preprocessing import (
    calculate_z_scores,
    calculate_modified_z_score,
    annotate_observations_with_outliers,
    get_outlier_summary_stats
)


class TestPreprocessingAndOutliers(unittest.TestCase):

    def test_z_score_calculation(self):
        # Sample prices with one clear surge outlier
        prices = [5000.0, 5200.0, 4900.0, 5100.0, 5050.0, 25000.0]
        results = calculate_z_scores(prices)
        self.assertEqual(len(results), 6)

        # The 25000 fare should have high Z-score and be flagged as outlier
        surge_result = results[5]
        self.assertEqual(surge_result[0], 25000.0)
        self.assertGreater(surge_result[1], 2.0)
        self.assertTrue(surge_result[2])

        # Normal fares should not be outliers
        self.assertFalse(results[0][2])

    def test_modified_z_score_calculation(self):
        # Robust MAD outlier test
        prices = [6000.0, 6100.0, 6050.0, 5950.0, 6000.0, 35000.0]
        results = calculate_modified_z_score(prices)
        self.assertEqual(len(results), 6)

        surge_result = results[5]
        self.assertEqual(surge_result[0], 35000.0)
        self.assertGreater(surge_result[1], 3.0)
        self.assertTrue(surge_result[2])

    def test_stratified_observation_annotation(self):
        records = [
            # Group 1: DEL-BOM T+1 (Mean ~10,000)
            {"origin": "DEL", "destination": "BOM", "lead_window": "T+1", "total_fare": 9800.0},
            {"origin": "DEL", "destination": "BOM", "lead_window": "T+1", "total_fare": 10200.0},
            {"origin": "DEL", "destination": "BOM", "lead_window": "T+1", "total_fare": 10000.0},
            {"origin": "DEL", "destination": "BOM", "lead_window": "T+1", "total_fare": 32000.0}, # Outlier in this group

            # Group 2: BLR-HYD T+30 (Mean ~3,000)
            {"origin": "BLR", "destination": "HYD", "lead_window": "T+30", "total_fare": 2900.0},
            {"origin": "BLR", "destination": "HYD", "lead_window": "T+30", "total_fare": 3100.0},
            {"origin": "BLR", "destination": "HYD", "lead_window": "T+30", "total_fare": 3000.0},
        ]

        annotated = annotate_observations_with_outliers(records)
        self.assertEqual(len(annotated), 7)

        # Check the surge outlier on DEL-BOM
        del_bom_outlier = annotated[3]
        self.assertEqual(del_bom_outlier["total_fare"], 32000.0)
        self.assertTrue(del_bom_outlier["is_outlier"])
        self.assertEqual(del_bom_outlier["outlier_direction"], "HIGH_PRICE_SURGE")

        # Check BLR-HYD records are normal despite being lower than DEL-BOM
        blr_hyd_norm = annotated[4]
        self.assertFalse(blr_hyd_norm["is_outlier"])
        self.assertEqual(blr_hyd_norm["outlier_severity"], "NORMAL")

    def test_outlier_summary_stats(self):
        records = [
            {"is_outlier": True, "outlier_severity": "EXTREME_OUTLIER", "outlier_direction": "HIGH_PRICE_SURGE"},
            {"is_outlier": True, "outlier_severity": "MILD_OUTLIER", "outlier_direction": "LOW_PRICE_ANOMALY"},
            {"is_outlier": False, "outlier_severity": "NORMAL", "outlier_direction": None},
            {"is_outlier": False, "outlier_severity": "NORMAL", "outlier_direction": None},
        ]
        stats = get_outlier_summary_stats(records)
        self.assertEqual(stats["total_records"], 4)
        self.assertEqual(stats["outlier_count"], 2)
        self.assertEqual(stats["outlier_percentage"], 50.0)
        self.assertEqual(stats["extreme_outliers"], 1)
        self.assertEqual(stats["mild_outliers"], 1)
        self.assertEqual(stats["high_surges"], 1)
        self.assertEqual(stats["low_anomalies"], 1)
        self.assertEqual(stats["clean_records"], 2)

    def test_api_outlier_filter(self):
        with app.test_client() as client:
            res = client.get('/api/data?outliers_only=true')
            self.assertEqual(res.status_code, 200)
            data = res.get_json()
            self.assertIn("data", data)
            # All returned records must have is_outlier == True
            for item in data["data"]:
                self.assertTrue(item.get("is_outlier"))


if __name__ == "__main__":
    unittest.main()
