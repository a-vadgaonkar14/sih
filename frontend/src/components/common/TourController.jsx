import React from 'react';
import { useApp } from '../../context/AppContext';

export default function TourController() {
  const {
    isTourActive,
    tourStep,
    tourSteps,
    nextTourStep,
    prevTourStep,
    endTour
  } = useApp();

  if (!isTourActive) return null;

  const current = tourSteps[tourStep] || tourSteps[0];

  return (
    <div className="sticky top-16 z-30 w-full w-full px-4 sm:px-6 mb-4 animate-in slide-in-from-top duration-300">
      <div className="avia-card p-4 bg-gradient-to-r from-sky-950/90 via-slate-900/90 to-indigo-950/90 border-2 border-aviaCoral shadow-2xl shadow-sky-500/20 flex flex-wrap items-center justify-between gap-4">
        
        {/* Step Indicator & Info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-none bg-aviaPeachLight0 flex items-center justify-center text-aviaCharcoal font-black text-sm shadow-lg shadow-sky-500/40">
            {tourStep + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-aviaCharcoal font-heading">
                {current.title}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-none bg-aviaPeachLight0/30 text-aviaCoral border border-aviaCoral">
                Step {tourStep + 1} of {tourSteps.length}
              </span>
            </div>
            <p className="text-[11px] text-aviaCharcoal max-w-2xl leading-snug mt-0.5">
              {current.desc}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 ml-auto">
          {tourStep > 0 && (
            <button
              onClick={prevTourStep}
              className="py-1.5 px-3 rounded-none bg-aviaPeachLight hover:bg-aviaPeachLight text-aviaCharcoal border border-aviaPeachSoft text-xs font-semibold transition-all"
            >
              Previous
            </button>
          )}

          <button
            onClick={nextTourStep}
            className="py-1.5 px-4 rounded-none bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-aviaCharcoal text-xs font-bold shadow-md shadow-sky-500/30 transition-all flex items-center gap-1.5"
          >
            <span>{tourStep === tourSteps.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
            <i className="fa-solid fa-arrow-right text-[10px]"></i>
          </button>

          <button
            onClick={endTour}
            className="p-2 rounded-none bg-aviaPeachLight/80 hover:bg-aviaPeachLight text-aviaMuted hover:text-aviaCharcoal transition-colors"
            title="Exit Tour"
          >
            <i className="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>

      </div>
    </div>
  );
}
