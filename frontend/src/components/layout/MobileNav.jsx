import React from 'react';
import { useApp } from '../../context/AppContext';

export default function MobileNav() {
  const {
    activeView,
    setActiveView,
    isMobileNavOpen,
    setIsMobileNavOpen
  } = useApp();

  const bottomItems = [
    { id: 'overview', label: 'Overview', icon: 'fa-chart-pie' },
    { id: 'routes', label: 'Routes', icon: 'fa-route' },
    { id: 'explain', label: 'Explain', icon: 'fa-chart-waterfall' },
    { id: 'trust', label: 'Trust', icon: 'fa-shield-halved' }
  ];

  const allViews = [
    { id: 'landing', label: 'Product Vision & Hero', icon: 'fa-house', color: 'text-aviaCoral' },
    { id: 'overview', label: 'Executive Overview (Judge Screen)', icon: 'fa-chart-pie', color: 'text-aviaCoral' },
    { id: 'routes', label: 'Route Analytics & Heatmap', icon: 'fa-route', color: 'text-aviaCoral' },
    { id: 'explain', label: 'APIx Explain (Waterfall)', icon: 'fa-chart-bar', color: 'text-amber-400' },
    { id: 'trust', label: 'Trust Center & Lineage', icon: 'fa-shield-halved', color: 'text-cyan-400' },
    { id: 'operations', label: 'Operations & Scraper SRE', icon: 'fa-microchip', color: 'text-rose-400' },
    { id: 'methodology', label: 'Methodology & Standards', icon: 'fa-book-bookmark', color: 'text-aviaCoral' }
  ];

  return (
    <>
      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-aviaWhite/95 backdrop-blur-lg border-t border-aviaPeachSoft px-2 py-2 flex items-center justify-around text-[10px] font-medium text-aviaMuted">
        {bottomItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive
                  ? 'text-aviaCoral font-bold'
                  : item.isDemo
                  ? 'text-amber-400'
                  : 'hover:text-aviaCharcoal'
              }`}
            >
              <i className={`fa-solid ${item.icon} text-sm`}></i>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile Slide-out Menu Overlay */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 bg-aviaWhite/95 backdrop-blur-xl p-6 overflow-y-auto space-y-6 md:hidden animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-aviaPeachSoft pb-4">
            <div className="flex items-center gap-2 text-aviaCharcoal font-bold font-heading text-lg">
              <i className="fa-solid fa-plane-departure text-aviaCoral"></i>
              <span>APIx India Navigation</span>
            </div>
            <button
              onClick={() => setIsMobileNavOpen(false)}
              className="p-2 rounded-none bg-aviaPeachLight text-aviaCharcoal hover:bg-aviaPeachLight transition-colors"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2 text-sm">
            {allViews.map((v) => (
              <button
                key={v.id}
                onClick={() => {
                  setActiveView(v.id);
                  setIsMobileNavOpen(false);
                }}
                className={`w-full p-3 rounded-none border text-left font-semibold flex items-center gap-3 transition-all ${
                  v.isSpecial
                    ? 'bg-gradient-to-r from-orange-950 to-red-950 border-aviaCoral/40 text-aviaCoral font-bold'
                    : activeView === v.id
                    ? 'bg-orange-950/80 border-aviaCoral/60 text-aviaCoral'
                    : 'bg-aviaWhite border-aviaPeachSoft text-aviaCharcoal hover:border-aviaPeachSoft'
                }`}
              >
                <i className={`fa-solid ${v.icon} ${v.color}`}></i>
                <span>{v.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
