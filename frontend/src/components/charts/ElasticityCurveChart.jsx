import React, { useState } from 'react';

export default function ElasticityCurveChart({ data = [] }) {
  // If no data provided, generate a realistic-looking elasticity curve
  // based on the user's description: as lead time increases, demand drops.
  const curveData = data.length > 0 ? data : [
    { leadTime: 'T+1', days: 1, demand: 980 },
    { leadTime: 'T+7', days: 7, demand: 810 },
    { leadTime: 'T+15', days: 15, demand: 520 },
    { leadTime: 'T+30', days: 30, demand: 290 },
    { leadTime: 'T+45', days: 45, demand: 110 }
  ];

  const [hoveredPoint, setHoveredPoint] = useState(null);

  const svgWidth = 600;
  const svgHeight = 220;
  const padding = { top: 20, right: 30, bottom: 30, left: 50 };

  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // Max values for scaling
  const maxDays = 45;
  const maxDemand = 1000;

  // Scaling functions
  const getX = (days) => padding.left + (days / maxDays) * graphWidth;
  const getY = (demand) => svgHeight - padding.bottom - (demand / maxDemand) * graphHeight;

  // Generate smooth curve path using bezier curves
  const generatePath = () => {
    if (curveData.length === 0) return '';
    let d = `M ${getX(curveData[0].days)},${getY(curveData[0].demand)}`;
    
    for (let i = 1; i < curveData.length; i++) {
      const p0 = curveData[i - 1];
      const p1 = curveData[i];
      
      const cp1x = getX(p0.days) + (getX(p1.days) - getX(p0.days)) / 2;
      const cp1y = getY(p0.demand);
      
      const cp2x = getX(p0.days) + (getX(p1.days) - getX(p0.days)) / 2;
      const cp2y = getY(p1.demand);
      
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${getX(p1.days)},${getY(p1.demand)}`;
    }
    return d;
  };

  const pathD = generatePath();

  // Generate Area under the curve
  const areaD = `${pathD} L ${getX(curveData[curveData.length - 1].days)},${svgHeight - padding.bottom} L ${getX(curveData[0].days)},${svgHeight - padding.bottom} Z`;

  return (
    <div className="w-full flex flex-col relative bg-white overflow-hidden rounded-xl">
      <div className="relative w-full overflow-x-auto pt-2">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[500px] select-none"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            <linearGradient id="elasticityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines (Y-axis for Demand) */}
          {[0, 250, 500, 750, 1000].map((val) => (
            <g key={`y-${val}`}>
              <line
                x1={padding.left}
                y1={getY(val)}
                x2={svgWidth - padding.right}
                y2={getY(val)}
                stroke="rgba(51, 65, 85, 0.15)"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 8}
                y={getY(val) + 3}
                fill="#8c7a73"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="end"
                fontWeight="500"
              >
                {val}
              </text>
            </g>
          ))}

          {/* X Axis Labels (Lead Time) */}
          {curveData.map((d) => (
            <g key={`x-${d.leadTime}`}>
              <line
                x1={getX(d.days)}
                y1={svgHeight - padding.bottom}
                x2={getX(d.days)}
                y2={svgHeight - padding.bottom + 5}
                stroke="#d6c3bd"
                strokeWidth="1.5"
              />
              <text
                x={getX(d.days)}
                y={svgHeight - padding.bottom + 18}
                fill="#8c7a73"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
                fontWeight="bold"
              >
                {d.leadTime}
              </text>
            </g>
          ))}

          {/* Area Fill */}
          <path d={areaD} fill="url(#elasticityGradient)" />

          {/* Main Curve Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {curveData.map((d) => (
            <circle
              key={`pt-${d.leadTime}`}
              cx={getX(d.days)}
              cy={getY(d.demand)}
              r="4.5"
              fill="#fff"
              stroke="#f59e0b"
              strokeWidth="2.5"
              className="transition-all duration-300 ease-in-out"
              style={{
                r: hoveredPoint?.leadTime === d.leadTime ? "6" : "4.5",
                fill: hoveredPoint?.leadTime === d.leadTime ? "#f59e0b" : "#fff",
              }}
            />
          ))}

          {/* Interactive Hover Areas */}
          {curveData.map((d, i) => {
            // Create invisible wide bands for easier hovering
            const prevX = i > 0 ? getX(curveData[i - 1].days) : padding.left;
            const nextX = i < curveData.length - 1 ? getX(curveData[i + 1].days) : svgWidth - padding.right;
            const width = (nextX - prevX) / 2;
            const x = getX(d.days) - width / 2;
            
            return (
              <rect
                key={`hover-${d.leadTime}`}
                x={x}
                y={padding.top}
                width={width * 1.5}
                height={graphHeight}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoveredPoint(d)}
              />
            );
          })}
          
          {/* Hover Indicator Vertical Line */}
          {hoveredPoint && (
            <line
              x1={getX(hoveredPoint.days)}
              y1={padding.top}
              x2={getX(hoveredPoint.days)}
              y2={svgHeight - padding.bottom}
              stroke="#f59e0b"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              className="pointer-events-none"
            />
          )}
        </svg>

        {/* Floating Tooltip Box */}
        {hoveredPoint && (
          <div
            className="absolute top-2 pointer-events-none bg-white/95 px-3 py-2 text-xs space-y-1.5 z-20 border border-amber-300 shadow-xl rounded-md backdrop-blur-sm"
            style={{
              left: Math.min(Math.max(getX(hoveredPoint.days) - 70, padding.left), svgWidth - padding.right - 140)
            }}
          >
            <div className="font-mono text-[10px] text-aviaMuted font-bold border-b border-aviaPeachSoft pb-1 flex justify-between">
              <span>{hoveredPoint.leadTime} Lead Time</span>
              <span>{hoveredPoint.days} Days Out</span>
            </div>
            <div className="flex items-center justify-between gap-6 text-aviaCharcoal font-semibold">
              <span>Customer Demand:</span>
              <span className="font-mono text-amber-600 font-extrabold text-sm">{hoveredPoint.demand}</span>
            </div>
            <div className="text-[9px] text-aviaMuted italic pt-1">
              Elasticity drops as delivery wait increases
            </div>
          </div>
        )}
      </div>
      
      {/* Legend / Y-Axis Label */}
      <div className="absolute -left-[50px] top-[100px] -rotate-90 origin-center">
        <span className="text-[10px] font-bold text-aviaMuted tracking-widest uppercase">
          Customer Demand (Volume)
        </span>
      </div>
    </div>
  );
}
