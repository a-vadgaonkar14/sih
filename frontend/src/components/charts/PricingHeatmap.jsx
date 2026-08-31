import React from 'react';

export default function PricingHeatmap({ heatmapData, observations = [], onSelectQuote }) {
  // If backend pre-computed heatmapData is provided, use it; otherwise compute from observations
  const windows = heatmapData?.windows || ['T+1', 'T+7', 'T+15', 'T+30', 'T+45'];

  const cityMap = {
    DEL: 'Delhi', BOM: 'Mumbai', BLR: 'Bengaluru',
    MAA: 'Chennai', CCU: 'Kolkata', HYD: 'Hyderabad',
    AMD: 'Ahmedabad', PNQ: 'Pune', COK: 'Kochi',
    GOI: 'Goa', JAI: 'Jaipur', LKO: 'Lucknow'
  };

  // Derive routes dynamically
  let routes = heatmapData?.routes || [];
  if (routes.length === 0 && observations.length > 0) {
    const routeSet = Array.from(new Set(observations.map((o) => `${o.origin}-${o.destination}`)));
    routes = routeSet.sort().map((rid) => {
      const [origin, dest] = rid.split('-');
      return {
        origin,
        dest,
        route_id: rid,
        name: `${cityMap[origin] || origin} - ${cityMap[dest] || dest}`,
        short_name: `${origin}➔${dest}`
      };
    });
  }

  // Get cell data helper
  const getCellData = (orig, dst, win) => {
    const rid = `${orig}-${dst}`;
    if (heatmapData?.matrix && heatmapData.matrix[rid]) {
      return heatmapData.matrix[rid][win];
    }

    const matching = observations.filter(
      (o) => o.origin === orig && o.destination === dst && (o.lead_window === win || o._lead_window === win)
    );
    if (matching.length === 0) return null;

    const fares = matching.map((m) => m.total_fare || m.base_fare || 5000);
    const avgFare = Math.round(fares.reduce((a, b) => a + b, 0) / fares.length);
    const minFare = Math.min(...fares);
    const maxFare = Math.max(...fares);

    return {
      avg_fare: avgFare,
      min_fare: minFare,
      max_fare: maxFare,
      quote_count: matching.length,
      sample_id: matching[0].id,
      jevons_index: Math.round(((Math.exp(fares.reduce((acc, f) => acc + Math.log(f), 0) / fares.length)) / 5000.0) * 100)
    };
  };

  const getHeatmapColor = (fare) => {
    if (!fare) return '';
    if (fare > 10000) return 'bg-rose-100 text-rose-900 border-rose-400 hover:bg-rose-200 font-black';
    if (fare > 8000) return 'bg-amber-100 text-amber-900 border-amber-400 hover:bg-amber-200 font-bold';
    if (fare > 6000) return 'bg-sky-100 text-sky-900 border-sky-300 hover:bg-sky-200 font-semibold';
    return 'bg-emerald-100 text-emerald-900 border-emerald-400 hover:bg-emerald-200 font-semibold';
  };

  if (routes.length === 0) {
    return (
      <div className="py-12 text-center text-aviaMuted font-mono text-xs">
        <i className="fa-solid fa-satellite-dish text-2xl text-aviaCoral mb-2 block"></i>
        Awaiting live route pricing data...
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-xs text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-aviaPeachSoft text-aviaMuted font-semibold uppercase tracking-wider text-[10px]">
            <th className="py-2.5 px-3">Route Corridor</th>
            {windows.map((w) => (
              <th key={w} className="py-2.5 px-2 text-center">
                <span className="font-mono text-aviaCharcoal font-bold">{w}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-aviaPeachSoft/60 font-mono">
          {routes.map((route) => (
            <tr key={route.route_id} className="hover:bg-aviaPeachLight/30 transition-colors">
              <td className="py-2.5 px-3 font-sans">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-aviaCharcoal font-mono text-xs">{route.short_name || `${route.origin}➔${route.dest}`}</span>
                  <span className="text-[11px] text-aviaMuted font-medium hidden md:inline">{route.name}</span>
                </div>
              </td>
              {windows.map((win) => {
                const cell = getCellData(route.origin, route.dest, win);
                if (!cell || !cell.avg_fare) {
                  return (
                    <td key={win} className="py-1.5 px-1.5 text-center">
                      <div className="w-full py-2 px-1 border border-dashed border-aviaPeachSoft/60 bg-aviaPeachLight/40 text-aviaMuted text-xs font-mono select-none" title="No live quotes in this horizon">
                        —
                      </div>
                    </td>
                  );
                }

                return (
                  <td key={win} className="py-1.5 px-1.5 text-center">
                    <button
                      onClick={() => onSelectQuote && cell.sample_id && onSelectQuote(cell.sample_id)}
                      className={`w-full py-1.5 px-1 border text-xs transition-all transform hover:scale-105 shadow-sm flex flex-col items-center justify-center ${getHeatmapColor(
                        cell.avg_fare
                      )}`}
                      title={`${route.name} (${win}): Avg ₹${cell.avg_fare.toLocaleString()} | Range: ₹${cell.min_fare?.toLocaleString()} - ₹${cell.max_fare?.toLocaleString()} | Quotes: ${cell.quote_count}`}
                    >
                      <span>₹{cell.avg_fare.toLocaleString()}</span>
                      <span className="text-[9px] opacity-75 font-mono">
                        {cell.quote_count} quotes
                      </span>
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
