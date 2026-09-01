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
            <img src="/assets/avia-logo.png" alt="AVIA Logo" className="h-10 w-auto object-contain" />
          </button>

        </div>

        {/* Controls (Right Side) */}
        <div className="flex items-center gap-3">
          
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
