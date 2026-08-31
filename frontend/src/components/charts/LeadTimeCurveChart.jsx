import React from 'react';

export default function LeadTimeCurveChart({ curves = [] }) {
  if (!curves || curves.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-aviaMuted text-xs font-mono">
        Loading booking horizon curves...
      </div>
    );
  }

  const svgWidth = 600;
  const svgHeight = 190;
  const padding = { top: 20, right: 25, bottom: 30, left: 45 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const minFare = 3000;
  const maxFare = 10500;
  const range = maxFare - minFare;

  const getX = (idx) => padding.left + (idx / (curves.length - 1)) * graphWidth;
  const getY = (fare) => padding.top + graphHeight - ((fare - minFare) / range) * graphHeight;

  const avgPath = curves.map((c, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(c.avg_fare)}`).join(' ');
  const metroPath = curves.map((c, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(c.metro_fare)}`).join(' ');
  const tier2Path = curves.map((c, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(c.tier2_fare)}`).join(' ');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-aviaMuted">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-aviaCoral"></span>
            <span className="text-aviaCharcoal">All India Avg</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-aviaCoral"></span>
            <span className="text-aviaCharcoal">Metro Routes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-aviaCharcoal">Tier-2 Routes</span>
          </div>
        </div>
        <span className="text-[11px] font-mono text-aviaCoral">T+15 = Baseline 100</span>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[450px]">
          {/* Y Grid */}
          {[4000, 6000, 8000, 10000].map((val) => (
            <g key={val}>
              <line
                x1={padding.left}
                y1={getY(val)}
                x2={svgWidth - padding.right}
                y2={getY(val)}
                stroke="rgba(51, 65, 85, 0.4)"
                strokeDasharray="3 3"
              />
              <text
                x={padding.left - 6}
                y={getY(val) + 3}
                fill="#6F625D"
                fontSize="9"
                fontFamily="JetBrains Mono, monospace"
                textAnchor="end"
              >
                ₹{val / 1000}k
              </text>
            </g>
          ))}

          {/* Curves */}
          <path d={tier2Path} fill="none" stroke="#10b981" strokeWidth="1.8" />
          <path d={metroPath} fill="none" stroke="#818cf8" strokeWidth="1.8" />
          <path d={avgPath} fill="none" stroke="#E85D43" strokeWidth="2.5" />

          {/* Points */}
          {curves.map((c, i) => (
            <g key={c.lead}>
              <circle cx={getX(i)} cy={getY(c.avg_fare)} r="3.5" fill="#E85D43" stroke="#070D18" strokeWidth="1.5" />
              <text
                x={getX(i)}
                y={svgHeight - 10}
                fill="#6F625D"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="600"
                textAnchor="middle"
              >
                {c.lead}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
