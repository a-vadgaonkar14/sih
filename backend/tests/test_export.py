"""
Unit Tests for Export Endpoint
================================
"""

import unittest
import os
import sys
import json

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.app import app

class TestExportEndpoint(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.ctx = app.app_context()
        self.ctx.push()

    def tearDown(self):
        self.ctx.pop()

    def test_export_csv(self):
        """Test that the export endpoint correctly defaults to CSV format"""
        res = self.client.get('/api/export')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.mimetype, 'text/csv')
        self.assertIn('text/csv', res.headers.get('Content-Type'))
        self.assertIn('attachment;filename=APIx_India_Airfare_Observations.csv', res.headers.get('Content-Disposition'))

    def test_export_json(self):
        """Test that the export endpoint correctly handles JSON format"""
        res = self.client.get('/api/export?format=json')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.mimetype, 'application/json')
        self.assertIn('attachment;filename=APIx_India_Airfare_Observations.json', res.headers.get('Content-Disposition'))
        
        # Verify it is valid JSON
        data = json.loads(res.data)
        self.assertIsInstance(data, list)

if __name__ == '__main__':
    unittest.main()
