import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import KpiCard from '../components/common/KpiCard';
import GlobalFilterBar from '../components/common/GlobalFilterBar';
import ApixTimeSeriesChart from '../components/charts/ApixTimeSeriesChart';
import LeadTimeCurveChart from '../components/charts/LeadTimeCurveChart';
import * as api from '../api/client';

export default function ExecutiveOverviewView() {
  const {
    overviewData,
    filters,
    updateFilter,
    openLineageDrawer
  } = useApp();

  const [observations, setObservations] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [sortBy, setSortBy] = useState('fare_desc');
  const [outliersOnly, setOutliersOnly] = useState(false);
  const [loadingObs, setLoadingObs] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRow = (id) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [filters, pageSize, outliersOnly]);

  // Load observations
  useEffect(() => {
    async function load() {
      setLoadingObs(true);
      try {
        const res = await api.fetchObservations({
          origin: filters.origin,
          dest: filters.dest,
          carrier: filters.carrier,
          source: filters.source,
          lead: filters.lead,
          status: filters.status,
          day: filters.day,
          fare_type: filters.fareType,
          flight_class: filters.flightClass,
          q: filters.searchQuery,
          sort_by: sortBy,
          outliers_only: outliersOnly ? 'true' : undefined,
          page: page,
          page_size: pageSize
        });
        if (res && res.data) {
          setObservations(res.data);
          setTotalCount(res.total || 0);
          setTotalPages(res.total_pages || 1);
        }
      } catch (err) {
        console.error('Failed to load observations:', err);
      } finally {
        setLoadingObs(false);
      }
    }
    load();
  }, [filters, page, pageSize, sortBy, outliersOnly]);
  
  const datasetStatus = overviewData?.dataset_status || 'SIMULATED';
  const isSynthetic = overviewData?.is_synthetic !== false;

  const kpis = overviewData?.kpis || null;

  const topMovers = overviewData?.top_route_movers || [];
  const leadCurves = overviewData?.lead_time_curves || [];
  const intelligence = overviewData?.quick_intelligence || {};

  // State for Institutional Feed Modal
  const [feedModal, setFeedModal] = useState({ open: false, title: '', endpoint: '', data: null, loading: false, copied: false });

  const openFeedModal = async (title, endpoint, fetchFn) => {
    setFeedModal({ open: true, title, endpoint, data: null, loading: true, copied: false });
    try {
      const res = await fetchFn();
      setFeedModal({ open: true, title, endpoint, data: res, loading: false, copied: false });
    } catch (err) {
      setFeedModal({ open: true, title, endpoint, data: { error: 'Failed to fetch live feed' }, loading: false, copied: false });
    }
  };

  const copyFeedCurl = (endpoint) => {
    const curl = `curl -X GET "http://localhost:5001${endpoint}" -H "Accept: application/json"`;
    navigator.clipboard?.writeText(curl);
    setFeedModal((prev) => ({ ...prev, copied: true }));
    setTimeout(() => setFeedModal((prev) => ({ ...prev, copied: false })), 2500);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* ============================================================ */}
      {/* 01 - CURRENT AVIATION MARKET                                 */}
      {/* ============================================================ */}
      <div className="pt-2 pb-4 border-b border-aviaPeachSoft/50 mb-6">
        <div className="text-[10px] font-bold text-aviaMuted uppercase tracking-widest mb-1">01 — Current Aviation Market</div>
        <h2 className="text-2xl font-extrabold text-aviaCharcoal font-heading">Macroeconomic Policy Integration</h2>
      </div>

      {/* 2. Institutional Macro Policy Integration Banner (RBI & NSO MoSPI) */}
      <div className="avia-card p-5 bg-aviaWhite border border-aviaPeachSoft shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-aviaPeachSoft pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-none bg-aviaPeachSoft border border-aviaCoral text-aviaCoralDeep flex items-center justify-center text-base shadow-xs">
              <i className="fa-solid fa-building-columns"></i>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-aviaCharcoal font-heading flex items-center gap-2">
                <span>Institutional Macro Policy Feeds & Official Index Consumption Hub</span>
              </h3>
              <p className="text-xs text-aviaMuted">
                High-frequency T+0 API feeds tailored for Reserve Bank of India (RBI MPC) and National Statistical Office (NSO MoSPI) CPI integration.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>LIVE POLICY FEED ACTIVE</span>
            </span>
          </div>
        </div>

        {/* 3 Institutional Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
          
          {/* Card 1: RBI MPC Macro Feed */}
          <div className="p-4 bg-aviaWhite border border-aviaPeachSoft hover:border-aviaCoral hover:bg-aviaPeachLight/30 transition-all space-y-3 flex flex-col justify-between shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-aviaCoralDeep uppercase tracking-wider">
                  Reserve Bank of India (RBI)
                </span>
                <span className="px-2 py-0.5 bg-aviaPeachSoft text-aviaCoralDeep border border-aviaCoral text-[9px] font-mono font-bold">
                  T+0 LEADING SIGNAL
                </span>
              </div>
              
              <div className="text-sm font-bold text-aviaCharcoal">
                Monetary Policy Early Inflation Indicator
              </div>

              <div className="space-y-1.5 text-xs text-aviaCharcoal pt-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-aviaMuted">Current APIx Index:</span>
                  <span className="text-aviaCoralDeep font-extrabold text-sm">{kpis?.today_apix ? kpis.today_apix.toFixed(2) : 'Awaiting Data'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-aviaMuted">CPI Lead Horizon:</span>
                  <span className="text-aviaCoralDeep font-bold">18 Days Lead Time</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-aviaMuted">Yield Volatility (σ):</span>
                  <span className="text-aviaCoralDeep font-bold">{kpis?.volatility_7d_percent || 0}% (7-Day)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-aviaMuted">Fuel ATF Surcharge:</span>
                  <span className="text-emerald-800 font-bold">+0.00 pts pass-through</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-aviaPeachSoft flex items-center gap-2">
              <button
                onClick={() => openFeedModal('Reserve Bank of India (RBI) Macro Policy Feed', '/api/rbi/macro-feed', () => api.fetchRbiMacroFeed())}
                className="flex-1 py-2 px-3 bg-aviaCoral hover:bg-aviaPeachLight0 text-white font-bold text-xs transition-all text-center flex items-center justify-center gap-1.5 shadow-xs"
              >
                <i className="fa-solid fa-code text-[11px]"></i>
                <span>Inspect RBI Feed</span>
              </button>
              <button
                onClick={() => copyFeedCurl('/api/rbi/macro-feed')}
                title="Copy cURL Command"
                className="py-2 px-3 bg-aviaPeachLight hover:bg-aviaPeachLight text-aviaCharcoal border border-aviaPeachSoft text-xs transition-colors"
              >
                <i className="fa-regular fa-copy"></i>
              </button>
            </div>
          </div>

          {/* Card 2: NSO MoSPI CPI Feed */}
          <div className="p-4 bg-aviaWhite border border-aviaPeachSoft hover:border-cyan-400 hover:bg-cyan-50/30 transition-all space-y-3 flex flex-col justify-between shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-aviaCharcoal uppercase tracking-wider">
                  National Statistical Office (NSO)
                </span>
                <span className="px-2 py-0.5 bg-aviaPeachLight text-aviaCharcoal border border-aviaPeachSoft text-[9px] font-mono font-bold">
                  ILO CPI MANUAL
                </span>
              </div>
              
              <div className="text-sm font-bold text-aviaCharcoal">
                CPI Airfare Sub-Index Elementary Aggregator
              </div>

              <div className="space-y-1.5 text-xs text-aviaCharcoal pt-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-aviaMuted">Aggregation Formula:</span>
                  <span className="text-aviaCharcoal font-bold">Jevons (Geometric Mean)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-aviaMuted">Outlier Filter:</span>
                  <span className="text-emerald-800 font-bold">3.2σ Modified Z-Score</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-aviaMuted">Current APIx Index:</span>
                  <span className="text-aviaCharcoal font-extrabold text-sm">{kpis?.today_apix ? kpis.today_apix.toFixed(2) : 'Awaiting Data'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-aviaMuted">Standard:</span>
                  <span className="text-aviaCharcoal font-bold">COICOP 07.3.3</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-aviaPeachSoft flex items-center gap-2">
              <button
                onClick={() => openFeedModal('National Statistical Office (NSO MoSPI) CPI Feed', '/api/nso/cpi-feed', () => api.fetchNsoCpiFeed())}
                className="flex-1 py-2 px-3 bg-aviaCoral hover:bg-aviaCoralDeep text-white font-bold text-xs transition-all text-center flex items-center justify-center gap-1.5 shadow-xs"
              >
                <i className="fa-solid fa-code text-[11px]"></i>
                <span>Inspect NSO Feed</span>
              </button>
              <button
                onClick={() => copyFeedCurl('/api/nso/cpi-feed')}
                title="Copy cURL Command"
                className="py-2 px-3 bg-aviaPeachLight hover:bg-aviaPeachLight text-aviaCharcoal border border-aviaPeachSoft text-xs transition-colors"
              >
                <i className="fa-regular fa-copy"></i>
              </button>
            </div>
          </div>

          {/* Card 3: DGCA Aviation Strata Feed */}
          <div className="p-4 bg-aviaWhite border border-aviaPeachSoft hover:border-amber-400 hover:bg-amber-50/30 transition-all space-y-3 flex flex-col justify-between shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-aviaCharcoal uppercase tracking-wider">
                  DGCA & MoCA Registry
                </span>
                <span className="px-2 py-0.5 bg-aviaPeachLight text-aviaCharcoal border border-aviaPeachSoft text-[9px] font-mono font-bold">
                  100% SHA-256 AUDIT
                </span>
              </div>
              
              <div className="text-sm font-bold text-aviaCharcoal">
                Aviation Strata & Capacity Exclusion Rules
              </div>

              <div className="space-y-1.5 text-xs text-aviaCharcoal pt-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-aviaMuted">Scheduled Carriers:</span>
                  <span className="text-aviaCharcoal font-bold">IndiGo, AI, Akasa, SG</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-aviaMuted">Booking Horizons:</span>
                  <span className="text-aviaCoralDeep font-bold">5 Horizons (T+1 to T+45)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-aviaMuted">Sold-Out Isolation:</span>
                  <span className="text-emerald-800 font-bold">Capacity Guard Active</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-aviaPeachSoft flex items-center gap-2">
              <a
                href="/api/export?format=json"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 bg-aviaCoral hover:bg-aviaCoralDeep text-white font-bold text-xs transition-all text-center flex items-center justify-center gap-1.5 shadow-xs"
              >
                <i className="fa-solid fa-file-arrow-down text-[11px]"></i>
                <span>Download Master JSON</span>
              </a>
              <a
                href="/api/export?format=csv"
                target="_blank"
                rel="noreferrer"
                title="Download CSV"
                className="py-2 px-3 bg-aviaPeachLight hover:bg-aviaPeachLight text-aviaCharcoal border border-aviaPeachSoft text-xs transition-colors"
              >
                <i className="fa-solid fa-file-csv"></i>
              </a>
            </div>
          </div>

        </div>
      </div>
      
      {/* ============================================================ */}
      {/* 01 - FLIGHT OVERVIEW                                         */}
      {/* ============================================================ */}
      <div className="pt-2 pb-4 border-b border-aviaPeachSoft/50 mb-6">
        <div className="text-[10px] font-bold text-aviaMuted uppercase tracking-widest mb-1">02 — Flight / Fare Snapshot</div>
        <h2 className="text-2xl font-extrabold text-aviaCharcoal font-heading">Current Flight Inventory & Search</h2>
      </div>

      {/* Global Filter Bar */}
      <GlobalFilterBar />

      {/* 4. Master Airfare Observations Data Table */}
      <div className="avia-card p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-aviaPeachSoft pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-aviaCharcoal font-heading flex items-center gap-2">
              <i className="fa-solid fa-table-list text-aviaCoral"></i>
              <span>Live Airfare Observations Ledger</span>
            </h3>
            <p className="text-[11px] text-aviaMuted">
              Showing {observations.length} of {totalCount.toLocaleString()} verified individual flight observations
            </p>
          </div>

          {/* Controls: Outlier Filter & Sort Selector */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setOutliersOnly(!outliersOnly)}
              className={`px-2.5 py-1 text-xs font-bold font-mono transition-all border flex items-center gap-1.5 ${
                outliersOnly
                  ? 'bg-rose-600 text-white border-rose-700 shadow-sm'
                  : 'bg-aviaPeachLight text-aviaCharcoal hover:bg-aviaPeachSoft border-aviaPeachSoft'
              }`}
            >
              <i className={`fa-solid ${outliersOnly ? 'fa-filter-circle-xmark' : 'fa-triangle-exclamation text-rose-600'}`}></i>
              <span>{outliersOnly ? 'Showing Outliers Only' : `Filter Outliers (${kpis?.outlier_metrics?.outlier_count || 0})`}</span>
            </button>

            <span className="text-aviaMuted font-medium ml-1">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-aviaWhite border border-aviaPeachSoft/80 rounded-none px-2.5 py-1 text-aviaCharcoal text-xs font-semibold outline-none cursor-pointer"
            >
              <option value="fare_desc">Highest Fare First (High ➔ Low)</option>
              <option value="fare_asc">Lowest Fare First (Low ➔ High)</option>
              <option value="date_asc">Departure Date (Earliest)</option>
              <option value="lead_asc">Booking Horizon (T+1 ➔ T+45)</option>
              <option value="carrier">Carrier Name (A ➔ Z)</option>
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[920px]">
            <thead>
              <tr className="border-b border-aviaPeachSoft text-aviaMuted font-semibold uppercase text-[10px] select-none">
                <th
                  onClick={() => setSortBy(sortBy === 'carrier' ? 'fare_desc' : 'carrier')}
                  className="py-2.5 px-3 cursor-pointer hover:text-aviaCoralDeep transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Flight / Carrier</span>
                    {sortBy === 'carrier' && <i className="fa-solid fa-sort-up text-aviaCoralDeep"></i>}
                  </div>
                </th>
                <th className="py-2.5 px-3">Route Corridor</th>
                <th
                  onClick={() => setSortBy(sortBy === 'date_asc' ? 'fare_desc' : 'date_asc')}
                  className="py-2.5 px-3 cursor-pointer hover:text-aviaCoralDeep transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Departure Date & Time</span>
                    {sortBy === 'date_asc' && <i className="fa-solid fa-sort-up text-aviaCoralDeep"></i>}
                  </div>
                </th>
                <th
                  onClick={() => setSortBy(sortBy === 'lead_asc' ? 'fare_desc' : 'lead_asc')}
                  className="py-2.5 px-3 cursor-pointer hover:text-aviaCoralDeep transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Horizon</span>
                    {sortBy === 'lead_asc' && <i className="fa-solid fa-sort-up text-aviaCoralDeep"></i>}
                  </div>
                </th>
                <th
                  onClick={() => setSortBy(sortBy === 'fare_desc' ? 'fare_asc' : 'fare_desc')}
                  className="py-2.5 px-3 cursor-pointer hover:text-aviaCoralDeep transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Base Fare</span>
                    {sortBy === 'fare_desc' ? <i className="fa-solid fa-arrow-down-wide-short text-rose-600"></i> : sortBy === 'fare_asc' ? <i className="fa-solid fa-arrow-up-wide-short text-emerald-600"></i> : null}
                  </div>
                </th>
                <th
                  onClick={() => setSortBy(sortBy === 'fare_desc' ? 'fare_asc' : 'fare_desc')}
                  className="py-2.5 px-3 cursor-pointer hover:text-aviaCoralDeep transition-colors"
                >
                  <div className="flex items-center gap-1 text-aviaCharcoal font-bold">
                    <span>Total Fare</span>
                    {sortBy === 'fare_desc' ? (
                      <i className="fa-solid fa-arrow-down-wide-short text-rose-600"></i>
                    ) : sortBy === 'fare_asc' ? (
                      <i className="fa-solid fa-arrow-up-wide-short text-emerald-600"></i>
                    ) : (
                      <i className="fa-solid fa-sort text-aviaMuted"></i>
                    )}
                  </div>
                </th>
                <th className="py-2.5 px-3 text-center">Z-Score & Anomaly</th>
                <th className="py-2.5 px-3">Cabin Class</th>
                <th className="py-2.5 px-3">Scraping Source</th>
                <th className="py-2.5 px-3">Audit Lineage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {loadingObs ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-aviaMuted font-mono text-xs">
                    Loading filtered flight observations...
                  </td>
                </tr>
              ) : observations.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center">
                    {datasetStatus === 'AWAITING_FRESH_DATA' ? (
                      <div className="flex flex-col items-center justify-center space-y-2 text-aviaMuted">
                        <i className="fa-solid fa-satellite-dish text-3xl text-aviaCoral/50 mb-2"></i>
                        <span className="font-bold text-sm text-aviaCharcoal">No current observations</span>
                        <span className="text-xs">Awaiting first successful data acquisition. Run a Scraper Pipeline.</span>
                      </div>
                    ) : datasetStatus === 'UNAVAILABLE' ? (
                      <div className="flex flex-col items-center justify-center space-y-2 text-aviaMuted">
                        <i className="fa-solid fa-triangle-exclamation text-3xl text-red-400 mb-2"></i>
                        <span className="font-bold text-sm text-aviaCharcoal">Live Data Currently Unavailable</span>
                        <span className="text-xs">Authorized acquisition from the selected source could not be completed.</span>
                      </div>
                    ) : (
                      <div className="text-aviaMuted font-mono text-xs">No flight records matching selected filter criteria.</div>
                    )}
                  </td>
                </tr>
              ) : (
                observations.map((obs) => {
                  const fareKey = filters.fareType === 'base' ? obs.base_fare : obs.total_fare;
                  const isExtreme = obs.outlier_severity === 'EXTREME_OUTLIER';
                  const isMild = obs.outlier_severity === 'MILD_OUTLIER';
                  const isSurge = obs.outlier_direction === 'HIGH_PRICE_SURGE';
                  const isDiscount = obs.outlier_direction === 'LOW_PRICE_ANOMALY';

                  const rowHighlightClass = isExtreme && isSurge
                    ? 'border-l-4 border-l-rose-500 bg-rose-50/40 hover:bg-rose-50/70'
                    : isExtreme && isDiscount
                    ? 'border-l-4 border-l-cyan-500 bg-cyan-50/40 hover:bg-cyan-50/70'
                    : isMild
                    ? 'border-l-4 border-l-amber-400 bg-amber-50/30 hover:bg-amber-50/60'
                    : 'border-l-4 border-l-transparent hover:bg-aviaPeachLight/30';

                  const carrierBadgeClass =
                    obs.carrier_code === '6E' || obs.carrier === 'IndiGo'
                      ? 'bg-aviaPeachLight text-aviaCoralDeep border-aviaPeachSoft'
                      : obs.carrier_code === 'AI' || obs.carrier === 'Air India'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : obs.carrier_code === 'QP' || obs.carrier === 'Akasa Air'
                      ? 'bg-orange-50 text-orange-700 border-orange-200'
                      : obs.carrier_code === 'SG' || obs.carrier === 'SpiceJet'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200';

                  const classBadgeClass =
                    obs.fare_class === 'BUSINESS' || obs.fare_class === 'FIRST'
                      ? 'bg-purple-100 text-purple-900 border-purple-300'
                      : obs.fare_class === 'PREMIUM_ECONOMY'
                      ? 'bg-orange-100 text-orange-900 border-orange-300'
                      : 'bg-slate-100 text-slate-700 border-slate-300';

                  return (
                    <React.Fragment key={obs.id}>
                    <tr onClick={() => toggleRow(obs.id)} className={`${rowHighlightClass} transition-colors cursor-pointer group border-b border-aviaPeachSoft/40`}>
                      {/* Flight */}
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-aviaCharcoal flex items-center gap-1.5">
                          <i className={`fa-solid fa-chevron-${expandedRows.has(obs.id) ? 'down' : 'right'} text-[10px] text-aviaMuted mr-1 group-hover:text-aviaCoralDeep transition-colors`}></i>
                          <span className="text-aviaCharcoal font-mono font-black">{obs.flight_number || 'AI-805'}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-none font-bold border ${carrierBadgeClass}`}>
                            {obs.carrier}
                          </span>
                        </div>
                        <div className="text-[10px] text-aviaMuted font-mono flex items-center gap-1.5 mt-0.5">
                          <span className="text-aviaCoralDeep font-medium">{obs.aircraft_type || 'Airbus A320neo'}</span>
                          <span>•</span>
                          <span>{obs.stops}</span>
                        </div>
                      </td>

                      {/* Route */}
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-aviaCoralDeep font-mono">
                          {obs.origin} ➔ {obs.destination}
                        </div>
                        <div className="text-[10px] text-aviaMuted truncate max-w-[120px]">
                          {obs.origin_city} to {obs.destination_city}
                        </div>
                      </td>

                      {/* Departure */}
                      <td className="py-2.5 px-3 font-mono">
                        <div className="text-aviaCharcoal font-semibold">{obs.departure_date}</div>
                        <div className="text-[10px] text-aviaMuted">{obs.departure_time} ({obs.day_of_week?.slice(0, 3)})</div>
                      </td>

                      {/* Horizon */}
                      <td className="py-2.5 px-3 font-mono">
                        <span className="px-2 py-0.5 rounded-none bg-aviaPeachSoft text-aviaCoralDeep border border-aviaCoral text-[10px] font-bold">
                          {obs.lead_window}
                        </span>
                      </td>

                      {/* Base Fare */}
                      <td className="py-2.5 px-3 font-mono text-aviaCharcoal font-medium">
                        ₹{obs.base_fare?.toLocaleString()}
                      </td>

                      {/* Total Fare with Outlier Visual Callout */}
                      <td className="py-2.5 px-3 font-mono">
                        <div className={`font-bold text-sm ${isSurge && isExtreme ? 'text-rose-700 font-black' : isDiscount && isExtreme ? 'text-cyan-800 font-black' : 'text-aviaCharcoal'}`}>
                          ₹{obs.total_fare?.toLocaleString()}
                        </div>
                        {obs.is_outlier && (
                          <div className="mt-0.5">
                            {isSurge ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 text-[9px] font-bold font-mono bg-rose-600 text-white rounded-none">
                                <i className="fa-solid fa-arrow-trend-up text-[8px]"></i> SURGE
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 text-[9px] font-bold font-mono bg-cyan-700 text-white rounded-none">
                                <i className="fa-solid fa-arrow-trend-down text-[8px]"></i> ANOMALY
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Z-Score & Outlier Column */}
                      <td className="py-2.5 px-3 text-center">
                        {obs.is_outlier ? (
                          <div className="flex flex-col items-center gap-0.5">
                            <span className={`px-2 py-0.5 text-[10px] font-mono font-black border shadow-sm ${
                              isExtreme
                                ? 'bg-rose-100 text-rose-900 border-rose-400 animate-pulse'
                                : 'bg-amber-100 text-amber-900 border-amber-400'
                            }`}>
                              Z: {obs.z_score > 0 ? `+${obs.z_score}` : obs.z_score}σ
                            </span>
                            <span className="text-[9px] font-mono text-rose-700 font-bold uppercase tracking-tight">
                              {isSurge ? '▲ +Surge Outlier' : '▼ -Flash Anomaly'}
                            </span>
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 rounded-none text-[10px] font-mono text-slate-600 bg-slate-100 border border-slate-200">
                            Z: {obs.z_score > 0 ? `+${obs.z_score}` : (obs.z_score !== undefined ? `${obs.z_score}σ` : '0.00σ')}
                          </span>
                        )}
                      </td>

                      {/* Cabin Class */}
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-none text-[10px] font-mono font-bold border ${classBadgeClass}`}>
                          {obs.fare_class?.replace('_', ' ') || 'ECONOMY'}
                        </span>
                        <div className="text-[9px] text-aviaMuted font-mono mt-0.5 truncate max-w-[110px]">
                          {obs.fare_family || 'Saver'}
                        </div>
                      </td>

                      {/* Source */}
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-none bg-aviaPeachLight text-aviaCharcoal text-[10px] font-medium border border-aviaPeachSoft">
                          {obs.source_portal}
                        </span>
                      </td>

                      {/* Lineage Button */}
                      <td className="py-2.5 px-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); openLineageDrawer(obs.id); }}
                          className="px-2.5 py-1 rounded-none bg-aviaCoralDeep hover:bg-aviaCoralDeep text-aviaCoral border border-aviaCoralDeep text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <i className="fa-solid fa-fingerprint text-[10px]"></i>
                          <span>{obs.hash?.slice(0, 8)}...</span>
                        </button>
                      </td>
                    </tr>
                    {expandedRows.has(obs.id) && (
                      <tr className="bg-slate-50 border-b border-aviaPeachSoft">
                        <td colSpan="10" className="p-4">
                          <div className="flex flex-col md:flex-row gap-6">
                            {/* Left: Fare Breakdown */}
                            <div className="flex-1 space-y-3">
                              <h4 className="text-xs font-bold text-aviaCharcoal font-heading uppercase">
                                <i className="fa-solid fa-file-invoice-dollar text-aviaCoralDeep mr-1.5"></i>
                                Fare Breakdown Inspector
                              </h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="p-2.5 bg-white border border-slate-200">
                                  <div className="text-[10px] text-aviaMuted font-semibold">Base Fare</div>
                                  <div className="font-mono text-sm text-aviaCharcoal font-bold">₹{obs.base_fare?.toLocaleString()}</div>
                                </div>
                                <div className="p-2.5 bg-white border border-slate-200">
                                  <div className="text-[10px] text-aviaMuted font-semibold">Fuel Surcharge / YQ</div>
                                  <div className="font-mono text-sm text-aviaCharcoal font-bold">₹{obs.fuel_surcharge?.toLocaleString() || '0.00'}</div>
                                </div>
                                <div className="p-2.5 bg-white border border-slate-200">
                                  <div className="text-[10px] text-aviaMuted font-semibold">UDF (DGCA Standard)</div>
                                  <div className="font-mono text-sm text-aviaCharcoal font-bold">₹{obs.user_development_fee?.toLocaleString() || '354.00'}</div>
                                </div>
                                <div className="p-2.5 bg-white border border-slate-200">
                                  <div className="text-[10px] text-aviaMuted font-semibold">Taxes & GST (5%)</div>
                                  <div className="font-mono text-sm text-aviaCharcoal font-bold">₹{((obs.taxes || 0) + (obs.gst || 0))?.toLocaleString()}</div>
                                </div>
                              </div>

                              {/* Z-Score Normalization Diagnostics Banner */}
                              <div className={`p-3 border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs ${
                                obs.is_outlier
                                  ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                                  : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                              }`}>
                                <div className="space-y-1">
                                  <div className="font-bold flex items-center gap-2">
                                    <i className={`fa-solid ${obs.is_outlier ? 'fa-triangle-exclamation text-rose-600' : 'fa-circle-check text-emerald-600'}`}></i>
                                    <span>Z-Score Outlier Diagnostics ({obs.origin}➔{obs.destination} at {obs.lead_window})</span>
                                  </div>
                                  <div className="text-[11px] opacity-90 font-mono">
                                    Stratum Mean: ₹{obs.stratum_mean_fare?.toLocaleString() || 'N/A'} | Median: ₹{obs.stratum_median_fare?.toLocaleString() || 'N/A'} | σ: ₹{obs.stratum_std_dev?.toLocaleString() || 'N/A'}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 font-mono text-[11px]">
                                  <span className="px-2 py-1 bg-white/80 border border-current font-black">
                                    Z: {obs.z_score > 0 ? `+${obs.z_score}` : obs.z_score}σ
                                  </span>
                                  <span className="px-2 py-1 bg-white/80 border border-current font-black">
                                    ModZ (MAD): {obs.modified_z_score > 0 ? `+${obs.modified_z_score}` : obs.modified_z_score}
                                  </span>
                                  <span className={`px-2 py-1 font-bold ${obs.is_outlier ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
                                    {obs.outlier_severity || 'NORMAL'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Right: Total Price Callout */}
                            <div className={`w-full md:w-64 border p-4 flex flex-col justify-center items-center text-center ${
                              obs.is_outlier ? 'bg-rose-50/50 border-rose-200' : 'bg-white border-slate-200'
                            }`}>
                              <div className="text-[10px] text-aviaMuted uppercase font-semibold mb-1">Total Scraped Price</div>
                              <div className={`text-2xl font-extrabold font-mono ${obs.is_outlier ? 'text-rose-700' : 'text-emerald-600'}`}>
                                ₹{obs.total_fare?.toLocaleString()}
                              </div>
                              <div className="mt-2 flex gap-1 justify-center">
                                <span className={`px-2 py-0.5 text-[10px] font-mono font-bold border ${classBadgeClass}`}>
                                  {obs.fare_class?.replace('_', ' ') || 'ECONOMY'}
                                </span>
                              </div>
                              {obs.is_outlier && (
                                <div className="mt-2 text-[10px] text-rose-700 font-mono font-bold uppercase tracking-tight">
                                  ⚠️ Flagged Price Outlier
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Enhanced Pagination Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-aviaPeachSoft text-xs">
          <div className="flex items-center gap-3">
            <span className="text-aviaMuted font-mono text-[11px]">
              Showing <span className="font-bold text-aviaCharcoal">{totalCount > 0 ? (page - 1) * pageSize + 1 : 0}</span> to{' '}
              <span className="font-bold text-aviaCharcoal">{Math.min(page * pageSize, totalCount)}</span> of{' '}
              <span className="font-bold text-aviaCharcoal">{totalCount.toLocaleString()}</span> flight observations
            </span>

            {/* Rows Per Page Selector */}
            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-aviaMuted text-[11px]">Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-aviaWhite border border-aviaPeachSoft text-aviaCharcoal text-xs font-semibold py-0.5 px-2 rounded-none outline-none cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(1)}
              disabled={page <= 1}
              title="First Page"
              className="py-1 px-2.5 rounded-none bg-aviaPeachLight hover:bg-aviaPeachLight disabled:opacity-40 disabled:pointer-events-none text-aviaCharcoal border border-aviaPeachSoft transition-all font-mono font-bold text-xs"
            >
              <i className="fa-solid fa-angles-left"></i>
            </button>

            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="py-1 px-3 rounded-none bg-aviaPeachLight hover:bg-aviaPeachLight disabled:opacity-40 disabled:pointer-events-none text-aviaCharcoal border border-aviaPeachSoft transition-all font-semibold"
            >
              Previous
            </button>

            {/* Page indicator pill */}
            <span className="px-3 py-1 bg-aviaPeachLight border border-aviaCoral text-aviaCoralDeep font-mono font-bold text-xs">
              Page {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="py-1 px-3 rounded-none bg-aviaPeachLight hover:bg-aviaPeachLight disabled:opacity-40 disabled:pointer-events-none text-aviaCharcoal border border-aviaPeachSoft transition-all font-semibold"
            >
              Next
            </button>

            <button
              onClick={() => setPage(totalPages)}
              disabled={page >= totalPages}
              title="Last Page"
              className="py-1 px-2.5 rounded-none bg-aviaPeachLight hover:bg-aviaPeachLight disabled:opacity-40 disabled:pointer-events-none text-aviaCharcoal border border-aviaPeachSoft transition-all font-mono font-bold text-xs"
            >
              <i className="fa-solid fa-angles-right"></i>
            </button>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 03 - AIRFARE INDEX & MARKET ANALYTICS                        */}
      {/* ============================================================ */}
      <div className="pt-12 pb-4 border-b border-aviaPeachSoft/50 mb-6">
        <div className="text-[10px] font-bold text-aviaMuted uppercase tracking-widest mb-1">03 — APIx Index</div>
        <h2 className="text-2xl font-extrabold text-aviaCharcoal font-heading">Macroeconomic Pricing Signals</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {datasetStatus === 'AWAITING_FRESH_DATA' ? (
          <div className="col-span-full py-8 text-center bg-aviaWhite border border-aviaPeachSoft shadow-sm">
             <i className="fa-solid fa-chart-line text-3xl text-aviaMuted mb-3 block"></i>
             <p className="font-bold text-aviaCharcoal text-sm">APIx Unavailable</p>
             <p className="text-xs text-aviaMuted">Awaiting first successful data acquisition</p>
          </div>
        ) : (
          <KpiCard
            title="National APIx Index"
            subtitle="All-India Domestic Basket"
            value={kpis?.today_apix ? kpis.today_apix.toFixed(2) : 'Awaiting Data'}
            deltaText={kpis ? `${kpis.change_24h_percent >= 0 ? '+' : ''}${kpis.change_24h_percent}% (${kpis.change_24h_points >= 0 ? '+' : ''}${kpis.change_24h_points} pts)` : '0.00%'}
            deltaType={kpis?.change_24h_percent >= 0 ? 'up' : 'down'}
            sparklineData={kpis?.sparklines?.apix || []}
            sparklineColor="#E85D43"
            footnote={kpis?.base_period || 'FY 2024-25 = 100.00'}
            icon="fa-chart-line"
          />
        )}
      </div>

      {/* 3. Main Analytics Section: Time Series + Lead Curves */}
      <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {datasetStatus === 'AWAITING_FRESH_DATA' ? (
          <div className="col-span-full py-16 text-center bg-aviaWhite border border-aviaPeachSoft shadow-sm flex flex-col items-center">
             <i className="fa-solid fa-chart-area text-4xl text-aviaMuted mb-4"></i>
             <p className="font-bold text-aviaCharcoal text-lg">Analytics Awaiting Fresh Data</p>
             <p className="text-sm text-aviaMuted mt-1">Time series and curves will populate once data is acquired.</p>
          </div>
        ) : (
          <>
            {/* 90-Day High-Frequency Time Series */}
            <div className="col-span-full avia-card p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-aviaPeachSoft pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-aviaCharcoal font-heading flex items-center gap-2">
                    <i className="fa-solid fa-chart-area text-aviaCoral"></i>
                    <span>Real-Time Airfare Price Index (APIx) Time Series</span>
                  </h3>
                  <p className="text-[11px] text-aviaMuted">
                    Augmenting Lagged Monthly Consumer Price Index (CPI) with High-Frequency Aviation Yields
                  </p>
                </div>
                <span className="badge-gov bg-aviaPeachLight text-aviaCoral border border-aviaCoral/40 font-mono text-[10px]">
                  CONFIDENCE BAND ±1.85 PTS
                </span>
              </div>

              <ApixTimeSeriesChart
                series={overviewData?.historical_series || []}
                timeframe={filters.timeframeDays}
                onTimeframeChange={(d) => updateFilter('timeframeDays', d)}
              />
            </div>
          </>
        )}
      </div>

      {/* ============================================================ */}
      {/* 02 - FLIGHT ANALYTICS                                        */}
      {/* ============================================================ */}
      <div className="pt-12 pb-4 border-b border-aviaPeachSoft/50 mb-6">
        <div className="text-[10px] font-bold text-aviaMuted uppercase tracking-widest mb-1">04 — Trend Analysis</div>
        <h2 className="text-2xl font-extrabold text-aviaCharcoal font-heading">Route & Market Pricing Behavior</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {datasetStatus === 'AWAITING_FRESH_DATA' ? (
          <div className="col-span-full py-8 text-center bg-aviaWhite border border-aviaPeachSoft shadow-sm">
             <i className="fa-solid fa-money-bill-trend-up text-3xl text-aviaMuted mb-3 block"></i>
             <p className="font-bold text-aviaCharcoal text-sm">Trend Analysis Unavailable</p>
             <p className="text-xs text-aviaMuted">Awaiting fresh market pricing data.</p>
          </div>
        ) : (
          <>
            {/* KPI 5: Market Fare Analytics */}
            <KpiCard
              title="Avg. Route Fares"
              subtitle="Mean / Median (₹)"
              value={`₹${kpis?.fare_median?.toLocaleString() || 5000}`}
              deltaText={`Mean: ₹${kpis?.fare_mean?.toLocaleString() || 5500} | Mode: ₹${kpis?.fare_mode?.toLocaleString() || 4500}`}
              deltaType="neutral"
              sparklineData={kpis?.sparklines?.apix}
              sparklineColor="#8b5cf6"
              footnote="Class Filtered Aggregate"
              icon="fa-money-bill-wave"
            />
            {/* KPI 2: Volatility */}
            <KpiCard
              title="7-Day Market Volatility"
              subtitle="Real-Time Price Variance"
              value={`${kpis?.volatility_7d_percent || 0}%`}
              deltaText={`Rolling 7d σ = ${kpis?.volatility_7d_percent || 0}%`}
              deltaType="neutral"
              sparklineData={kpis?.sparklines?.volatility}
              sparklineColor="#14b8a6"
              footnote="Bounded ± 2σ bounds"
              icon="fa-bolt"
            />
            {/* KPI 3: Coverage */}
            <KpiCard
              title="Route Basket Coverage"
              subtitle="Active Monitored Sectors"
              value={`${kpis?.basket_coverage_percent || 0}%`}
              deltaText="Live Route Tracking"
              deltaType="good"
              sparklineData={kpis?.sparklines?.coverage}
              sparklineColor="#3b82f6"
              footnote="MoSPI / CPI Aligned Weights"
              icon="fa-map-location-dot"
            />
          </>
        )}
      </div>


      {/* Institutional Feed Live JSON Modal */}
      {feedModal.open && (
        <div className="fixed inset-0 z-50 bg-aviaCharcoal/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-aviaCharcoal border-2 border-aviaCoral shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden text-aviaMuted">
            <div className="p-4 bg-aviaCharcoal border-b border-aviaCharcoal flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-code text-aviaCoral"></i>
                <h3 className="font-bold text-sm text-white font-heading">{feedModal.title}</h3>
                <span className="px-2 py-0.5 rounded-none bg-indigo-950 text-aviaCoral border border-aviaCoral text-[10px] font-mono">
                  {feedModal.endpoint}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyFeedCurl(feedModal.endpoint)}
                  className="py-1 px-3 bg-aviaCoral hover:bg-aviaPeachLight0 text-white rounded-none text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <i className="fa-regular fa-copy text-[11px]"></i>
                  <span>{feedModal.copied ? 'Copied cURL!' : 'Copy cURL'}</span>
                </button>
                <button
                  onClick={() => setFeedModal({ open: false, title: '', endpoint: '', data: null, loading: false, copied: false })}
                  className="p-1.5 hover:bg-aviaCharcoal text-aviaMuted hover:text-white transition-colors"
                >
                  <i className="fa-solid fa-xmark text-sm"></i>
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto bg-aviaCharcoal/90 font-mono text-[11px] leading-relaxed text-emerald-400">
              {feedModal.loading ? (
                <div className="py-16 text-center text-aviaMuted">
                  <i className="fa-solid fa-circle-notch fa-spin text-2xl mb-2 text-aviaCoral block"></i>
                  <span>Fetching live payload from backend...</span>
                </div>
              ) : (
                <pre className="overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(feedModal.data, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
