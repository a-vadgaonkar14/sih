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
            <div className="w-10 h-10 rounded-none bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-aviaCharcoal text-base">
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
          
          {/* Architecture Overview Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div className="avia-card p-4 bg-aviaWhite/80 border-aviaCoral/40 space-y-2">
              <div className="w-7 h-7 rounded-none bg-aviaPeachLight0/20 text-aviaCoral flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div className="font-bold text-aviaCharcoal text-sm">Stealth Ingestion</div>
              <p className="text-[11px] text-aviaMuted">
                Playwright async crawler operating with stealth evasions across Google Flights and direct airline engines.
              </p>
            </div>

            <div className="avia-card p-4 bg-aviaWhite/80 border-aviaCoral space-y-2">
              <div className="w-7 h-7 rounded-none bg-aviaPeachLight0/20 text-aviaCoral flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div className="font-bold text-aviaCharcoal text-sm">Normalization & Audit</div>
              <p className="text-[11px] text-aviaMuted">
                Fare decomposition (Base + Fuel + UDF + GST), modified Z-Score (3.2σ) outlier quarantine, and SHA-256 quote hash sealing.
              </p>
            </div>

            <div className="avia-card p-4 bg-aviaWhite/80 border-amber-500/40 space-y-2">
              <div className="w-7 h-7 rounded-none bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <div className="font-bold text-aviaCharcoal text-sm">Statistical Engine</div>
              <p className="text-[11px] text-aviaMuted">
                Elementary Jevons geometric mean aggregation, chained Laspeyres basket weighting, and 7-horizon advance booking curves.
              </p>
            </div>

            <div className="avia-card p-4 bg-aviaWhite/80 border-emerald-500/40 space-y-2">
              <div className="w-7 h-7 rounded-none bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <div className="font-bold text-aviaCharcoal text-sm">Policy Augmentation</div>
              <p className="text-[11px] text-aviaMuted">
                Real-time CPI augmentation, factor waterfall decomposition, REST API endpoints, and live SSE event stream.
              </p>
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
