# AVIA / APIx Migration Notes

This document provides a comprehensive audit of the files, components, and synthetic logic removed during the rewrite of the AVIA / APIx India acquisition and analytics layers to strictly adhere to the project's non-negotiable principles.

## 1. Removed Files

### `backend/data/avia_data.py`
**Reason for Deletion:**
This file contained the core "fake data" engine. It included:
- `generate_historical_apix_series()`: A function that explicitly back-filled deterministic "realistic-looking" synthetic history using randomized walks and hardcoded day-of-week factors. This violated the principle that all data must be real, observed records.
- `get_waterfall_decomposition()`: Returned hardcoded literals for the analytics dashboard.
- `get_scraper_operations_status()`: Partially mocked the scraper health by assigning synthetic uptime and latency values instead of computing from actual job data.
- Hardcoded constants and dummy logic.

### `backend/compliance.py`
**Reason for Deletion:**
This file contained a static, hardcoded dictionary (`SOURCE_REGISTRY`) that explicitly defined `robots_allowed=True` for sources without making actual network calls, thus acting as a fake compliance gate. We moved the real compliance checking logic (which fetches actual `robots.txt`) to `backend/scrapers/compliance.py`.

### `backend/tools/test_acquisition.py`, `backend/tools/test_easemytrip.py`, `backend/tools/test_googleflights.py`, `backend/tools/find_gf_classes.py`
**Reason for Deletion:**
These one-off scraping scripts and debug tools were disconnected from the main application's real request path. Many were remnants of previous iterations utilizing anti-bot logic or unmaintained crawler variants. They have been deleted to enforce a single, cohesive `ScrapeManager` acquisition pipeline.

## 2. Removed Anti-Bot / Stealth Logic

- The `playwright-stealth` library and related plugins have been entirely stripped from the codebase.
- Any uses of `random.uniform(x, y)` to simulate human sleep or browsing behaviors were removed.
- Chromium instances are now launched without evasion flags (e.g., `--disable-blink-features=AutomationControlled` is no longer used).
- If a source blocks the headless browser or presents a CAPTCHA, the `ScrapeManager` gracefully logs it as `BLOCKED` or `SOURCE_UNAVAILABLE` rather than attempting to bypass the security control.

## 3. Removed Estimated Fare Logic

- The codebase previously lacked real base fare vs. tax breakdowns in some instances, and would estimate taxes as a hardcoded 28% of the total fare in `compute_lead_time_elasticity_matrix()`. This logic was stripped.
- Missing fields in the final `FlightObservation` entity are now stored as explicitly `null`.

## 4. Lineage Hashing Standardization

- Replaced the unsafe pseudo-hashing (`"0x" + hashlib.sha256(raw_str.encode()).hexdigest()[:16]`) found in `avia_data.py` with standard `hashlib.sha256(canonical_payload.encode()).hexdigest()` across the entire stack for reliable deduplication.
