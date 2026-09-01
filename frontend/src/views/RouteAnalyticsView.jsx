import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import PricingHeatmap from '../components/charts/PricingHeatmap';
import CarrierSpreadChart from '../components/charts/CarrierSpreadChart';
import * as api from '../api/client';

export default function RouteAnalyticsView() {
  const { openLineageDrawer, filters } = useApp();
  const [heatmapData, setHeatmapData] = useState(null);
  const [carrierData, setCarrierData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [hmRes, crRes] = await Promise.all([
          api.fetchHeatmapAnalytics(),
          api.fetchCarrierAnalytics()
        ]);
        if (hmRes && hmRes.status === 'success') {
          setHeatmapData(hmRes);
        }
        if (crRes && crRes.status === 'success') {
          setCarrierData(crRes);
        }
      } catch (err) {
        console.error('Failed to load route analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [filters]);

  const globalStats = heatmapData?.global_stats || {};
  const fscVsLcc = carrierData?.fsc_vs_lcc || {};
  const routesCount = heatmapData?.routes?.length || 0;
  const windowsCount = heatmapData?.windows?.length || 0;
  const totalQuotes = globalStats?.total_quotes || carrierData?.total_quotes || 0;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">

      {/* Header Banner with Real Dynamic KPIs */}
      <div className="avia-card p-6 bg-gradient-to-r from-amber-50/90 via-white to-amber-50/40 border border-aviaPeachSoft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-aviaCharcoal font-heading flex items-center gap-2">
              <i className="fa-solid fa-route text-aviaCoralDeep"></i>
              <span>National Route Corridor Analytics & Dynamic Heatmap</span>
            </h2>
            <p className="text-xs text-aviaMuted max-w-2xl mt-1">
              Evaluating airfare elasticity across {windowsCount || 5} advance booking horizons (T+1 to T+45) for high-density trunk and regional routes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 bg-aviaPeachSoft border border-aviaCoral text-aviaCoralDeep font-bold">
              {routesCount} Basket Corridors
            </span>
            <span className="px-2.5 py-1 bg-aviaPeachSoft border border-aviaCoral text-aviaCoralDeep font-bold">
              {windowsCount} Advance Horizons
            </span>
            <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold">
              {totalQuotes.toLocaleString()} Live Quotes
            </span>
          </div>
        </div>
      </div>

      {/* 1. Multi-Horizon Pricing Heatmap */}
      <div className="avia-card p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-aviaPeachSoft pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-aviaCharcoal font-heading flex items-center gap-2">
              <i className="fa-solid fa-table-cells text-aviaCoral"></i>
              <span>{windowsCount}-Horizon Route Pricing Heatmap Matrix (INR)</span>
            </h3>
            <p className="text-[11px] text-aviaMuted">
              Click any cell to inspect exact cryptographic quote evidence and elementary index
            </p>
          </div>

          {/* Dynamic Heatmap Scale Legend */}
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-none bg-emerald-100 border border-emerald-400"></span>
              <span className="text-aviaMuted font-semibold">&lt; ₹6,000 (Base/Promotional)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-none bg-orange-100 border border-orange-300"></span>
              <span className="text-aviaMuted font-semibold">₹6,000 - ₹8,000 (Standard)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-none bg-amber-100 border border-amber-400"></span>
              <span className="text-aviaMuted font-semibold">₹8,000 - ₹10,000 (Tight Yield)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-none bg-rose-100 border border-rose-400"></span>
              <span className="text-aviaMuted font-semibold">&gt; ₹10,000 (Peak Surge)</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-aviaMuted font-mono text-xs">
            <i className="fa-solid fa-circle-notch fa-spin text-2xl text-aviaCoral mb-2 block"></i>
            Loading national route pricing matrix...
          </div>
        ) : (
          <PricingHeatmap
            heatmapData={heatmapData}
            onSelectQuote={(quoteId) => openLineageDrawer(quoteId)}
          />
        )}
      </div>

      {/* 2. Carrier Price Spread & Business Model Dispersion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        
        <div className="lg:col-span-2 avia-card p-5 space-y-4">
          <div className="border-b border-aviaPeachSoft pb-3">
            <h3 className="text-sm font-extrabold text-aviaCharcoal font-heading flex items-center gap-2">
              <i className="fa-solid fa-arrows-left-right text-aviaCoral"></i>
              <span>Airline Price Dispersion & Yield Spread</span>
            </h3>
            <p className="text-[11px] text-aviaMuted">
              Min spread, median, and peak pricing distributions by carrier model (LCC vs FSC)
            </p>
          </div>

          <CarrierSpreadChart carrierData={carrierData?.carriers || []} />
        </div>

        {/* Statistical Notes Derived from Live Data */}
        <div className="avia-card p-5 space-y-3">
          <div className="border-b border-aviaPeachSoft pb-3">
            <h3 className="text-sm font-extrabold text-aviaCharcoal font-heading flex items-center gap-2">
              <i className="fa-solid fa-scale-balanced text-emerald-600"></i>
              <span>LCC vs FSC Spread Analysis</span>
            </h3>
            <p className="text-[11px] text-aviaMuted">
              Empirical Yield Dispersion Metrics
            </p>
          </div>

          <div className="space-y-3 text-xs text-aviaCharcoal leading-relaxed">
            <div className="p-3 bg-white border border-aviaPeachSoft space-y-1">
              <div className="flex items-center justify-between">
                <strong className="text-aviaCharcoal">FSC Premium Multiplier:</strong>
                <span className="font-mono font-black text-rose-700 text-xs">
                  {fscVsLcc.fsc_premium_percent > 0 ? `+${fscVsLcc.fsc_premium_percent}%` : `${fscVsLcc.fsc_premium_percent || 0}%`}
                </span>
              </div>
              <p className="text-[11px] text-aviaMuted">
                Full Service Carriers (Air India) mean fare is ₹{fscVsLcc.fsc_mean?.toLocaleString() || 0} vs LCC mean ₹{fscVsLcc.lcc_mean?.toLocaleString() || 0}.
              </p>
            </div>

            <div className="p-3 bg-white border border-aviaPeachSoft space-y-1">
              <div className="flex items-center justify-between">
                <strong className="text-aviaCharcoal">Basket Price Envelope:</strong>
                <span className="font-mono font-bold text-aviaCoralDeep text-xs">
                  ₹{globalStats.min_fare?.toLocaleString() || 0} - ₹{globalStats.max_fare?.toLocaleString() || 0}
                </span>
              </div>
              <p className="text-[11px] text-aviaMuted">
                Overall basket mean fare is ₹{globalStats.mean_fare?.toLocaleString() || 0} with median ₹{globalStats.median_fare?.toLocaleString() || 0} across {totalQuotes} observed flights.
              </p>
            </div>

            <div className="p-3 bg-white border border-aviaPeachSoft space-y-1">
              <strong className="text-aviaCharcoal">Market Volume Share:</strong>
              <div className="space-y-1 mt-1 text-[11px] font-mono">
                {(carrierData?.carriers || []).slice(0, 4).map((c) => (
                  <div key={c.code} className="flex justify-between items-center text-aviaMuted">
                    <span>{c.name}:</span>
                    <span className="font-bold text-aviaCharcoal">{c.market_share_percent}% ({c.quote_count} quotes)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
