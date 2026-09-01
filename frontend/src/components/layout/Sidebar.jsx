import React from 'react';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const {
    activeView,
    setActiveView,
    sidebarCollapsed,
    setSidebarCollapsed
  } = useApp();

  const navItems = [
    { id: 'landing', label: 'Product Vision & Hero', icon: 'fa-house' },
    { id: 'overview', label: 'Executive Overview', icon: 'fa-chart-pie', badge: 'LIVE' },
    { id: 'routes', label: 'Route Analytics & Heatmap', icon: 'fa-route' },
    { id: 'explain', label: 'APIx Explain (Waterfall)', icon: 'fa-chart-bar' },
    { id: 'trust', label: 'Trust Center & Audit', icon: 'fa-shield-halved' },
    { id: 'operations', label: 'Operations & SRE Health', icon: 'fa-microchip' },
    { id: 'methodology', label: 'Methodology & Standards', icon: 'fa-book-bookmark' }
  ];

  return (
    <aside
      className={`hidden md:flex flex-col shrink-0 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="bg-aviaWhite border border-aviaPeachSoft shadow-sm p-3 space-y-1.5 sticky top-20 rounded-sm">
        
        {/* Sidebar Header */}
        <div className="px-3 py-2 text-[11px] font-bold text-aviaMuted uppercase tracking-wider flex items-center justify-between">
          {!sidebarCollapsed && <span>Navigation</span>}
          <button
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            className="text-aviaMuted hover:text-aviaCharcoal transition-colors"
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <i className={`fa-solid ${sidebarCollapsed ? 'fa-angles-right' : 'fa-angles-left'} text-xs`}></i>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-none text-xs font-semibold transition-all text-left border-l-2 ${
                  isActive
                    ? 'bg-aviaCharcoal text-aviaCoral border-aviaCoral shadow-md'
                    : 'bg-transparent text-aviaMuted hover:bg-aviaPeachLight border-transparent hover:text-aviaCharcoal'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <i className={`fa-solid ${item.icon} w-4 text-center ${isActive ? 'text-aviaCoral' : 'text-aviaCoralDeep'}`}></i>
                {!sidebarCollapsed && (
                  <>
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`ml-auto px-1.5 py-0.5 rounded-none text-[10px] font-mono font-bold ${isActive ? 'text-aviaCoral border border-aviaCoral/30' : 'text-aviaCoralDeep bg-aviaPeachLight border border-aviaPeachSoft'}`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* System Tag */}
        {!sidebarCollapsed && (
          <div className="pt-4 mt-4 border-t border-aviaPeachSoft/80 px-2 space-y-1">
            <div className="text-[10px] text-aviaMuted font-medium">Government Prototype</div>
            <div className="text-[11px] font-mono text-aviaMuted">MoSPI-SIH-2026-AVIA</div>
          </div>
        )}

      </div>
    </aside>
  );
}
