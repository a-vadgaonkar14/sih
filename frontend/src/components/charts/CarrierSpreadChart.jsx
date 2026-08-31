import React from 'react';

const CARRIER_COLORS = {
  '6E': '#0284c7', // IndiGo Sky Blue
  'AI': '#e11d48', // Air India Crimson
  'QP': '#ea580c', // Akasa Air Orange
  'SG': '#dc2626', // SpiceJet Red
  'IX': '#b45309', // Air India Express Amber
  'UK': '#7c3aed', // Vistara Purple
};

export default function CarrierSpreadChart({ carrierData = [], observations = [] }) {
  // 1. Derive or use carrier data
  let carriers = carrierData;
  if (!carriers || carriers.length === 0) {
    if (observations.length > 0) {
      const groups = {};
      observations.forEach((o) => {
        const c = o.carrier_code || o.carrier || '6E';
        if (!groups[c]) groups[c] = [];
        if (o.total_fare) groups[c].push(o.total_fare);
      });

      const totalCount = observations.length;
      carriers = Object.entries(groups).map(([code, fares]) => {
        fares.sort((a, b) => a - b);
        const mean = Math.round(fares.reduce((a, b) => a + b, 0) / fares.length);
        const median = fares[Math.floor(fares.length / 2)];
        return {
          code,
          name: code === '6E' ? 'IndiGo (6E)' : code === 'AI' ? 'Air India (AI)' : code === 'QP' ? 'Akasa Air (QP)' : code === 'SG' ? 'SpiceJet (SG)' : code === 'IX' ? 'AI Express (IX)' : `Carrier (${code})`,
          type: code === 'AI' || code === 'UK' ? 'FSC' : 'LCC',
          color: CARRIER_COLORS[code] || '#64748b',
          mean_fare: mean,
          median_fare: median,
          mode_fare: median,
          spread_min: fares[0],
          spread_max: fares[fares.length - 1],
          quote_count: fares.length,
          market_share_percent: Math.round((fares.length / totalCount) * 100)
        };
      });
    }
  }

  if (!carriers || carriers.length === 0) {
    return (
      <div className="py-8 text-center text-aviaMuted font-mono text-xs">
        No carrier dispersion data available.
      </div>
    );
  }

  // 2. Dynamic Auto-scaling
  const allMin = Math.min(...carriers.map((c) => c.spread_min || 3000));
  const allMax = Math.max(...carriers.map((c) => c.spread_max || 25000));
  
  const minScale = Math.max(0, Math.floor(allMin / 1000) * 1000 - 500);
  const maxScale = Math.ceil(allMax / 5000) * 5000 + 2000;
  const range = maxScale - minScale || 1;

  const getPercent = (val) => Math.max(0, Math.min(100, ((val - minScale) / range) * 100));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-aviaMuted border-b border-aviaPeachSoft pb-2">
        <span>Carrier & Fleet Model</span>
        <div className="flex items-center gap-6 font-mono text-[11px]">
          <span>Observed Price Range (Min - Max)</span>
          <span>Median / Mean</span>
        </div>
      </div>

      <div className="space-y-4">
        {carriers.map((c) => (
          <div key={c.code} className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-none" style={{ backgroundColor: c.color }}></span>
                <span className="font-bold text-aviaCharcoal">{c.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 font-bold border ${c.type === 'FSC' ? 'bg-purple-50 text-purple-800 border-purple-200' : 'bg-sky-50 text-sky-800 border-sky-200'}`}>
                  {c.type}
                </span>
                <span className="text-[10px] font-mono text-aviaMuted">
                  ({c.quote_count} quotes • {c.market_share_percent}%)
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-aviaMuted text-[11px]">
                  ₹{c.spread_min?.toLocaleString()} – ₹{c.spread_max?.toLocaleString()}
                </span>
                <span className="text-aviaCharcoal font-extrabold" title="Median / Mean">
                  ₹{c.median_fare?.toLocaleString()} <span className="text-aviaMuted font-normal">/</span> ₹{c.mean_fare?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Range Bar */}
            <div className="relative h-5 bg-aviaPeachLight/60 border border-aviaPeachSoft overflow-hidden group">
              {/* Spread Box */}
              <div
                className="absolute top-0 bottom-0 opacity-40 transition-all duration-500"
                style={{
                  left: `${getPercent(c.spread_min)}%`,
                  width: `${Math.max(3, getPercent(c.spread_max) - getPercent(c.spread_min))}%`,
                  backgroundColor: c.color
                }}
              ></div>

              {/* Median Marker */}
              <div
                className="absolute top-0 bottom-0 w-2 bg-aviaCharcoal shadow transform -translate-x-1/2"
                style={{ left: `${getPercent(c.median_fare)}%` }}
                title={`Median: ₹${c.median_fare}`}
              ></div>
              
              {/* Mean Marker */}
              <div
                className="absolute top-0 bottom-0 w-1.5 bg-emerald-600 shadow transform -translate-x-1/2"
                style={{ left: `${getPercent(c.mean_fare)}%` }}
                title={`Mean: ₹${c.mean_fare}`}
              ></div>
            </div>

            {/* Subtext info */}
            <div className="flex justify-between items-center text-[10px] text-aviaMuted font-mono">
              <span>Min: ₹{c.spread_min?.toLocaleString()}</span>
              <div className="flex gap-3">
                <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 bg-aviaCharcoal"></span> Median: ₹{c.median_fare?.toLocaleString()}</span>
                <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 bg-emerald-600"></span> Mean: ₹{c.mean_fare?.toLocaleString()}</span>
              </div>
              <span>Max: ₹{c.spread_max?.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Axis Scale */}
      <div className="flex items-center justify-between text-[10px] font-mono text-aviaMuted pt-2 border-t border-aviaPeachSoft">
        <span>₹{minScale.toLocaleString()}</span>
        <span>₹{Math.round(minScale + range * 0.25).toLocaleString()}</span>
        <span>₹{Math.round(minScale + range * 0.50).toLocaleString()}</span>
        <span>₹{Math.round(minScale + range * 0.75).toLocaleString()}</span>
        <span>₹{maxScale.toLocaleString()}+</span>
      </div>
    </div>
  );
}
