import React from 'react';
import { useApp } from '../../context/AppContext';

export default function ArchitectureModal() {
  const { isArchitectureModalOpen, setIsArchitectureModalOpen } = useApp();

  if (!isArchitectureModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="avia-card w-full max-w-4xl bg-aviaWhite border border-aviaPeachSoft/80 shadow-2xl rounded-none overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-aviaPeachSoft flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-gradient-to-tr from-aviaCoral to-orange-500 flex items-center justify-center text-white text-base shadow-sm">
              <i className="fa-solid fa-sitemap"></i>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-aviaCharcoal font-heading">
                AVIA / APIx System Pipeline Architecture
              </h3>
              <p className="text-xs text-aviaMuted">
                End-to-End High-Frequency Statistical Ingestion & CPI Policy Engine
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsArchitectureModalOpen(false)}
            className="p-2 rounded-none bg-aviaPeachLight hover:bg-aviaPeachLight text-aviaCharcoal transition-colors"
          >
            <i className="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs leading-relaxed text-aviaCharcoal">
          
          {/* Architecture Overview Diagram Flowchart */}
          <div className="flex flex-col items-center justify-start gap-6 relative py-4 w-full max-w-3xl mx-auto">
            
            {/* Connecting Line (Vertical) */}
            <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-aviaPeachSoft via-aviaCoral to-orange-500 -z-10 -translate-x-1/2 rounded-full"></div>

            {/* Step 1 */}
            <div className="avia-card p-0 bg-white border-2 border-aviaCoral/40 w-full shadow-lg relative group hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className="bg-aviaCoral/5 p-4 border-b border-aviaCoral/20 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-aviaPeachSoft text-aviaCoral flex items-center justify-center font-bold text-sm shadow-inner">1</div>
                <div className="font-bold text-aviaCharcoal text-base">Stealth Web Ingestion Layer</div>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-4 text-center">
                  <div className="p-3 border border-dashed border-slate-300 rounded-lg bg-slate-50 w-full">
                    <i className="fa-brands fa-python text-2xl text-blue-500 mb-2"></i>
                    <div className="font-bold text-xs text-slate-700">Playwright Agents</div>
                    <div className="text-[10px] text-slate-500 mt-1">Cron Job • Evasions</div>
                  </div>
                  <i className="fa-solid fa-arrow-right-arrow-left text-aviaCoral text-xl hidden md:block"></i>
                  <i className="fa-solid fa-arrow-up-arrow-down text-aviaCoral text-xl md:hidden"></i>
                  <div className="p-3 border border-aviaPeachSoft rounded-lg bg-aviaPeachLight/30 w-full">
                    <i className="fa-solid fa-plane-departure text-2xl text-aviaCoral mb-2"></i>
                    <div className="font-bold text-xs text-aviaCharcoal">Airline Booking Engines</div>
                    <div className="flex gap-1 justify-center mt-2 flex-wrap">
                      <span className="px-1.5 py-0.5 bg-white border border-slate-200 text-[9px] font-mono rounded">6E</span>
                      <span className="px-1.5 py-0.5 bg-white border border-slate-200 text-[9px] font-mono rounded">AI</span>
                      <span className="px-1.5 py-0.5 bg-white border border-slate-200 text-[9px] font-mono rounded">UK</span>
                      <span className="px-1.5 py-0.5 bg-white border border-slate-200 text-[9px] font-mono rounded">QP</span>
                      <span className="px-1.5 py-0.5 bg-white border border-slate-200 text-[9px] font-mono rounded">SG</span>
                    </div>
                  </div>
                  <i className="fa-solid fa-arrow-right text-aviaCoral text-xl hidden md:block"></i>
                  <i className="fa-solid fa-arrow-down text-aviaCoral text-xl md:hidden"></i>
                  <div className="p-3 border border-slate-200 rounded-lg bg-white shadow-sm w-full">
                    <i className="fa-solid fa-file-code text-2xl text-amber-500 mb-2"></i>
                    <div className="font-bold text-xs text-slate-700">Raw DOM Data</div>
                    <div className="text-[10px] text-slate-500 mt-1">T+1 to T+45 Horizons</div>
                  </div>
                </div>
              </div>
            </div>

            <i className="fa-solid fa-chevron-down text-aviaCoral text-2xl opacity-80 z-10 bg-white rounded-full p-1 shadow-sm"></i>

            {/* Step 2 */}
            <div className="avia-card p-0 bg-white border-2 border-aviaCoral w-full shadow-lg relative group hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className="bg-aviaCoral/10 p-4 border-b border-aviaCoral/30 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-aviaCoral text-white flex items-center justify-center font-bold text-sm shadow-inner">2</div>
                <div className="font-bold text-aviaCharcoal text-base">Normalization & Cryptographic Audit</div>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center justify-center">
                    <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase">Fare Decomposition</div>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-aviaCharcoal">
                      <span className="text-emerald-600">Base</span> + <span className="text-orange-500">Fuel</span> + <span className="text-sky-500">UDF</span> + <span className="text-rose-500">GST</span>
                    </div>
                  </div>
                  
                  <div className="p-3 border border-amber-200 rounded-lg bg-amber-50 flex flex-col items-center justify-center">
                    <div className="text-[10px] font-bold text-amber-600 mb-2 uppercase">Z-Score Quarantine</div>
                    <div className="text-xs font-mono font-bold text-amber-800">
                      |M<sub className="text-[8px]">i</sub>| &gt; 3.2&sigma; &rarr; Drop
                    </div>
                  </div>

                  <div className="p-3 border border-indigo-200 rounded-lg bg-indigo-50 flex flex-col items-center justify-center">
                    <div className="text-[10px] font-bold text-indigo-600 mb-2 uppercase">Provenance Seal</div>
                    <div className="text-[9px] font-mono text-indigo-800 break-all leading-tight bg-white p-1 rounded border border-indigo-100">
                      hash=SHA256(origin+dest+carrier+fare)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <i className="fa-solid fa-chevron-down text-amber-500 text-2xl opacity-80 z-10 bg-white rounded-full p-1 shadow-sm"></i>

            {/* Step 3 */}
            <div className="avia-card p-0 bg-white border-2 border-amber-400 w-full shadow-lg relative group hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className="bg-amber-100 p-4 border-b border-amber-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-900 flex items-center justify-center font-bold text-sm shadow-inner">3</div>
                <div className="font-bold text-aviaCharcoal text-base">Statistical Engine (CPI Calibration)</div>
              </div>
              <div className="p-5">
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                  
                  <div className="w-full text-center space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-xl text-slate-600 font-serif italic">∏</div>
                    <div className="font-bold text-xs text-aviaCharcoal">Jevons Index</div>
                    <div className="text-[10px] text-aviaMuted">Unweighted Geometric Mean of route strata</div>
                  </div>
                  
                  <i className="fa-solid fa-plus text-amber-500 text-lg"></i>
                  
                  <div className="w-full text-center space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-xl text-slate-600 font-serif italic">∑</div>
                    <div className="font-bold text-xs text-aviaCharcoal">Laspeyres Roll-up</div>
                    <div className="text-[10px] text-aviaMuted">DGCA Market Share Weighting applied</div>
                  </div>

                  <i className="fa-solid fa-equals text-amber-500 text-lg"></i>

                  <div className="w-full text-center space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center font-bold text-amber-700">APIx</div>
                    <div className="font-bold text-xs text-aviaCharcoal">Final Index</div>
                    <div className="text-[10px] text-aviaMuted">National Inflation Proxy</div>
                  </div>

                </div>
              </div>
            </div>

            <i className="fa-solid fa-chevron-down text-orange-500 text-2xl opacity-80 z-10 bg-white rounded-full p-1 shadow-sm"></i>

            {/* Step 4 */}
            <div className="avia-card p-0 bg-white border-2 border-orange-500 w-full shadow-lg relative group hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className="bg-orange-100 p-4 border-b border-orange-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-inner">4</div>
                <div className="font-bold text-aviaCharcoal text-base">API Delivery & Policy Dashboard</div>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-4 text-center">
                  <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 w-full relative">
                    <i className="fa-solid fa-database text-2xl text-slate-600 mb-2"></i>
                    <div className="font-bold text-xs text-slate-700">SQLite Telemetry DB</div>
                    <span className="absolute -top-2 -right-2 bg-emerald-100 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">Live</span>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 bg-slate-800 text-white text-[10px] font-mono px-3 py-1 rounded-full whitespace-nowrap">
                      <span>GET /api/kpis</span> <i className="fa-solid fa-arrow-right"></i>
                    </div>
                    <div className="flex items-center gap-2 bg-orange-500 text-white text-[10px] font-mono px-3 py-1 rounded-full whitespace-nowrap">
                      <span>SSE Stream</span> <i className="fa-solid fa-bolt"></i>
                    </div>
                  </div>

                  <div className="p-4 border-2 border-orange-300 rounded-lg bg-orange-50 w-full">
                    <i className="fa-brands fa-react text-2xl text-orange-500 mb-2"></i>
                    <div className="font-bold text-xs text-orange-900">React Frontend Dashboard</div>
                    <div className="text-[10px] text-orange-700 mt-1">Heatmaps • Time Series • Lineage</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Technical Specifications Table */}
          <div className="avia-card p-4 space-y-3">
            <div className="font-bold text-aviaCharcoal text-xs uppercase tracking-wider">
              Technical Stack & Operational Guarantees
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <ul className="space-y-1.5 text-[11px]">
                <li><strong className="text-aviaCharcoal">• Ingestion Latency:</strong> ~720ms average per quote</li>
                <li><strong className="text-aviaCharcoal">• Outlier Bound:</strong> Modified Z-score |M_i| &gt; 3.2 limit</li>
                <li><strong className="text-aviaCharcoal">• Basket Coverage:</strong> 50 DGCA routes representing 82% traffic</li>
              </ul>
              <ul className="space-y-1.5 text-[11px]">
                <li><strong className="text-aviaCharcoal">• Provenance Integrity:</strong> 100% SHA-256 cryptographic audit</li>
                <li><strong className="text-aviaCharcoal">• Telemetry Transport:</strong> HTTP/2 Server-Sent Events (SSE)</li>
                <li><strong className="text-aviaCharcoal">• Backend:</strong> Modular Python Pipeline with Flask REST API</li>
              </ul>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-aviaPeachSoft bg-aviaWhite flex justify-end">
          <button
            onClick={() => setIsArchitectureModalOpen(false)}
            className="py-2 px-5 rounded-none bg-aviaPeachLight hover:bg-aviaPeachLight text-aviaCharcoal text-xs font-bold transition-all"
          >
            Close Architecture View
          </button>
        </div>

      </div>
    </div>
  );
}
