import React, { useState, useMemo } from 'react';

function splitByLength(str, len) {
  if (!str) return [];
  const words = str.split(' ');
  const lines = [];
  let current = '';
  for (const w of words) {
    if ((current + w).length > len && current.length > 0) {
      lines.push(current.trim());
      current = w + ' ';
    } else {
      current += w + ' ';
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines;
}

function abbreviateLabel(label) {
  if (!label) return [''];
  const MAX_LEN = 16;
  
  if (label.includes('➔')) {
    const arrowIndex = label.indexOf('➔');
    const nextSpace = label.indexOf(' ', arrowIndex + 2);
    if (nextSpace !== -1) {
      const part1 = label.substring(0, nextSpace).trim();
      const part2 = label.substring(nextSpace).trim();
      return [part1, ...splitByLength(part2, MAX_LEN)].slice(0, 3);
    }
  }
  
  return splitByLength(label, MAX_LEN).slice(0, 3);
}

export default function WaterfallChart({ waterfall = [], hoveredFactor, setHoveredFactor, netMovement }) {
  const [tooltip, setTooltip] = useState(null);

  const processedData = useMemo(() => {
    if (!Array.isArray(waterfall) || waterfall.length === 0) return [];

    let currentRunning = 0;
    return waterfall.map((item, idx) => {
      const isBase = item.is_base || item.type === 'start' || idx === 0;
      const isTotal = item.direction === 'total' || item.type === 'end' || idx === waterfall.length - 1;
      
      const rawVal = item.points !== undefined ? item.points : item.value;
      const pts = typeof rawVal === 'number' ? rawVal : parseFloat(rawVal) || 0;
      const factor = item.factor || item.label || `Factor ${idx}`;

      let start = currentRunning;
      let end = isTotal ? pts : isBase ? pts : currentRunning + pts;
      
      if (isBase) {
        currentRunning = pts;
      } else if (!isTotal) {
        currentRunning = end;
      }

      return {
        ...item,
        factor,
        points: pts,
        actualStart: start,
        actualEnd: end,
        isPositive: pts >= 0,
        isBase,
        isTotal,
        lines: abbreviateLabel(factor)
      };
    });
  }, [waterfall]);

  if (processedData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-aviaMuted text-xs font-mono">
        <i className="fa-solid fa-chart-column text-aviaCoral mr-2"></i>
        Loading quantitative waterfall decomposition...
      </div>
    );
  }

  const svgWidth = 1000;
  const svgHeight = 420;
  const padding = { top: 40, right: 40, bottom: 100, left: 60 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const validStarts = processedData.map(d => isNaN(d.actualStart) ? 0 : d.actualStart);
  const validEnds = processedData.map(d => isNaN(d.actualEnd) ? 0 : d.actualEnd);
  
  const minVal = Math.min(...validStarts, ...validEnds);
  const maxVal = Math.max(...validStarts, ...validEnds);
  
  const minScale = Math.floor(isNaN(minVal) ? 0 : minVal) - 6;
  const maxScale = Math.ceil(isNaN(maxVal) ? 100 : maxVal) + 2;
  const range = Math.max(2, maxScale - minScale);

  const getY = (val) => {
    const v = isNaN(val) ? minScale : val;
    return padding.top + graphHeight - ((v - minScale) / range) * graphHeight;
  };

  const colWidth = graphWidth / processedData.length;
  const barWidth = Math.min(colWidth * 0.65, 56);

  return (
    <div className="w-full overflow-visible relative group">
      <div className="w-full overflow-x-auto overflow-y-hidden no-scrollbar">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[800px] select-none block font-sans">
          {/* Y Grid */}
          {[...Array(Math.min(50, range + 1))].map((_, i) => {
            const v = minScale + i;
            if (v % Math.max(1, Math.floor(range / 10)) !== 0) return null; 
            return (
              <g key={v}>
                <line
                  x1={padding.left}
                  y1={getY(v)}
                  x2={svgWidth - padding.right}
                  y2={getY(v)}
                  stroke="rgba(148, 163, 184, 0.25)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 12}
                  y={getY(v) + 4}
                  fill="#64748b"
                  fontSize="12"
                  fontWeight="600"
                  fontFamily="JetBrains Mono, monospace"
                  textAnchor="end"
                >
                  {v}
                </text>
              </g>
            );
          })}

          {/* Connectors */}
          {processedData.map((d, idx) => {
            if (idx === 0) return null;
            const prev = processedData[idx - 1];
            const x1 = padding.left + (idx - 1) * colWidth + (colWidth - barWidth) / 2 + barWidth;
            const x2 = padding.left + idx * colWidth + (colWidth - barWidth) / 2;
            const yLine = getY(prev.actualEnd);
            
            return (
              <line
                key={`conn-${idx}`}
                x1={x1}
                y1={yLine}
                x2={x2}
                y2={yLine}
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            );
          })}

          {/* Bars */}
          {processedData.map((d, idx) => {
            const x = padding.left + idx * colWidth + (colWidth - barWidth) / 2;
            let yTop, yBottom;
            
            if (d.isBase || d.isTotal) {
              yTop = getY(d.actualEnd);
              yBottom = getY(minScale);
            } else {
              yTop = getY(Math.max(d.actualStart, d.actualEnd));
              yBottom = getY(Math.min(d.actualStart, d.actualEnd));
            }
            
            const h = Math.max(Math.abs(yBottom - yTop), 2);

            let barColor = '#10b981'; // semantic green
            let labelColor = '#047857';
            if (d.isBase) {
              barColor = '#302522'; // charcoal
              labelColor = '#302522';
            } else if (d.isTotal) {
              barColor = '#FF7055'; // coral
              labelColor = '#302522';
            } else if (!d.isPositive) {
              barColor = '#f43f5e'; // semantic red
              labelColor = '#be123c';
            }

            const isHovered = hoveredFactor === d.factor;

            return (
              <g 
                key={d.factor || idx} 
                className="cursor-pointer transition-opacity duration-200"
                style={{ opacity: hoveredFactor && !isHovered ? 0.4 : 1 }}
                onMouseEnter={(e) => {
                  if (setHoveredFactor) setHoveredFactor(d.factor);
                  setTooltip({ x: e.clientX + 15, y: e.clientY + 15, data: d });
                }}
                onMouseMove={(e) => {
                  setTooltip(prev => prev ? { ...prev, x: e.clientX + 15, y: e.clientY + 15 } : prev);
                }}
                onMouseLeave={() => {
                  if (setHoveredFactor) setHoveredFactor(null);
                  setTooltip(null);
                }}
              >
                <rect
                  x={x}
                  y={Math.min(yTop, yBottom)}
                  width={barWidth}
                  height={h}
                  fill={barColor}
                  rx="2"
                  className={`transition-all duration-200 ${isHovered ? 'filter drop-shadow-md' : ''}`}
                />

                {/* Value Label */}
                <text
                  x={x + barWidth / 2}
                  y={d.isBase || d.isTotal || d.isPositive ? Math.min(yTop, yBottom) - 8 : Math.max(yTop, yBottom) + 16}
                  fill={labelColor}
                  fontSize="12"
                  fontWeight="800"
                  fontFamily="JetBrains Mono, monospace"
                  textAnchor="middle"
                >
                  {d.isBase || d.isTotal ? `${d.points.toFixed(2)}` : `${d.points > 0 ? '+' : ''}${d.points.toFixed(2)}`}
                </text>

                {/* Factor Name Label */}
                <g transform={`translate(${x + barWidth / 2}, ${padding.top + graphHeight + 24})`}>
                  {d.isBase && (
                    <text y={0} fill="#64748b" fontSize="10" fontWeight="800" textAnchor="middle" className="uppercase tracking-widest">START</text>
                  )}
                  {d.isTotal && (
                    <text y={0} fill="#64748b" fontSize="10" fontWeight="800" textAnchor="middle" className="uppercase tracking-widest">END</text>
                  )}
                  {d.lines.map((line, i) => (
                    <text
                      key={i}
                      y={d.isBase || d.isTotal ? (i + 1) * 14 : i * 14}
                      fill={isHovered ? "#302522" : "#475569"}
                      fontSize="10"
                      fontWeight={isHovered || i === 0 ? "700" : "600"}
                      textAnchor="middle"
                      className="transition-colors"
                    >
                      {line}
                    </text>
                  ))}
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* HTML Tooltip */}
      {tooltip && (
        <div 
          className="fixed z-[9999] pointer-events-none bg-aviaCharcoal text-white border border-aviaPeachSoft shadow-xl p-3 w-64 rounded-none"
          style={{ 
            left: tooltip.x, 
            top: tooltip.y
          }}
        >
          <div className="text-[12px] font-bold text-aviaPeachLight border-b border-aviaWhite/20 pb-2 mb-2 leading-tight">
            {tooltip.data.factor}
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-aviaMuted">Contribution</span>
              <span className={`font-bold ${tooltip.data.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {tooltip.data.points > 0 ? '+' : ''}{tooltip.data.points.toFixed(2)} pts
              </span>
            </div>
            {!tooltip.data.isBase && !tooltip.data.isTotal && (
              <div className="flex justify-between">
                <span className="text-aviaMuted">Direction</span>
                <span>{tooltip.data.isPositive ? 'Upward' : 'Downward'}</span>
              </div>
            )}
            {!tooltip.data.isBase && !tooltip.data.isTotal && netMovement && (
              <div className="flex justify-between">
                <span className="text-aviaMuted">Share of Net</span>
                <span>{((Math.abs(tooltip.data.points) / Math.max(0.01, Math.abs(netMovement))) * 100).toFixed(1)}%</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
