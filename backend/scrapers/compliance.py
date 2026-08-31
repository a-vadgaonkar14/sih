import urllib.robotparser
import urllib.parse
from datetime import datetime
from backend.database.db import db
from backend.models import Source

def check_source_compliance(source_id: str, url_to_scrape: str) -> bool:
    """
    Checks if scraping is permitted for the given source and URL.
    Updates the database with the compliance result.
    """
    source = db.session.get(Source, source_id)
    if not source:
        return False
        
    if not source.enabled:
        return False
        
    if source.scraping_allowed is False:
        source.current_status = "COMPLIANCE_BLOCKED"
        db.session.commit()
        return False
        
    # Check robots.txt if provided
    if source.robots_url:
        try:
            rp = urllib.robotparser.RobotFileParser()
            rp.set_url(source.robots_url)
            rp.read()
            
            is_allowed = rp.can_fetch("*", url_to_scrape)
            
            source.robots_status = "ALLOWED" if is_allowed else "DISALLOWED"
            source.last_compliance_check = datetime.utcnow()
            
            if not is_allowed:
                source.current_status = "COMPLIANCE_BLOCKED"
                source.scraping_allowed = False
                db.session.commit()
                return False
                
        except Exception as e:
            source.robots_status = f"ERROR: {str(e)}"
            source.last_compliance_check = datetime.utcnow()
            db.session.commit()
            # If robots.txt fetch fails, we default to whatever the manual override says
            return source.scraping_allowed

    return source.scraping_allowed
