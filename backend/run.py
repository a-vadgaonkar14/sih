"""
AVIA / APIx India - Backend Launcher
"""
import os
import sys

# Ensure current directory is in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from backend.app import app

if __name__ == "__main__":
    import subprocess
    print("Ensure Playwright chromium is installed...")
    try:
        subprocess.run([sys.executable, "-m", "playwright", "install", "chromium"], check=True)
    except Exception as e:
        print(f"Playwright install failed: {e}")

    # Start APScheduler for daily feed
    try:
        from apscheduler.schedulers.background import BackgroundScheduler
        from backend.scrapers.scheduler import generate_schedule
        scheduler = BackgroundScheduler()
        # Run daily at midnight
        scheduler.add_job(func=lambda: generate_schedule(app.app_context), trigger="cron", hour=0, minute=0)
        scheduler.start()
        print("✅ Daily scraper scheduler started (runs at 00:00).")
    except Exception as e:
        print(f"Failed to start scheduler: {e}")

    port = int(os.environ.get("PORT", 5001))
    print("==================================================================")
    print("  🏛️ AVIA (Airfare Variation & Index Analytics) / APIx India")
    print("  📊 Real-time Airfare Price Index & Policy Simulation Server")
    print(f"  📍 Backend API Running at: http://127.0.0.1:{port}")
    print("==================================================================")
    app.run(host="0.0.0.0", port=port, debug=False, threaded=True)
