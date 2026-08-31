import React from 'react';
import { useApp } from '../../context/AppContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HORIZONS = ['T+1', 'T+7', 'T+15', 'T+30', 'T+45'];

export default function GlobalFilterBar() {
  const { filters, updateFilter, routesData } = useApp();

  const handleReset = () => {
    updateFilter('origin', 'ALL');
    updateFilter('dest', 'ALL');
    updateFilter('carrier', 'ALL');
    updateFilter('source', 'ALL');
    updateFilter('lead', 'ALL');
    updateFilter('status', 'ALL');
    updateFilter('day', 'ALL');
    updateFilter('fareType', 'total');
    updateFilter('searchQuery', '');
  };

  return (
    <div className="avia-card p-3 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs border border-aviaPeachSoft/80">
      
      {/* Filter Controls Grid */}
      <div className="flex flex-wrap items-center gap-3">
        
        {/* Day of Week Selector */}
        <div className="flex items-center gap-1.5 bg-aviaWhite/90 border border-aviaPeachSoft/80 rounded-none px-2.5 py-1.5 text-aviaCharcoal">
          <i className="fa-solid fa-calendar-day text-aviaCoral"></i>
          <span className="font-medium text-aviaMuted">Day:</span>
          <select
            value={filters.day}
            onChange={(e) => updateFilter('day', e.target.value)}
            className="bg-transparent text-aviaCharcoal font-semibold outline-none cursor-pointer text-xs"
          >
            {DAYS.map((d) => (
              <option key={d} value={d} className="bg-aviaWhite">
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Fare Type: Base Fare vs Total Fare */}
        <div className="flex items-center gap-1.5 bg-aviaWhite/90 border border-aviaPeachSoft/80 rounded-none px-2.5 py-1.5 text-aviaCharcoal">
          <i className="fa-solid fa-receipt text-aviaCoral"></i>
          <span className="font-medium text-aviaMuted">Fare:</span>
          <select
            value={filters.fareType}
            onChange={(e) => updateFilter('fareType', e.target.value)}
            className="bg-transparent text-aviaCharcoal font-semibold outline-none cursor-pointer text-xs"
          >
            <option value="total" className="bg-aviaWhite">Total (Inc. Taxes & Surcharges)</option>
            <option value="base" className="bg-aviaWhite">Base Fare Only (ex. Tax)</option>
          </select>
        </div>

        {/* Route / Sector Filter */}
        <div className="flex items-center gap-1.5 bg-aviaWhite/90 border border-aviaPeachSoft/80 rounded-none px-2.5 py-1.5 text-aviaCharcoal">
          <i className="fa-solid fa-route text-emerald-400"></i>
          <span className="font-medium text-aviaMuted">Sector:</span>
          <select
            value={filters.origin === 'ALL' ? 'ALL' : `${filters.origin}-${filters.dest}`}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'ALL') {
                updateFilter('origin', 'ALL');
                updateFilter('dest', 'ALL');
              } else {
                const [orig, dst] = val.split('-');
                updateFilter('origin', orig);
                updateFilter('dest', dst);
              }
            }}
            className="bg-transparent text-aviaCharcoal font-semibold outline-none cursor-pointer text-xs"
          >
            <option value="ALL" className="bg-aviaWhite">All Sectors (National Basket)</option>
            <option value="DEL-BOM" className="bg-aviaWhite">DEL ➔ BOM (Delhi - Mumbai)</option>
            <option value="DEL-BLR" className="bg-aviaWhite">DEL ➔ BLR (Delhi - Bengaluru)</option>
            <option value="BOM-BLR" className="bg-aviaWhite">BOM ➔ BLR (Mumbai - Bengaluru)</option>
            <option value="DEL-CCU" className="bg-aviaWhite">DEL ➔ CCU (Delhi - Kolkata)</option>
            <option value="BLR-HYD" className="bg-aviaWhite">BLR ➔ HYD (Bengaluru - Hyderabad)</option>
            <option value="MAA-DEL" className="bg-aviaWhite">MAA ➔ DEL (Chennai - Delhi)</option>
            <option value="BOM-DEL" className="bg-aviaWhite">BOM ➔ DEL (Mumbai - Delhi)</option>
            <option value="BOM-CCU" className="bg-aviaWhite">BOM ➔ CCU (Mumbai - Kolkata)</option>
            <option value="BOM-HYD" className="bg-aviaWhite">BOM ➔ HYD (Mumbai - Hyderabad)</option>
            <option value="DEL-GOI" className="bg-aviaWhite">DEL ➔ GOI (Delhi - Goa)</option>
            <option value="BOM-GOI" className="bg-aviaWhite">BOM ➔ GOI (Mumbai - Goa)</option>
          </select>
        </div>

        {/* Lead Horizon Filter */}
        <div className="flex items-center gap-1.5 bg-aviaWhite/90 border border-aviaPeachSoft/80 rounded-none px-2.5 py-1.5 text-aviaCharcoal">
          <i className="fa-solid fa-clock text-amber-400"></i>
          <span className="font-medium text-aviaMuted">Horizon:</span>
          <select
            value={filters.lead}
            onChange={(e) => updateFilter('lead', e.target.value)}
            className="bg-transparent text-aviaCharcoal font-semibold outline-none cursor-pointer text-xs"
          >
            <option value="ALL" className="bg-aviaWhite">All Horizons (T+1 to T+45)</option>
            {HORIZONS.map((h) => (
              <option key={h} value={h} className="bg-aviaWhite">
                {h} Horizon
              </option>
            ))}
          </select>
        </div>

        {/* Carrier Filter */}
        <div className="flex items-center gap-1.5 bg-aviaWhite/90 border border-aviaPeachSoft/80 rounded-none px-2.5 py-1.5 text-aviaCharcoal">
          <i className="fa-solid fa-plane text-aviaCoral"></i>
          <span className="font-medium text-aviaMuted">Airline:</span>
          <select
            value={filters.carrier}
            onChange={(e) => updateFilter('carrier', e.target.value)}
            className="bg-transparent text-aviaCharcoal font-semibold outline-none cursor-pointer text-xs"
          >
            <option value="ALL" className="bg-aviaWhite">All Monitored Airlines</option>
            <option value="IndiGo" className="bg-aviaWhite">IndiGo (6E)</option>
            <option value="Air India" className="bg-aviaWhite">Air India (AI) - FSC</option>
            <option value="Akasa Air" className="bg-aviaWhite">Akasa Air (QP)</option>
            <option value="SpiceJet" className="bg-aviaWhite">SpiceJet (SG)</option>
            <option value="Air India Express" className="bg-aviaWhite">Air India Express (IX)</option>
            <option value="Google Flights" className="bg-aviaWhite">Google Flights Live Feed</option>
          </select>
        </div>

        {/* Class Filter */}
        <div className="flex items-center gap-1.5 bg-aviaWhite/90 border border-aviaPeachSoft/80 rounded-none px-2.5 py-1.5 text-aviaCharcoal">
          <i className="fa-solid fa-couch text-aviaCoral"></i>
          <span className="font-medium text-aviaMuted">Class:</span>
          <select
            value={filters.flightClass}
            onChange={(e) => updateFilter('flightClass', e.target.value)}
            className="bg-transparent text-aviaCharcoal font-semibold outline-none cursor-pointer text-xs"
          >
            <option value="ALL" className="bg-aviaWhite">All Classes</option>
            <option value="economy" className="bg-aviaWhite">Economy</option>
            <option value="premium economy" className="bg-aviaWhite">Premium Economy</option>
            <option value="business" className="bg-aviaWhite">Business</option>
            <option value="first" className="bg-aviaWhite">First Class</option>
          </select>
        </div>

      </div>

      {/* Reset & Status CTA */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleReset}
          className="text-[11px] text-aviaMuted hover:text-aviaCoral transition-colors flex items-center gap-1 font-semibold"
          title="Reset all filters to defaults"
        >
          <i className="fa-solid fa-rotate-left"></i>
          <span>Reset Filters</span>
        </button>
      </div>

    </div>
  );
}
