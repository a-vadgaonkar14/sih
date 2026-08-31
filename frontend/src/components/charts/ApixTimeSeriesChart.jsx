import React, { useState } from 'react';

export default function ApixTimeSeriesChart({ series = [], timeframe = 30, onTimeframeChange }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [visibleLines, setVisibleLines] = useState({
    apix: true,
    metro: true,
    nonMetro: true,
    cpi: true
  });

  if (!series || series.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-aviaMuted text-xs font-mono">
        Loading historical APIx time series...
      </div>
    );
  }

  const svgWidth = 800;
  const svgHeight = 240;
  const padding = { top: 20, right: 30, bottom: 35, left: 45 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // Calculate scales
  const allValues = series.flatMap(d => [
    d.apix,
    d.metro_index,
    d.non_metro_index,
    d.cpi_baseline,
    d.confidence_upper,
    d.confidence_lower
  ]).filter(Boolean);

  const minVal = Math.floor(Math.min(...allValues) - 2);
  const maxVal = Math.ceil(Math.max(...allValues) + 2);
  const valRange = maxVal - minVal || 1;

  const getX = (idx) => padding.left + (idx / (series.length - 1)) * graphWidth;
  const getY = (val) => padding.top + graphHeight - ((val - minVal) / valRange) * graphHeight;

  // Paths
  const apixPath = series.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.apix)}`).join(' ');
  const metroPath = series.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.metro_index)}`).join(' ');
  const nonMetroPath = series.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.non_metro_index)}`).join(' ');
  const cpiPath = series.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.cpi_baseline)}`).join(' ');

  // Area under APIx
  const areaPath = `${apixPath} L ${getX(series.length - 1)} ${padding.top + graphHeight} L ${getX(0)} ${padding.top + graphHeight} Z`;

  // Confidence Band Area
  const upperPts = series.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.confidence_upper || d.apix + 1.5)}`).join(' ');
  const lowerPtsRev = series.slice().reverse().map((d, i) => `L ${getX(series.length - 1 - i)} ${getY(d.confidence_lower || d.apix - 1.5)}`).join(' ');
  const confidenceBand = `${upperPts} ${lowerPtsRev} Z`;

  // Y-axis grid ticks
  const yTicks = [minVal, Math.round(minVal + valRange * 0.33), Math.round(minVal + valRange * 0.66), maxVal];

  // X-axis label stride
  const stride = Math.max(1, Math.floor(series.length / 6));

  const toggleLine = (key) => {
    setVisibleLines(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-3">
      {/* Chart Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 font-medium">
          <button
            onClick={() => toggleLine('apix')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-none transition-all ${
              visibleLines.apix ? 'bg-sky-950/80 text-aviaCoral border border-aviaCoral/40' : 'text-aviaMuted opacity-60'
            }`}
          >
            <span className="w-2.5 h-0.5 bg-aviaCoral rounded-full"></span>
            <span>APIx All-India (142.74)</span>
          </button>

          <button
            onClick={() => toggleLine('metro')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-none transition-all ${
              visibleLines.metro ? 'bg-indigo-950/80 text-aviaCoral border border-aviaCoral' : 'text-aviaMuted opacity-60'
            }`}
          >
            <span className="w-2.5 h-0.5 bg-aviaCoral rounded-full"></span>
            <span>Metro Trunk (148.2)</span>
          </button>

          <button
            onClick={() => toggleLine('nonMetro')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-none transition-all ${
              visibleLines.nonMetro ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' : 'text-aviaMuted opacity-60'
            }`}
          >
            <span className="w-2.5 h-0.5 bg-emerald-400 rounded-full"></span>
            <span>Regional & UDAN (134.5)</span>
          </button>

          <button
            onClick={() => toggleLine('cpi')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-none transition-all ${
              visibleLines.cpi ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40' : 'text-aviaMuted opacity-60'
            }`}
          >
            <span className="w-2.5 h-0.5 bg-amber-400 border-dashed border-t border-amber-400"></span>
            <span>CPI Lagged Baseline (133.2)</span>
          </button>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center bg-aviaWhite border border-aviaPeachSoft/80 rounded-none p-0.5">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => onTimeframeChange && onTimeframeChange(d)}
              className={`px-2.5 py-1 rounded-none text-[11px] font-semibold transition-all ${
                timeframe === d
                  ? 'bg-aviaCoralDeep text-aviaCharcoal shadow-sm'
                  : 'text-aviaMuted hover:text-aviaCharcoal'
              }`}
            >
              {d}D
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[600px] select-none"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            <linearGradient id="apixGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E85D43" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#E85D43" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map((val) => (
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
                x={padding.left - 8}
                y={getY(val) + 3}
                fill="#6F625D"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
                textAnchor="end"
              >
                {val}
              </text>
            </g>
          ))}

          {/* Confidence Interval Band */}
          {visibleLines.apix && (
            <path d={confidenceBand} fill="rgba(56, 189, 248, 0.07)" />
          )}

          {/* Area Fill */}
          {visibleLines.apix && (
            <path d={areaPath} fill="url(#apixGradient)" />
          )}

          {/* CPI Line */}
          {visibleLines.cpi && (
            <path
              d={cpiPath}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.8"
              strokeDasharray="4 4"
              opacity="0.85"
            />
          )}

          {/* Regional Line */}
          {visibleLines.nonMetro && (
            <path
              d={nonMetroPath}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              opacity="0.9"
            />
          )}

          {/* Metro Line */}
          {visibleLines.metro && (
            <path
              d={metroPath}
              fill="none"
              stroke="#818cf8"
              strokeWidth="2"
              opacity="0.9"
            />
          )}

          {/* APIx Main Line */}
          {visibleLines.apix && (
            <path
              d={apixPath}
              fill="none"
              stroke="#E85D43"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* X Axis Date Labels */}
          {series.map((d, idx) => {
            if (idx % stride !== 0 && idx !== series.length - 1) return null;
            return (
              <text
                key={d.date}
                x={getX(idx)}
                y={svgHeight - 10}
                fill="#6F625D"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
                textAnchor="middle"
              >
                {d.date.slice(5)}
              </text>
            );
          })}

          {/* Interactive Hover Rectangles */}
          {series.map((d, idx) => {
            const x = getX(idx);
            const width = graphWidth / series.length;
            return (
              <rect
                key={d.date}
                x={x - width / 2}
                y={padding.top}
                width={width}
                height={graphHeight}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoveredPoint({ ...d, x, idx })}
              />
            );
          })}

          {/* Hover Indicator Crosshair */}
          {hoveredPoint && (
            <g>
              <line
                x1={hoveredPoint.x}
                y1={padding.top}
                x2={hoveredPoint.x}
                y2={padding.top + graphHeight}
                stroke="#E85D43"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />
              <circle
                cx={hoveredPoint.x}
                cy={getY(hoveredPoint.apix)}
                r="4.5"
                fill="#E85D43"
                stroke="#070D18"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Floating Tooltip Box */}
        {hoveredPoint && (
          <div
            className="absolute top-2 pointer-events-none avia-card px-3 py-2 text-xs space-y-1 z-20 border border-aviaCoral/40 shadow-xl"
            style={{
              left: Math.min(Math.max(hoveredPoint.x - 70, 10), graphWidth - 100)
            }}
          >
            <div className="font-mono text-[10px] text-aviaMuted font-semibold border-b border-aviaPeachSoft pb-1">
              {hoveredPoint.date} ({hoveredPoint.day_full})
            </div>
            <div className="flex items-center justify-between gap-4 text-aviaCoral font-bold">
              <span>APIx Index:</span>
              <span className="font-mono">{hoveredPoint.apix}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-aviaCoral">
              <span>Metro Sub:</span>
              <span className="font-mono">{hoveredPoint.metro_index}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-emerald-300">
              <span>Regional Sub:</span>
              <span className="font-mono">{hoveredPoint.non_metro_index}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-amber-300">
              <span>CPI Baseline:</span>
              <span className="font-mono">{hoveredPoint.cpi_baseline}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
