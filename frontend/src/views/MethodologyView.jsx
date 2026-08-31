import React from 'react';

export default function MethodologyView() {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="avia-card p-6 bg-gradient-to-r from-purple-50/80 via-sky-50/60 to-white border border-aviaPeachSoft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-aviaCharcoal font-heading flex items-center gap-2">
              <i className="fa-solid fa-book-bookmark text-aviaCoral"></i>
              <span>Statistical Methodology & CPI Augmentation Standards</span>
            </h2>
            <p className="text-xs text-aviaMuted max-w-2xl mt-1">
              Compliant with International Labour Organization (ILO) CPI Manual standards and DGCA air passenger transport statistics.
            </p>
          </div>

          <span className="px-3 py-1 bg-aviaPeachSoft text-aviaCoralDeep border border-aviaCoral font-mono text-xs font-bold">
            ILO / MoSPI COMPLIANT
          </span>
        </div>
      </div>

      {/* 1. Core Mathematical Index Formulations */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Formula 1: Jevons Index */}
        <div className="avia-card p-5 space-y-3 border-aviaCoral/30">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-aviaCoral uppercase tracking-wider">
              1. Elementary Price Aggregation
            </h3>
            <span className="text-[10px] font-mono text-aviaMuted">Jevons Index</span>
          </div>

          <div className="p-3.5 rounded-none bg-slate-950/90 border border-aviaPeachSoft text-center font-mono text-xs text-aviaCoral font-bold">
            I_J = ( ∏ (p_i^t / p_i^0) ) ^ (1 / n)
          </div>

          <p className="text-[11px] text-aviaMuted leading-relaxed">
            Computes the unweighted geometric mean of price relatives for homogeneous flight strata (same origin, destination, carrier, and booking horizon). Ensures scale invariance and transitivity.
          </p>
        </div>

        {/* Formula 2: Laspeyres Basket Roll-up */}
        <div className="avia-card p-5 space-y-3 border-aviaCoral">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-aviaCoral uppercase tracking-wider">
              2. Higher-Level Roll-up
            </h3>
            <span className="text-[10px] font-mono text-aviaMuted">Weighted Laspeyres</span>
          </div>

          <div className="p-3.5 rounded-none bg-slate-950/90 border border-aviaPeachSoft text-center font-mono text-xs text-aviaCoral font-bold">
            APIx = ∑ ( w_r * I_r ) / ∑ w_r
          </div>

          <p className="text-[11px] text-aviaMuted leading-relaxed">
            Aggregates route strata using DGCA annual passenger volume weights across India's top 50 scheduled domestic air corridors representing 82% of national traffic.
          </p>
        </div>

        {/* Formula 3: Outlier Quarantine */}
        <div className="avia-card p-5 space-y-3 border-amber-500/30">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              3. Anomaly Detection
            </h3>
            <span className="text-[10px] font-mono text-aviaMuted">Modified Z-Score</span>
          </div>

          <div className="p-3.5 rounded-none bg-slate-950/90 border border-aviaPeachSoft text-center font-mono text-xs text-amber-300 font-bold">
            M_i = 0.6745 * | x_i - Med | / MAD
          </div>

          <p className="text-[11px] text-aviaMuted leading-relaxed">
            Applies median absolute deviation (MAD) filtering. Fares with |M_i| &gt; 3.2 are quarantined to prevent flash sale pricing or scraper errors from contaminating official CPI series.
          </p>
        </div>

      </div>

      {/* 2. Sampling Stratification & Weighting Matrix */}
      <div className="avia-card p-5 space-y-4">
        <div className="border-b border-aviaPeachSoft pb-3">
          <h3 className="text-sm font-extrabold text-aviaCharcoal font-heading flex items-center gap-2">
            <i className="fa-solid fa-layer-group text-aviaCoral"></i>
            <span>Advance Booking Horizon Sampling Matrix</span>
          </h3>
          <p className="text-[11px] text-aviaMuted">
            Booking horizons weighted by empirical Indian domestic ticketing lead times
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-none bg-aviaWhite/80 border border-aviaPeachSoft space-y-1">
            <div className="font-mono text-aviaCoral font-bold">T+1 Day</div>
            <div className="text-[10px] text-aviaMuted">Emergency / Close-In</div>
            <div className="text-[11px] text-aviaCharcoal font-bold font-mono">20% Basket Weight</div>
          </div>

          <div className="p-3 rounded-none bg-aviaWhite/80 border border-aviaPeachSoft space-y-1">
            <div className="font-mono text-aviaCoral font-bold">T+7 Days</div>
            <div className="text-[10px] text-aviaMuted">1-Week Standard</div>
            <div className="text-[11px] text-aviaCharcoal font-bold font-mono">25% Basket Weight</div>
          </div>

          <div className="p-3 rounded-none bg-aviaWhite/80 border border-aviaCoral/50 bg-sky-50/50 space-y-1">
            <div className="font-mono text-aviaCoral font-bold">T+15 Days</div>
            <div className="text-[10px] text-aviaCoral">Primary Benchmark</div>
            <div className="text-[11px] text-aviaCharcoal font-bold font-mono">30% Basket Weight</div>
          </div>

          <div className="p-3 rounded-none bg-aviaWhite/80 border border-aviaPeachSoft space-y-1">
            <div className="font-mono text-aviaCoral font-bold">T+30 Days</div>
            <div className="text-[10px] text-aviaMuted">Advance Planner</div>
            <div className="text-[11px] text-aviaCharcoal font-bold font-mono">15% Basket Weight</div>
          </div>

          <div className="p-3 rounded-none bg-aviaWhite/80 border border-aviaPeachSoft space-y-1">
            <div className="font-mono text-aviaCoral font-bold">T+45 Days</div>
            <div className="text-[10px] text-aviaMuted">Long-Range Booking</div>
            <div className="text-[11px] text-aviaCharcoal font-bold font-mono">10% Basket Weight</div>
          </div>
        </div>
      </div>

    </div>
  );
}
