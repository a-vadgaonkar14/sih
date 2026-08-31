import React from 'react';

export default function LineageDagSvg() {
  const stages = [
    { num: 1, title: 'Raw Ingestion', subtitle: 'Stealth DOM Extractor', color: '#E85D43', icon: 'fa-robot' },
    { num: 2, title: 'Tax & Fee Split', subtitle: 'Base, YQ, UDF, GST', color: '#818cf8', icon: 'fa-receipt' },
    { num: 3, title: 'Outlier Quarantine', subtitle: 'Modified Z-Score 3.2σ', color: '#f59e0b', icon: 'fa-shield-halved' },
    { num: 4, title: 'SHA-256 Seal', subtitle: 'Cryptographic Provenance', color: '#10b981', icon: 'fa-fingerprint' },
    { num: 5, title: 'Jevons Index', subtitle: 'Official CPI Augmentation', color: '#FF7055', icon: 'fa-chart-line' }
  ];

  return (
    <div className="w-full overflow-x-auto py-2">
      <div className="flex items-center justify-between min-w-[700px] gap-2 relative">
        {stages.map((st, idx) => (
          <React.Fragment key={st.num}>
            {/* Stage Box */}
            <div className="flex-1 avia-card p-3 rounded-none border border-aviaPeachSoft/80 hover:border-aviaCoral/60 transition-all flex flex-col items-center text-center space-y-1 relative group">
              <div
                className="w-8 h-8 rounded-none flex items-center justify-center text-xs text-aviaCharcoal font-bold shadow-lg"
                style={{ backgroundColor: st.color }}
              >
                <i className={`fa-solid ${st.icon}`}></i>
              </div>
              <div className="text-[10px] font-mono font-bold text-aviaMuted">STAGE {st.num}</div>
              <div className="text-xs font-bold text-aviaCharcoal leading-tight">{st.title}</div>
              <div className="text-[10px] text-aviaMuted leading-tight">{st.subtitle}</div>
            </div>

            {/* Connecting Arrow */}
            {idx < stages.length - 1 && (
              <div className="shrink-0 flex items-center text-aviaMuted">
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
