import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-aviaPeachLight border-t border-aviaPeachSoft/80 text-xs text-aviaMuted py-10 px-4 sm:px-6 mt-auto">
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-aviaCharcoal font-bold font-heading">
            <i className="fa-solid fa-plane-departure text-aviaCoral"></i>
            <span>AVIA / APIx India</span>
          </div>
          <p className="text-[11px] text-aviaMuted leading-relaxed">
            Airfare Variation & Index Analytics. A high-frequency statistical intelligence prototype designed to augment national Consumer Price Index (CPI) measurement with transparent, auditable airfare intelligence.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-aviaCharcoal">Statistical Framework</h4>
          <ul className="space-y-1 text-[11px]">
            <li>• Jevons Elementary Aggregation</li>
            <li>• Chained Törnqvist Higher-Level Roll-up</li>
            <li>• Top 50 Domestic Route Basket (82% DGCA Traffic)</li>
            <li>• Modified Z-Score Outlier Quarantine (3.2σ)</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-aviaCharcoal">Architecture & Security</h4>
          <ul className="space-y-1 text-[11px]">
            <li>• Playwright Stealth Async Extractions</li>
            <li>• SHA-256 Cryptographic Quote Lineage</li>
            <li>• Real-time Day & Fare Decomposition</li>
            <li>• RESTful API & SSE Telemetry Feed</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-aviaCharcoal">Governance & Compliance</h4>
          <p className="text-[11px] text-aviaMuted leading-snug">
            Calibrated for Ministry of Statistics and Programme Implementation (MoSPI / NSO), DGCA, and Reserve Bank of India (RBI).
          </p>
          <div className="pt-1">
            <span className="badge-gov bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-mono text-[10px]">
              NSO & RBI AIRFARE FEED • REAL-TIME PRODUCTION
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
