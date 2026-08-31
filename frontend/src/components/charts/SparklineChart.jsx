import React from 'react';

export default function SparklineChart({ data = [], color = '#E85D43', height = 28, width = 90 }) {
  if (!data || data.length < 2) {
    return <div style={{ width, height }} className="bg-aviaPeachLight/40 rounded-none"></div>;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * (width - 4) + 2;
      const y = height - 4 - ((val - min) / range) * (height - 8);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible inline-block">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {/* End point circle */}
      {data.length > 0 && (
        <circle
          cx={width - 2}
          cy={height - 4 - ((data[data.length - 1] - min) / range) * (height - 8)}
          r="2.5"
          fill={color}
          className="animate-pulse"
        />
      )}
    </svg>
  );
}
