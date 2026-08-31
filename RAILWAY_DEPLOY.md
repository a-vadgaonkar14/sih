# 🚂 Railway Deployment Guide for AVIA / APIx India

This repository is **100% Railway Production Ready** with a unified multi-stage build serving both the **React Frontend** and **Python Flask API** seamlessly on a single port.

---

## 🚀 One-Click Deploy Steps on Railway

### Step 1: Connect your GitHub Repository
1. Go to [Railway Dashboard](https://railway.app/dashboard).
2. Click **"New Project"** ➔ **"Deploy from GitHub repo"**.
3. Select your repository (`sih.26`).

---

### Step 2: Automatic Build & Deployment
Railway will automatically detect the configuration files:
* **`Dockerfile`**: Builds the React / Vite frontend with Node 20, installs Python 3.11 with Playwright browser dependencies, and launches Gunicorn.
* **`railway.json`**: Points Railway directly to use the Dockerfile builder with automatic restart policies.
* **`Procfile`**: Configures the high-performance Gunicorn WSGI web server (`gunicorn --workers=2 --threads=4 --timeout=120 --bind=0.0.0.0:$PORT backend.app:app`).

---

### Step 3: Environment Variables (Optional)
In Railway's **Variables** tab for your service, you can optionally configure:

| Variable | Description | Default / Recommended |
| :--- | :--- | :--- |
| `PORT` | Auto-assigned by Railway | `5001` (handled automatically) |
| `PYTHONUNBUFFERED` | Live real-time log output | `1` |
| `VITE_API_URL` | Base API URL | Leave empty (runs on the same domain) |

---

### Step 4: Generate Public Domain
1. In your Railway service dashboard, click **"Settings"**.
2. Scroll to **"Networking"** ➔ Click **"Generate Domain"** (e.g. `avia-apix-india.up.railway.app`).
3. Open your generated domain to access the live dashboard!

---

## 🧪 Local Production Verification
You can verify the production build locally before pushing:

```bash
# 1. Build React frontend
cd frontend && npm install && npm run build && cd ..

# 2. Run with Gunicorn WSGI server
venv/bin/gunicorn --workers=2 --threads=4 --timeout=120 --bind=0.0.0.0:5001 backend.app:app

# 3. Access in browser
# http://127.0.0.1:5001/
```

---

## 🛠️ Included Production Architecture
* **Single Unified Port**: Both React SPA routing (`/`, `/analytics`, `/operations`, etc.) and REST API endpoints (`/api/overview`, `/api/data`, `/api/nso/cpi-feed`, `/api/analytics/elasticity-curves`, etc.) run on the same domain.
* **Playwright Headless Engine**: Includes Chromium binaries and libraries inside the container for on-demand live scraping.
* **Gunicorn WSGI**: Multi-threaded production server with 120-second timeout handling high-concurrency requests and Server-Sent Events (SSE).
