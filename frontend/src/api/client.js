/**
 * AVIA / APIx India Frontend API Client Layer
 */

const BASE_URL = import.meta.env.VITE_API_URL || '';

export async function fetchOverview(days = 30, day = '', fareType = 'total', flightClass = 'ALL') {
  const params = new URLSearchParams({ days });
  if (day && day !== 'ALL') params.append('day', day);
  if (fareType) params.append('fare_type', fareType);
  if (flightClass && flightClass !== 'ALL') params.append('flight_class', flightClass);
  const res = await fetch(`${BASE_URL}/api/overview?${params.toString()}`);
  return res.json();
}

export async function fetchObservations(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '' && v !== 'ALL') {
      query.append(k, v);
    }
  });
  const res = await fetch(`${BASE_URL}/api/data?${query.toString()}`);
  return res.json();
}

export async function fetchRoutes() {
  const res = await fetch(`${BASE_URL}/api/routes`);
  return res.json();
}

export async function fetchHeatmapAnalytics() {
  const res = await fetch(`${BASE_URL}/api/analytics/heatmap`);
  return res.json();
}

export async function fetchCarrierAnalytics() {
  const res = await fetch(`${BASE_URL}/api/analytics/carriers`);
  return res.json();
}

export async function fetchExplain(tab = 'route') {
  const res = await fetch(`${BASE_URL}/api/explain?tab=${tab}`);
  return res.json();
}

export async function fetchSimulation(scenario = {}) {
  const res = await fetch(`${BASE_URL}/api/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scenario),
  });
  return res.json();
}

export async function fetchTrustMetrics() {
  const res = await fetch(`${BASE_URL}/api/trust`);
  return res.json();
}

export async function fetchOperations() {
  const res = await fetch(`${BASE_URL}/api/operations`);
  return res.json();
}

export async function fetchLineage(quoteId) {
  const res = await fetch(`${BASE_URL}/api/lineage/${quoteId}`);
  return res.json();
}

export async function triggerLiveScrape(origin, dest, date, carrier = 'ALL', sources = ['googleflights']) {
  const params = new URLSearchParams({
    origin,
    dest,
    date,
    carrier,
    sources: sources.join(','),
  });
  const res = await fetch(`${BASE_URL}/api/scrape?${params.toString()}`);
  return res.json();
}

export async function triggerBatchScrape(payload) {
  const res = await fetch(`${BASE_URL}/api/batch-scrape`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function triggerFullScrape() {
  const res = await fetch(`${BASE_URL}/api/scrape/all`, {
    method: 'POST'
  });
  return res.json();
}

export async function fetchScrapeStatus(jobId) {
  const res = await fetch(`${BASE_URL}/api/scrape/status/${jobId}`);
  return res.json();
}

export async function fetchRbiMacroFeed(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '' && v !== 'ALL') {
      query.append(k, v);
    }
  });
  const res = await fetch(`${BASE_URL}/api/rbi/macro-feed?${query.toString()}`);
  return res.json();
}

export async function fetchNsoCpiFeed(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '' && v !== 'ALL') {
      query.append(k, v);
    }
  });
  const res = await fetch(`${BASE_URL}/api/nso/cpi-feed?${query.toString()}`);
  return res.json();
}

export function connectTelemetryStream(onMessage, onError) {
  try {
    const sse = new EventSource(`${BASE_URL}/api/stream-logs`);
    sse.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data);
        onMessage(parsed);
      } catch {
        // keepalive or non-json
      }
    };
    sse.onerror = (err) => {
      if (onError) onError(err);
    };
    return sse;
  } catch (err) {
    if (onError) onError(err);
    return null;
  }
}
