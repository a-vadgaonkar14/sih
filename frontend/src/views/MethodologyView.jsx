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
        <div className="avia-card p-5 space-y-4 border-aviaCoral/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-aviaCoral/10 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-aviaPeachSoft flex items-center justify-center text-aviaCoral font-bold font-mono">1</div>
            <div>
              <h3 className="text-xs font-bold text-aviaCharcoal uppercase tracking-wider">Elementary Aggregation</h3>
              <span className="text-[10px] font-mono text-aviaMuted">Jevons Index</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 text-center shadow-inner flex items-center justify-center">
            <div className="font-serif text-lg tracking-widest text-aviaCoral italic">
              I<sub className="not-italic text-xs">J</sub> = <span className="text-2xl not-italic align-middle mx-1">∏</span>( p<sub className="not-italic text-xs">i</sub><sup className="not-italic text-xs">t</sup> / p<sub className="not-italic text-xs">i</sub><sup className="not-italic text-xs">0</sup> )<sup className="not-italic text-xs">1/n</sup>
            </div>
          </div>

          <p className="text-[11px] text-aviaMuted leading-relaxed bg-slate-50 p-3 rounded-md">
            <i className="fa-solid fa-circle-info text-aviaCoral mr-1"></i> Computes the unweighted geometric mean of price relatives for homogeneous flight strata. Ensures scale invariance.
          </p>
        </div>

        {/* Formula 2: Laspeyres Basket Roll-up */}
        <div className="avia-card p-5 space-y-4 border-aviaCoral hover:-translate-y-1 hover:shadow-lg hover:shadow-aviaCoral/20 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-aviaCoral/10 rounded-bl-full -z-10"></div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-aviaCoral flex items-center justify-center text-white font-bold font-mono shadow-md">2</div>
            <div>
              <h3 className="text-xs font-bold text-aviaCharcoal uppercase tracking-wider">Higher-Level Roll-up</h3>
              <span className="text-[10px] font-mono text-aviaCoral">Weighted Laspeyres</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-aviaCoral/50 text-center shadow-inner relative flex items-center justify-center">
            <div className="font-serif text-lg tracking-widest text-white italic">
              APIx = <span className="text-2xl not-italic align-middle mx-1">∑</span>( w<sub className="not-italic text-xs">r</sub> &middot; I<sub className="not-italic text-xs">r</sub> ) / <span className="text-2xl not-italic align-middle mx-1">∑</span>w<sub className="not-italic text-xs">r</sub>
            </div>
            <div className="absolute top-1 right-2 text-[8px] text-aviaCoral font-sans font-bold">CORE</div>
          </div>

          <p className="text-[11px] text-aviaCharcoal leading-relaxed bg-aviaPeachSoft p-3 rounded-md border border-aviaCoral/20">
            <i className="fa-solid fa-star text-aviaCoral mr-1"></i> Aggregates route strata using DGCA annual passenger volume weights across India's top scheduled domestic air corridors.
          </p>
        </div>

        {/* Formula 3: Outlier Quarantine */}
        <div className="avia-card p-5 space-y-4 border-amber-500/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 font-bold font-mono">3</div>
            <div>
              <h3 className="text-xs font-bold text-aviaCharcoal uppercase tracking-wider">Anomaly Detection</h3>
              <span className="text-[10px] font-mono text-amber-500">Modified Z-Score</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 text-center shadow-inner flex items-center justify-center">
            <div className="font-serif text-lg tracking-widest text-amber-300 italic">
              M<sub className="not-italic text-xs">i</sub> = 0.6745 &times; <span className="text-2xl not-italic align-middle mx-1">|</span>x<sub className="not-italic text-xs">i</sub> - Med<span className="text-2xl not-italic align-middle mx-1">|</span> / MAD
            </div>
          </div>

          <p className="text-[11px] text-aviaMuted leading-relaxed bg-slate-50 p-3 rounded-md">
            <i className="fa-solid fa-shield-halved text-amber-500 mr-1"></i> Fares with |M_i| &gt; 3.2 are quarantined to prevent flash sale pricing or scraper errors from contaminating official CPI series.
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

          <div className="p-3 rounded-none bg-aviaWhite/80 border border-aviaPeachSoft space-y-1">
            <div className="font-mono text-aviaCoral font-bold">T+15 Days</div>
            <div className="text-[10px] text-aviaMuted">Primary Benchmark</div>
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

      {/* 3. DGCA Carrier Market Share Weighting Matrix */}
      <div className="avia-card p-5 space-y-4">
        <div className="border-b border-aviaPeachSoft pb-3 flex justify-between items-start">
          <div>
            <h3 className="text-sm font-extrabold text-aviaCharcoal font-heading flex items-center gap-2">
              <i className="fa-solid fa-plane-departure text-aviaCoral"></i>
              <span>DGCA Carrier Market Share Weighting Matrix</span>
            </h3>
            <p className="text-[11px] text-aviaMuted">
              Calibrating the Airfare Price Index (APIx) to match December 2024 national passenger traffic reality.
            </p>
          </div>
          <a href="/dgca_market_share_2024.csv" download="dgca_market_share_2024.csv" className="px-3 py-1 bg-aviaCoral text-white rounded-md text-xs font-bold hover:bg-aviaCoralDeep transition-colors whitespace-nowrap">
             <i className="fa-solid fa-download mr-1"></i> Download CSV Spreadsheet
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
          <div className="p-4 rounded-xl border border-aviaPeachSoft bg-gradient-to-br from-white to-orange-50 shadow-sm flex flex-col gap-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-2 h-full bg-aviaCoral transition-all group-hover:w-full group-hover:opacity-10 -z-10"></div>
            <div className="flex justify-between items-center">
              <div className="font-bold text-aviaCharcoal flex items-center gap-2"><i className="fa-solid fa-plane text-aviaCoral"></i> IndiGo (6E)</div>
              <div className="text-aviaCoral font-mono font-bold text-xl">64.4%</div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div className="bg-aviaCoral h-2.5 rounded-full" style={{ width: '64.4%' }}></div>
            </div>
          </div>
          
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="font-bold text-aviaCharcoal flex items-center gap-2"><i className="fa-solid fa-plane text-slate-400"></i> Air India (AI)</div>
              <div className="text-slate-600 font-mono font-bold text-xl">13.2%</div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div className="bg-slate-400 h-2.5 rounded-full" style={{ width: '13.2%' }}></div>
            </div>
          </div>
          
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="font-bold text-aviaCharcoal flex items-center gap-2"><i className="fa-solid fa-plane text-slate-400"></i> Vistara (UK)</div>
              <div className="text-slate-600 font-mono font-bold text-xl">8.8%</div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div className="bg-slate-400 h-2.5 rounded-full" style={{ width: '8.8%' }}></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-center items-center gap-1">
              <div className="font-bold text-aviaCharcoal text-xs">Akasa (QP)</div>
              <div className="text-slate-500 font-mono font-bold text-lg">4.6%</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-center items-center gap-1">
              <div className="font-bold text-aviaCharcoal text-xs">AI Express (IX)</div>
              <div className="text-slate-500 font-mono font-bold text-lg">4.4%</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-center items-center gap-1">
              <div className="font-bold text-aviaCharcoal text-xs">SpiceJet (SG)</div>
              <div className="text-slate-500 font-mono font-bold text-lg">3.3%</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 shadow-sm flex flex-col justify-center items-center gap-1">
              <div className="font-bold text-aviaMuted text-xs">Other / Unknown</div>
              <div className="text-slate-400 font-mono font-bold text-lg">1.3%</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

