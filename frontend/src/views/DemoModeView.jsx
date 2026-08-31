import { useApp } from '../context/AppContext';

export default function DemoModeView() {
  const { setActiveView, startTour, setIsArchitectureModalOpen } = useApp();

  const demoTracks = [
    {
      num: 1,
      view: 'overview',
      title: 'Executive Overview & High-Frequency CPI',
      desc: 'Evaluate live calculated National APIx, 7-day rolling volatility, 90-day time series, top route movers, and master observations table.',
      icon: 'fa-chart-pie',
      color: 'text-aviaCoral'
    },
    {
      num: 2,
      view: 'routes',
      title: 'Route Analytics & Dynamic Heatmap',
      desc: 'Analyze yield curves from T+1 emergency bookings to T+45 advance purchases, alongside carrier price dispersion.',
      icon: 'fa-route',
      color: 'text-aviaCoral'
    },
    {
      num: 3,
      view: 'explain',
      title: 'APIx Explain (Factor Waterfall)',
      desc: 'Inspect exact quantitative breakdown attributing today’s index movement to route, horizon, fuel surcharge, and tax drivers.',
      icon: 'fa-chart-waterfall',
      color: 'text-amber-400'
    },
    {
      num: 4,
      view: 'trust',
      title: 'Trust Center & Cryptographic Lineage',
      desc: 'Verify SHA-256 audit seals, Raw Evidence Drawer, and 3.2σ modified Z-Score outlier quarantine protection.',
      icon: 'fa-shield-halved',
      color: 'text-cyan-400'
    },
    {
      num: 5,
      view: 'operations',
      title: 'Operations & SRE Live Scraper',
      desc: 'Monitor domestic airline direct booking portals (Air India, IndiGo, Akasa, SpiceJet, AI Express) and live SSE telemetry.',
      icon: 'fa-microchip',
      color: 'text-rose-400'
    },
    {
      num: 6,
      view: 'methodology',
      title: 'Statistical Standards & DGCA Basket',
      desc: 'Review mathematical Jevons and Laspeyres formulas compliant with ILO CPI Manual and DGCA passenger weighting.',
      icon: 'fa-book-bookmark',
      color: 'text-aviaCoral'
    }
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="avia-card p-6 bg-gradient-to-r from-sky-50 via-indigo-50 to-white border-2 border-aviaCoral">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-bold mb-2">
              <i className="fa-solid fa-graduation-cap text-amber-700"></i>
              <span>SIH Grand Finale Judge Evaluation Mode</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-aviaCharcoal font-heading">
              Smart India Hackathon 2026 Evaluation Hub
            </h2>
            <p className="text-xs text-aviaMuted max-w-2xl mt-1">
              Select any core evaluation track below or launch the automated guided speed-run tour.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={startTour}
              className="py-3 px-6 rounded-none bg-aviaCoralDeep hover:bg-aviaPeachLight0 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <i className="fa-solid fa-play text-xs"></i>
              <span>Start Speed-Run Guided Tour</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Step Interactive Evaluation Tracks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {demoTracks.map((track) => (
          <div
            key={track.num}
            onClick={() => setActiveView(track.view)}
            className="avia-card p-5 space-y-3 avia-card-interactive cursor-pointer group hover:border-aviaCoral/60"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-none bg-aviaPeachLight border border-aviaPeachSoft flex items-center justify-center text-sm font-bold text-aviaCharcoal group-hover:bg-aviaCoralDeep transition-colors">
                {track.num}
              </div>
              <i className={`fa-solid ${track.icon} ${track.color} text-lg`}></i>
            </div>

            <h3 className="text-sm font-bold text-aviaCharcoal font-heading group-hover:text-aviaCoral transition-colors">
              {track.title}
            </h3>

            <p className="text-xs text-aviaMuted leading-relaxed">
              {track.desc}
            </p>

            <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-aviaCoral group-hover:translate-x-1 transition-transform">
              <span>Open Evaluation Track</span>
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
