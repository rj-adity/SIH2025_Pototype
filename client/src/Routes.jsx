import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import SIH2025Showcase from './pages/sih2025-showcase';

import EmergencyResponseCoordinationHub from './pages/emergency-response-coordination-hub';
import ThreatDetectionAndAnalyticsDashboard from './pages/threat-detection-and-analytics-dashboard';
import SafetyAnalyticsAndReportingCenter from './pages/safety-analytics-and-reporting-center';
import RealTimeMonitoringCommandCenter from './pages/real-time-monitoring-command-center';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<SIH2025Showcase />} />
        <Route path="/sih2025-showcase" element={<SIH2025Showcase />} />
        <Route path="/emergency-response-coordination-hub" element={<EmergencyResponseCoordinationHub />} />
        <Route path="/threat-detection-and-analytics-dashboard" element={<ThreatDetectionAndAnalyticsDashboard />} />
        <Route path="/safety-analytics-and-reporting-center" element={<SafetyAnalyticsAndReportingCenter />} />
        <Route path="/real-time-monitoring-command-center" element={<RealTimeMonitoringCommandCenter />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
