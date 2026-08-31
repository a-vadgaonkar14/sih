import React from 'react';
import SparklineChart from '../charts/SparklineChart';

export default function KpiCard({
  title,
  subtitle,
  value,
  deltaText,
  deltaType = 'positive', // 'positive' (good/green), 'negative' (red), 'neutral' (blue)
  sparklineData = [],
  sparklineColor = '#E85D43',
  footnote,
  icon,
  badgeText
}) {
  const getDeltaBadgeStyle = () => {
    if (deltaType === 'up') return 'bg-rose-100 text-rose-800 border-rose-300';
    if (deltaType === 'down') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (deltaType === 'good') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    return 'bg-aviaPeachSoft text-aviaCoralDeep border-aviaCoral';
  };

  return (
    <div className="avia-card p-4 flex flex-col justify-between space-y-3 avia-card-interactive avia-card-glow">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[11px] font-bold text-aviaCharcoal uppercase tracking-wider">
            {title}
          </div>
          {subtitle && (
            <div className="text-[10px] text-aviaMuted font-medium">
              {subtitle}
            </div>
          )}
        </div>

        {icon && (
          <div className="w-7 h-7 rounded-none bg-aviaPeachLight border border-aviaPeachSoft flex items-center justify-center text-aviaCharcoal text-xs">
            <i className={`fa-solid ${icon}`}></i>
          </div>
        )}
      </div>

      {/* Primary Value & Delta */}
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-2xl sm:text-3xl font-black text-aviaCharcoal font-heading tracking-tight">
          {value}
        </div>

        {sparklineData && sparklineData.length > 0 && (
          <SparklineChart data={sparklineData} color={sparklineColor} />
        )}
      </div>

      {/* Footnote & Delta Badge */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-aviaPeachSoft text-[11px]">
        {deltaText && (
          <span className={`px-2 py-0.5 rounded-none border font-mono font-bold text-[10px] ${getDeltaBadgeStyle()}`}>
            {deltaText}
          </span>
        )}

        {footnote && (
          <span className="text-aviaMuted font-medium text-[10px] ml-auto">
            {footnote}
          </span>
        )}

        {badgeText && (
          <span className="px-2 py-0.5 rounded-none bg-aviaPeachSoft text-aviaCoralDeep border border-aviaCoral font-mono text-[9px] font-bold">
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
