import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../api/client';

const AppContext = createContext();

export const TOUR_STEPS = [
  {
    target: 'overview',
    title: '1. Executive High-Frequency CPI Dashboard',
    desc: 'Demonstrates live calculated National APIx, 7-day rolling volatility, 90-day index roll-ups, and route mover variance across all 5 scheduled domestic airlines.'
  },
  {
    target: 'routes',
    title: '2. Multi-Horizon Pricing Heatmap',
    desc: 'Evaluates dynamic route curves across 5 advance booking horizons (T+1 to T+45) with carrier price spread and market dispersion metrics.'
  },
  {
    target: 'explain',
    title: '3. APIx Explain - Factor Decomposition',
    desc: 'Mathematical waterfall attributing today’s index movement into route, lead-time, tax, and fuel cost drivers.'
  },
  {
    target: 'trust',
    title: '4. Trust & Cryptographic Lineage Center',
    desc: 'Examines SHA-256 audit seals, outlier quarantine (3.2σ), and end-to-end data pipeline integrity.'
  },
  {
    target: 'operations',
    title: '5. Scraper SRE & Live Telemetry',
    desc: 'Monitors real-time headless crawler health across domestic airline direct booking portals with live SSE telemetry.'
  },
  {
    target: 'demo',
    title: '6. SIH Evaluator Guided Speed-Run',
    desc: 'Comprehensive summary matrix and live scenario testing ready for national policy deployment.'
  }
];

export function AppProvider({ children }) {
  const [activeView, setActiveView] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Global Filter State
  const [filters, setFilters] = useState({
    origin: 'ALL',
    dest: 'ALL',
    carrier: 'ALL',
    source: 'ALL',
    lead: 'ALL',
    status: 'ALL',
    day: 'ALL',
    fareType: 'total', // 'total' or 'base'
    flightClass: 'ALL', // 'economy', 'business', 'first', etc.
    searchQuery: '',
    timeframeDays: 30,
    granularity: 'daily'
  });

  // Data State
  const [overviewData, setOverviewData] = useState(null);
  const [routesData, setRoutesData] = useState(null);
  const [trustData, setTrustData] = useState(null);
  const [operationsData, setOperationsData] = useState(null);
  const [explainData, setExplainData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Drawers & Modals
  const [selectedLineageId, setSelectedLineageId] = useState(null);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Tour State
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Load Initial Metadata & Overview
  const reloadOverview = async () => {
    try {
      const data = await api.fetchOverview(filters.timeframeDays, filters.day, filters.fareType, filters.flightClass);
      setOverviewData(data);
    } catch (err) {
      console.error('Failed to load overview data:', err);
    }
  };

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const [ov, rt, tr, op, ex] = await Promise.all([
          api.fetchOverview(filters.timeframeDays, filters.day, filters.fareType, filters.flightClass),
          api.fetchRoutes(),
          api.fetchTrustMetrics(),
          api.fetchOperations(),
          api.fetchExplain('route')
        ]);
        setOverviewData(ov);
        setRoutesData(rt);
        setTrustData(tr?.trust_metrics || null);
        setOperationsData(op?.operations || null);
        setExplainData(ex);
      } catch (err) {
        console.error('Initial data load failed:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  // Update Overview when filters.day, fareType, or timeframe change
  useEffect(() => {
    reloadOverview();
  }, [filters.day, filters.fareType, filters.timeframeDays]);

  // Connect SSE Telemetry
  useEffect(() => {
    const sse = api.connectTelemetryStream((logEntry) => {
      setLogs((prev) => [logEntry, ...prev].slice(0, 150));
    });
    return () => {
      if (sse && sse.close) sse.close();
    };
  }, []);

  // Tour Controls
  const startTour = () => {
    setIsTourActive(true);
    setTourStep(0);
    setActiveView(TOUR_STEPS[0].target);
  };

  const nextTourStep = () => {
    if (tourStep < TOUR_STEPS.length - 1) {
      const nextIdx = tourStep + 1;
      setTourStep(nextIdx);
      setActiveView(TOUR_STEPS[nextIdx].target);
    } else {
      endTour();
    }
  };

  const prevTourStep = () => {
    if (tourStep > 0) {
      const prevIdx = tourStep - 1;
      setTourStep(prevIdx);
      setActiveView(TOUR_STEPS[prevIdx].target);
    }
  };

  const endTour = () => {
    setIsTourActive(false);
    setTourStep(0);
  };

  const navigateTo = (view) => {
    setActiveView(view);
    setIsMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const openLineageDrawer = (quoteId) => {
    setSelectedLineageId(quoteId);
  };

  const closeLineageDrawer = () => {
    setSelectedLineageId(null);
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView: navigateTo,
        sidebarCollapsed,
        setSidebarCollapsed,
        isMobileNavOpen,
        setIsMobileNavOpen,
        filters,
        updateFilter,
        overviewData,
        reloadOverview,
        routesData,
        trustData,
        operationsData,
        explainData,
        logs,
        isLoading,
        selectedLineageId,
        openLineageDrawer,
        closeLineageDrawer,
        isArchitectureModalOpen,
        setIsArchitectureModalOpen,
        isExportModalOpen,
        setIsExportModalOpen,
        isTourActive,
        tourStep,
        startTour,
        nextTourStep,
        prevTourStep,
        endTour,
        tourSteps: TOUR_STEPS
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
