import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function ExportModal() {
  const { isExportModalOpen, setIsExportModalOpen } = useApp();
  const [format, setFormat] = useState('csv');
  const [downloading, setDownloading] = useState(false);

  if (!isExportModalOpen) return null;

  const handleDownload = () => {
    setDownloading(true);
    const link = document.createElement('a');
    link.href = `/api/export?format=${format}`;
    link.setAttribute('download', `APIx_India_Airfare_Observations.${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloading(false);
      setIsExportModalOpen(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="avia-card w-full max-w-lg bg-aviaWhite border border-aviaPeachSoft/80 shadow-2xl rounded-none overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-aviaPeachSoft flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-aviaPeachLight0/20 border border-aviaCoral/40 flex items-center justify-center text-aviaCoral text-base">
              <i className="fa-solid fa-cloud-arrow-down"></i>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-aviaCharcoal font-heading">
                Export Airfare Observation Snapshot
              </h3>
              <p className="text-xs text-aviaMuted">
                Download verified high-frequency airfare intelligence dataset
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExportModalOpen(false)}
            className="p-2 rounded-none bg-aviaPeachLight hover:bg-aviaPeachLight text-aviaCharcoal transition-colors"
          >
            <i className="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs text-aviaCharcoal">
          
          {/* Format Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-aviaCharcoal uppercase tracking-wider block">
              Dataset File Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFormat('csv')}
                  className={`flex flex-col items-center justify-center p-4 border-2 transition-all group cursor-pointer ${
                    format === 'csv'
                    ? 'bg-aviaPeachSoft/80 border-aviaCoral text-aviaCharcoal font-bold shadow-sm'
                    : 'bg-aviaWhite border-aviaPeachSoft hover:border-aviaCoral/40 hover:bg-aviaPeachLight'
                  }`}
              >
                <i className="fa-solid fa-file-csv text-emerald-400 text-lg"></i>
                <div>
                  <div className="font-bold text-xs">CSV Spreadsheet</div>
                  <div className="text-[10px] text-aviaMuted">Standard tabular flat file</div>
                </div>
              </button>

              <button
                onClick={() => setFormat('json')}
                  className={`flex flex-col items-center justify-center p-4 border-2 transition-all group cursor-pointer ${
                    format === 'json'
                    ? 'bg-aviaPeachSoft/80 border-aviaCoral text-aviaCharcoal font-bold shadow-sm'
                    : 'bg-aviaWhite border-aviaPeachSoft hover:border-aviaCoral/40 hover:bg-aviaPeachLight'
                  }`}
              >
                <i className="fa-solid fa-file-code text-amber-400 text-lg"></i>
                <div>
                  <div className="font-bold text-xs">JSON Records</div>
                  <div className="text-[10px] text-aviaMuted">Nested lineage objects</div>
                </div>
              </button>
            </div>
          </div>

          {/* Dataset Attributes Information */}
          <div className="p-3.5 rounded-none bg-aviaWhite/80 border border-aviaPeachSoft space-y-1.5 text-[11px] font-mono">
            <div className="text-aviaMuted font-bold text-[10px] uppercase font-sans">
              Included Dataset Schema (21 Columns):
            </div>
            <div className="text-aviaCharcoal leading-relaxed">
              id, hash, origin, destination, carrier, flight_number, departure_date, day_of_week, lead_window, base_fare, fuel_surcharge, taxes_udf, gst, total_fare, source_portal, scraped_at, status, confidence_score
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-aviaPeachSoft bg-aviaWhite flex items-center justify-end gap-3">
          <button
            onClick={() => setIsExportModalOpen(false)}
            className="py-2 px-4 rounded-none bg-aviaPeachLight hover:bg-aviaPeachLight text-aviaCharcoal text-xs font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="py-2 px-5 rounded-none bg-gradient-to-r from-aviaCoral to-orange-500 hover:from-orange-500 hover:to-aviaCoralDeep text-white text-xs font-bold shadow-lg shadow-aviaCoral/20 transition-all flex items-center gap-2"
          >
            <i className={`fa-solid ${downloading ? 'fa-spinner fa-spin' : 'fa-download'}`}></i>
            <span>{downloading ? 'Preparing Download...' : `Download ${format.toUpperCase()}`}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
