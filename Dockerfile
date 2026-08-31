# ==========================================
# Stage 1: Build Frontend (React / Vite)
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ==========================================
# Stage 2: Production Python & Playwright Runtime
# ==========================================
FROM python:3.11-slim
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=5001
WORKDIR /app

# Install system dependencies & Playwright dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright Chromium browser
RUN playwright install chromium

# Copy Python Backend code & data
COPY backend/ ./backend/

# Optional seed payload — the bracket makes this a glob, so the build
# won't fail if the file isn't committed to the repo.
COPY live_airfare_payload.jso[n] .

# Copy compiled frontend from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose production port
EXPOSE 5001

# Run with Gunicorn WSGI server
CMD ["sh", "-c", "gunicorn --workers=2 --threads=4 --timeout=120 --bind=0.0.0.0:${PORT:-5001} backend.app:app"]
