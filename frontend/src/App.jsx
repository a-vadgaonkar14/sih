import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import AmbientGlow from './components/layout/AmbientGlow';
import TopBar from './components/layout/TopBar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import MobileNav from './components/layout/MobileNav';
import TourController from './components/common/TourController';
import LineageDrawer from './components/common/LineageDrawer';
import ArchitectureModal from './components/common/ArchitectureModal';
import ExportModal from './components/common/ExportModal';

// Views
import LandingHeroView from './views/LandingHeroView';
import ExecutiveOverviewView from './views/ExecutiveOverviewView';
import RouteAnalyticsView from './views/RouteAnalyticsView';
import APIxExplainView from './views/APIxExplainView';
import TrustCenterView from './views/TrustCenterView';
import OperationsMonitorView from './views/OperationsMonitorView';
import MethodologyView from './views/MethodologyView';
import DemoModeView from './views/DemoModeView';

function MainAppShell() {
  const { activeView } = useApp();

  const renderActiveView = () => {
    switch (activeView) {
      case 'landing':
        return <LandingHeroView />;
      case 'overview':
        return <ExecutiveOverviewView />;
      case 'routes':
        return <RouteAnalyticsView />;
      case 'explain':
        return <APIxExplainView />;
      case 'trust':
        return <TrustCenterView />;
      case 'operations':
        return <OperationsMonitorView />;
      case 'methodology':
        return <MethodologyView />;
      case 'demo':
        return <DemoModeView />;
      default:
        return <ExecutiveOverviewView />;
    }
  };

  return (
    <div className="bg-aviaIvory text-aviaCharcoal min-h-screen flex flex-col antialiased relative">
      {/* Ambient Glow Orbs */}
      <AmbientGlow />

      {/* Top Bar Header */}
      <TopBar />

      {/* Speed-Run Tour Banner Controller */}
      <TourController />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex w-full mx-auto px-4 sm:px-6 py-6 gap-6">
        {/* Collapsible Sidebar */}
        <Sidebar />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 min-w-0 flex flex-col">
          {renderActiveView()}
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Mobile Navigation Drawer & Bottom Bar */}
      <MobileNav />

      {/* Drawers & Modals */}
      <LineageDrawer />
      <ArchitectureModal />
      <ExportModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppShell />
    </AppProvider>
  );
}
