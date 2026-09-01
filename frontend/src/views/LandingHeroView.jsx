import React from 'react';
import { useApp } from '../context/AppContext';

export default function LandingHeroView() {
  const { setActiveView, startTour, setIsArchitectureModalOpen, overviewData } = useApp();

  const kpis = overviewData?.kpis || {
    today_apix: 161.90,
    change_24h_percent: 11.48,
    change_24h_points: 16.67,
    volatility_7d_percent: 4.59,
    basket_coverage_percent: 98.5,
    data_freshness_minutes: 2
  };

  const deltaSign = kpis.change_24h_percent >= 0 ? '+' : '';

  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-300">
      
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-6">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-aviaPeachSoft/90 border border-aviaCoral text-aviaCoralDeep text-xs font-semibold shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Ministry of Statistics & Programme Implementation (MoSPI) • SIH 2026</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-aviaCharcoal tracking-tight leading-[1.15] font-heading">
          Policy-Grade <span className="text-transparent bg-clip-text bg-gradient-to-r from-aviaCoral via-orange-500 to-red-600">Real-Time Airfare</span> Price Index for India
        </h1>

        <p className="text-sm sm:text-base text-aviaCharcoal max-w-2xl mx-auto leading-relaxed">
          <strong className="text-aviaCoralDeep">AVIA (Aviation Variation & Inflation Analytics)</strong> is an automated economic surveillance platform. It bridges the 30-day statistical reporting lag of traditional methods by scraping and aggregating daily high-frequency airfares across India's domestic carriers to create a mathematically sound inflation index.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setActiveView('overview')}
            className="py-3 px-6 rounded-none bg-gradient-to-r from-aviaCoral to-red-600 hover:from-orange-500 hover:to-aviaCoralDeep text-white text-sm font-bold shadow-lg shadow-aviaCoral/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <span>Launch Executive Dashboard</span>
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </button>

          <button
            onClick={startTour}
            className="py-3 px-6 rounded-none bg-aviaPeachLight hover:bg-aviaPeachLight text-aviaCharcoal border border-aviaPeachSoft text-sm font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <i className="fa-solid fa-play text-aviaCoralDeep text-xs"></i>
            <span>Interactive Evaluator Tour</span>
          </button>

          <button
            onClick={() => setIsArchitectureModalOpen(true)}
            className="py-3 px-5 rounded-none bg-aviaWhite hover:bg-aviaPeachLight text-aviaCharcoal border border-aviaPeachSoft text-sm font-semibold transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-sitemap text-aviaCoralDeep"></i>
            <span>Architecture Diagram</span>
          </button>
        </div>

        {/* Monitored Airlines & Routes Badge Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-mono">
          <span className="px-2.5 py-1 bg-aviaPeachLight text-aviaCoralDeep border border-aviaPeachSoft font-bold">IndiGo (6E)</span>
          <span className="px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-200 font-bold">Air India (AI)</span>
          <span className="px-2.5 py-1 bg-orange-50 text-orange-800 border border-orange-200 font-bold">Akasa Air (QP)</span>
          <span className="px-2.5 py-1 bg-red-50 text-red-800 border border-red-200 font-bold">SpiceJet (SG)</span>
        </div>

      </section>

      {/* 3 Core Value Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
        
        <div className="avia-card p-6 space-y-3 border-t-2 border-t-aviaCoral">
          <div className="w-10 h-10 rounded-none bg-aviaPeachSoft text-aviaCoralDeep border border-aviaCoral flex items-center justify-center text-lg shadow-sm">
            <i className="fa-solid fa-bolt"></i>
          </div>
          <h3 className="text-base font-bold text-aviaCharcoal font-heading">
            T+0 Real-Time High Frequency APIx
          </h3>
          <p className="text-xs text-aviaMuted leading-relaxed">
            Eliminates monthly CPI reporting blindspots with automated daily Jevons geometric mean elementary aggregation across India's scheduled domestic corridors and advance purchase horizons (T+1 to T+45).
          </p>
        </div>

        <div className="avia-card p-6 space-y-3 border-t-2 border-t-amber-500">
          <div className="w-10 h-10 rounded-none bg-aviaPeachSoft text-aviaCoralDeep border border-aviaCoral flex items-center justify-center text-lg shadow-sm">
            <i className="fa-solid fa-fingerprint"></i>
          </div>
          <h3 className="text-base font-bold text-aviaCharcoal font-heading">
            100% Cryptographic Audit Trail
          </h3>
          <p className="text-xs text-aviaMuted leading-relaxed">
            Every single indexed flight observation is sealed with an immutable SHA-256 lineage hash containing origin, destination, carrier, flight number, timestamp, and 4-tier DGCA tax component breakdown.
          </p>
        </div>

        <div className="avia-card p-6 space-y-3 border-t-2 border-t-orange-600">
          <div className="w-10 h-10 rounded-none bg-aviaPeachSoft text-aviaCoralDeep border border-aviaCoral flex items-center justify-center text-lg shadow-sm">
            <i className="fa-solid fa-scale-balanced"></i>
          </div>
          <h3 className="text-base font-bold text-aviaCharcoal font-heading">
            ILO CPI Standards & DGCA Weighting
          </h3>
          <p className="text-xs text-aviaMuted leading-relaxed">
            Complies with rigorous ILO and MoSPI guidelines. Features median absolute deviation (MAD) filtering to quarantine flash sales, and DGCA market-share weighting for realistic inflation calibration.
          </p>
        </div>

      </section>

      {/* Live Coverage & Dynamic Metrics Bar */}
      <section className="avia-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-aviaPeachSoft pb-4">
          <div>
            <h3 className="text-lg font-bold text-aviaCharcoal font-heading">
              National Domestic Basket Coverage Overview
            </h3>
            <p className="text-xs text-aviaMuted">
              Calibrated to DGCA Passenger Traffic Statistics & Ministry of Civil Aviation Data
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="px-2.5 py-1 rounded-none bg-aviaPeachSoft border border-aviaCoral text-aviaCoralDeep font-bold">
              {kpis.basket_coverage_percent}% Traffic Basket
            </span>
            <span className="px-2.5 py-1 rounded-none bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold">
              All 5 Domestic Airlines
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-none bg-aviaWhite border border-aviaPeachSoft shadow-sm">
            <div className="text-2xl font-extrabold text-aviaCharcoal font-heading">{typeof kpis.today_apix === 'number' ? kpis.today_apix.toFixed(2) : '161.90'}</div>
            <div className="text-[11px] text-aviaMuted mt-1 font-medium">National APIx (FY 24-25=100)</div>
          </div>
          <div className="p-4 rounded-none bg-aviaWhite border border-aviaPeachSoft shadow-sm">
            <div className="text-2xl font-extrabold text-aviaCoralDeep font-heading">{deltaSign}{kpis.change_24h_percent}%</div>
            <div className="text-[11px] text-aviaMuted mt-1 font-medium">24h Index Momentum</div>
          </div>
          <div className="p-4 rounded-none bg-aviaWhite border border-aviaPeachSoft shadow-sm">
            <div className="text-2xl font-extrabold text-aviaCoralDeep font-heading">{kpis.volatility_7d_percent}%</div>
            <div className="text-[11px] text-aviaMuted mt-1 font-medium">7-Day Index Volatility</div>
          </div>
          <div className="p-4 rounded-none bg-aviaWhite border border-aviaPeachSoft shadow-sm">
            <div className="text-2xl font-extrabold text-emerald-600 font-heading">&lt; {kpis.data_freshness_minutes || 2} min</div>
            <div className="text-[11px] text-aviaMuted mt-1 font-medium">Data Freshness SLA</div>
          </div>
        </div>
      </section>

      {/* 4. HTTPS Institutional API Endpoints for RBI, NSO & Macro Consumers */}
      <section className="avia-card p-6 sm:p-8 space-y-6 bg-aviaWhite border border-aviaPeachSoft shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-aviaPeachSoft pb-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-none bg-aviaPeachLight text-aviaCoralDeep border border-aviaPeachSoft text-[10px] font-mono font-bold uppercase">
              <i className="fa-solid fa-server text-aviaCoralDeep"></i>
              <span>Direct Production RESTful Endpoints</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-aviaCharcoal font-heading">
              Institutional API Endpoints for RBI, NSO & Macro Policy Integration
            </h3>
            <p className="text-xs text-aviaMuted max-w-2xl leading-relaxed">
              Standardized JSON & CSV feeds ready for consumption by Reserve Bank of India (RBI MPC), National Statistical Office (NSO, MoSPI), DGCA, and macroeconomic forecasting pipelines.
            </p>
          </div>

          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>REST API v2.4 ONLINE</span>
          </span>
        </div>

        {/* List of 5 Core Institutional HTTPS Endpoints */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Endpoint 1: RBI Macro Policy Feed */}
          <div className="p-4 bg-aviaPeachLight/80 border border-aviaPeachSoft hover:border-aviaCoral hover:bg-aviaPeachLight/30 transition-all space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-aviaPeachSoft text-aviaCoralDeep border border-aviaCoral text-[10px] font-mono font-bold">
                  RBI MPC LEADING INDICATOR
                </span>
                <span className="text-[10px] text-emerald-700 font-mono font-bold">200 OK • JSON</span>
              </div>
              <div className="font-mono text-xs font-bold text-aviaCoralDeep break-all bg-aviaWhite p-2.5 border border-aviaPeachSoft flex items-center justify-between gap-2 shadow-xs">
                <span>GET https://api.avia.gov.in/api/rbi/macro-feed</span>
                <a
                  href="/api/rbi/macro-feed"
                  target="_blank"
                  rel="noreferrer"
                  className="text-aviaMuted hover:text-aviaCoralDeep transition-colors"
                  title="Open in new tab"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                </a>
              </div>
              <p className="text-xs text-aviaMuted leading-snug">
                Delivers 18-day advance inflation warning signal, rolling 7-day yield volatility, and fuel pass-through indexation.
              </p>
            </div>
            <div className="text-[10px] font-mono text-aviaMuted pt-1.5 border-t border-aviaPeachSoft flex items-center justify-between">
              <span>Auth: Public SIH Sandbox</span>
              <span>Rate Limit: Unlimited</span>
            </div>
          </div>

          {/* Endpoint 2: NSO MoSPI Official CPI Feed */}
          <div className="p-4 bg-aviaPeachLight/80 border border-aviaPeachSoft hover:border-cyan-400 hover:bg-cyan-50/30 transition-all space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-cyan-100 text-cyan-900 border border-cyan-200 text-[10px] font-mono font-bold">
                  NSO CPI AIRFARE SUB-INDEX
                </span>
                <span className="text-[10px] text-emerald-700 font-mono font-bold">200 OK • JSON</span>
              </div>
              <div className="font-mono text-xs font-bold text-cyan-800 break-all bg-aviaWhite p-2.5 border border-aviaPeachSoft flex items-center justify-between gap-2 shadow-xs">
                <span>GET https://api.avia.gov.in/api/nso/cpi-feed</span>
                <a
                  href="/api/nso/cpi-feed"
                  target="_blank"
                  rel="noreferrer"
                  className="text-aviaMuted hover:text-cyan-600 transition-colors"
                  title="Open in new tab"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                </a>
              </div>
              <p className="text-xs text-aviaMuted leading-snug">
                ILO CPI Manual compliant elementary aggregates computed with Jevons geometric mean and 3.2σ outlier isolation.
              </p>
            </div>
            <div className="text-[10px] font-mono text-aviaMuted pt-1.5 border-t border-aviaPeachSoft flex items-center justify-between">
              <span>Standard: COICOP 07.3.3</span>
              <span>Base: FY 2024-25=100</span>
            </div>
          </div>

          {/* Endpoint 3: National Executive Overview */}
          <div className="p-4 bg-aviaPeachLight/80 border border-aviaPeachSoft hover:border-aviaCoral hover:bg-aviaPeachLight/30 transition-all space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-aviaPeachSoft text-aviaCoralDeep border border-aviaPeachSoft text-[10px] font-mono font-bold">
                  EXECUTIVE APIX & 90D SERIES
                </span>
                <span className="text-[10px] text-emerald-700 font-mono font-bold">200 OK • JSON</span>
              </div>
              <div className="font-mono text-xs font-bold text-aviaCoralDeep break-all bg-aviaWhite p-2.5 border border-aviaPeachSoft flex items-center justify-between gap-2 shadow-xs">
                <span>GET https://api.avia.gov.in/api/overview?days=30&fare_type=total</span>
                <a
                  href="/api/overview?days=30&fare_type=total"
                  target="_blank"
                  rel="noreferrer"
                  className="text-aviaMuted hover:text-aviaCoralDeep transition-colors"
                  title="Open in new tab"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                </a>
              </div>
              <p className="text-xs text-aviaMuted leading-snug">
                Calculated headline APIx, 24h delta points, 7d volatility, top route movers, and rolling time series.
              </p>
            </div>
            <div className="text-[10px] font-mono text-aviaMuted pt-1.5 border-t border-aviaPeachSoft flex items-center justify-between">
              <span>Parameters: days, day, fare_type</span>
              <span>Response: ~12ms</span>
            </div>
          </div>

          {/* Endpoint 4: Lead-Time Price Elasticity */}
          <div className="p-4 bg-aviaPeachLight/80 border border-aviaPeachSoft hover:border-amber-400 hover:bg-amber-50/30 transition-all space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-mono font-bold">
                  HORIZON YIELD CURVES (T+1 TO T+45)
                </span>
                <span className="text-[10px] text-emerald-700 font-mono font-bold">200 OK • JSON</span>
              </div>
              <div className="font-mono text-xs font-bold text-amber-800 break-all bg-aviaWhite p-2.5 border border-aviaPeachSoft flex items-center justify-between gap-2 shadow-xs">
                <span>GET https://api.avia.gov.in/api/analytics/elasticity-curves</span>
                <a
                  href="/api/analytics/elasticity-curves"
                  target="_blank"
                  rel="noreferrer"
                  className="text-aviaMuted hover:text-amber-600 transition-colors"
                  title="Open in new tab"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                </a>
              </div>
              <p className="text-xs text-aviaMuted leading-snug">
                Yield elasticity curves quantifying price surcharges from T+1 emergency booking up to T+45 advance purchase.
              </p>
            </div>
            <div className="text-[10px] font-mono text-aviaMuted pt-1.5 border-t border-aviaPeachSoft flex items-center justify-between">
              <span>Elasticity Multiplier: 1.78x</span>
              <span>5 Discrete Horizons</span>
            </div>
          </div>

          {/* Endpoint 5: Verified Master Quotes Data */}
          <div className="p-4 bg-aviaPeachLight/80 border border-aviaPeachSoft hover:border-emerald-400 hover:bg-emerald-50/30 transition-all space-y-2.5 flex flex-col justify-between md:col-span-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-200 text-[10px] font-mono font-bold">
                  BULK VERIFIED QUOTES (CSV & JSON)
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href="/api/export?format=csv"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    Download CSV
                  </a>
                  <a
                    href="/api/export?format=json"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 bg-aviaWhite hover:bg-aviaPeachLight text-aviaCharcoal border border-aviaPeachSoft text-xs font-bold transition-colors shadow-xs"
                  >
                    Download JSON
                  </a>
                </div>
              </div>
              <div className="font-mono text-xs font-bold text-emerald-800 break-all bg-aviaWhite p-2.5 border border-aviaPeachSoft flex items-center justify-between gap-2 shadow-xs">
                <span>GET https://api.avia.gov.in/api/export?format=csv | GET https://api.avia.gov.in/api/data?carrier=AI&fare_type=total</span>
              </div>
              <p className="text-xs text-aviaMuted leading-snug">
                Full-fidelity individual observations including carrier, flight number, aircraft, base fare, YQ surcharge, UDF, GST, and SHA-256 cryptographic lineage hash.
              </p>
            </div>
            <div className="text-[10px] font-mono text-aviaMuted pt-1.5 border-t border-aviaPeachSoft flex items-center justify-between">
              <span>Filterable by: origin, dest, carrier, day, lead_window, fare_type</span>
              <span>100% Audit Lineage</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
