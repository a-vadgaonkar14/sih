import os
import sys
import pytest
import urllib.parse

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.scrapers.compliance import check_source_compliance
from backend.models import Source
from backend.database.db import db
from backend.app import app

@pytest.fixture
def app_ctx():
    with app.app_context():
        yield app
        db.session.rollback()

def test_compliance_allows_permitted_source(app_ctx):
    src = Source.query.filter_by(source_id="TEST").first()
    if not src:
        src = Source(source_id="TEST", source_name="Test Source", domain="https://test.com", scraping_allowed=True, enabled=True)
        db.session.add(src)
    else:
        src.scraping_allowed = True
        src.enabled = True
    db.session.commit()
    
    assert check_source_compliance("TEST", "https://test.com/flights") is True

def test_compliance_blocks_disallowed_source(app_ctx):
    src = Source.query.filter_by(source_id="TEST2").first()
    if not src:
        src = Source(source_id="TEST2", source_name="Test Source 2", domain="https://test2.com", scraping_allowed=False, enabled=True)
        db.session.add(src)
    else:
        src.scraping_allowed = False
        src.enabled = True
    db.session.commit()
    
    assert check_source_compliance("TEST2", "https://test2.com/flights") is False
    
    # Check that status was updated
    src_db = db.session.get(Source, "TEST2")
    assert src_db.current_status == "COMPLIANCE_BLOCKED"
