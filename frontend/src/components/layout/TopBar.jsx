import React from 'react';
import { useApp } from '../../context/AppContext';

export default function TopBar() {
  const {
    setActiveView,
    setIsMobileNavOpen,
    setIsExportModalOpen,
    startTour,
    filters,
    updateFilter,
    overviewData
  } = useApp();
  
  const datasetStatus = overviewData?.dataset_status || 'SIMULATED';
  const isSynthetic = overviewData?.is_synthetic !== false; // default true for safety

  return (
    <header className="sticky top-0 z-40 bg-aviaIvory border-b border-aviaPeachSoft px-4 sm:px-6 py-3 transition-all shadow-sm">
      <div className="w-full flex items-center justify-between gap-4">
        
        {/* Brand & Status (Left Side) */}
        <div className="flex items-center gap-6">
          
          <button
            onClick={() => setIsMobileNavOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-none bg-aviaWhite hover:bg-aviaPeachLight text-aviaCharcoal border border-aviaPeachSoft transition-colors"
            title="Toggle Menu"
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          <button
            onClick={() => setActiveView('overview')}
            className="flex items-center gap-3 group text-left shrink-0"
          >
            <img src="/avia-logo.jpg" alt="AVIA Logo" className="h-10 w-auto object-contain" />
          </button>

          {/* Live Data Status / Demo Badge */}
          {datasetStatus === 'SIMULATED' || isSynthetic ? (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-none bg-amber-500/10 border border-amber-400 text-amber-800 text-xs shadow-xs">
              <i className="fa-solid fa-flask text-amber-600"></i>
              <span className="font-bold tracking-wider">SIMULATED DEMO DATA</span>
              <span className="text-[10px] opacity-90 font-medium border-l border-amber-300 pl-2 ml-1">Values generated for demonstration</span>
            </div>
          ) : datasetStatus === 'UNAVAILABLE' ? (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-none bg-red-50/50 border border-red-200 text-red-800 text-xs shadow-xs">
              <i className="fa-solid fa-triangle-exclamation text-red-500"></i>
              <span className="font-semibold tracking-wider">LIVE DATA UNAVAILABLE</span>
              <span className="text-[10px] opacity-80 font-medium">Compliance block / Acquisition failed</span>
            </div>
          ) : datasetStatus === 'PARTIAL_SUCCESS' ? (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-none bg-orange-50/50 border border-orange-200 text-orange-800 text-xs shadow-xs">
              <span className="pulse-dot bg-orange-500"></span>
              <span className="font-semibold tracking-wider">PARTIAL LIVE DATA</span>
              <span className="text-[10px] opacity-80 font-medium">Some sources blocked</span>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-none bg-emerald-50/50 border border-emerald-200 text-emerald-800 text-xs shadow-xs">
              <span className="pulse-dot bg-emerald-500"></span>
              <span className="font-bold tracking-wider">LIVE DATA</span>
              <span className="text-[10px] opacity-80 font-medium">Verified Source Acquisitions</span>
            </div>
          )}
        </div>

        {/* Controls (Right Side) */}
        <div className="flex items-center gap-3">
          
          <div className="hidden xl:flex items-center gap-3 text-xs">
            {/* Collection Window Date Selector */}
            <div className="flex items-center gap-1.5 bg-aviaWhite border border-aviaPeachSoft rounded-none px-3 py-1.5 text-aviaCharcoal shadow-xs cursor-pointer hover:border-aviaCoral transition-colors">
              <i className="fa-regular fa-calendar text-aviaCoral"></i>
              <span className="font-bold text-aviaMuted">Window</span>
              <span className="font-mono text-aviaCharcoal font-bold ml-1">Live 7-Day Matrix</span>
              <i className="fa-solid fa-chevron-down text-[10px] text-aviaMuted ml-1"></i>
            </div>

            {/* Granularity Selector */}
            <div className="flex items-center gap-1.5 bg-aviaWhite border border-aviaPeachSoft rounded-none px-3 py-1.5 text-aviaCharcoal shadow-xs hover:border-aviaCoral transition-colors">
              <i className="fa-solid fa-chart-simple text-aviaCoral"></i>
              <span className="font-bold text-aviaMuted">Granularity</span>
              <select
                value={filters.granularity}
                onChange={(e) => updateFilter('granularity', e.target.value)}
                className="bg-transparent text-aviaCharcoal font-bold cursor-pointer text-xs outline-none ml-1 appearance-none pr-4"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236F625D%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '8px auto' }}
              >
                <option value="daily" className="bg-aviaWhite">Daily</option>
                <option value="weekly" className="bg-aviaWhite">Weekly</option>
                <option value="monthly" className="bg-aviaWhite">Monthly</option>
              </select>
            </div>
          </div>

          {/* Global Search Input */}
          <div className="relative hidden lg:block w-48 xl:w-56">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-aviaMuted text-xs"></i>
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              placeholder="Search Route (BOM-DEL)..."
              className="w-full pl-8 pr-3 py-1.5 rounded-none bg-aviaWhite border border-aviaPeachSoft text-xs text-aviaCharcoal placeholder-slate-400 outline-none focus:border-aviaCoral transition-colors shadow-xs"
            />
          </div>

          {/* Export Snapshot Button */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 flex-col sm:flex-row rounded-none bg-aviaWhite hover:bg-aviaPeachLight text-aviaCharcoal border border-aviaPeachSoft text-xs font-bold transition-all shadow-xs shrink-0"
          >
            <i className="fa-solid fa-download text-aviaCoral"></i>
            <span className="hidden sm:inline">Export Snapshot</span>
          </button>

          {/* Primary CTA: Speed Run Demo Mode */}
          <button
            onClick={startTour}
            className="flex items-center gap-2 px-4 py-1.5 rounded-none bg-aviaCoral hover:bg-aviaCoralDeep text-white text-xs font-bold shadow-md transition-colors shrink-0"
          >
            <i className="fa-solid fa-play text-[10px]"></i>
            <span>Speed Run Full Tour</span>
          </button>
        </div>

      </div>
    </header>
  );
}
