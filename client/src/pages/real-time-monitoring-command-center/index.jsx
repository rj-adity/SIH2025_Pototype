import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import KPICard from './components/KPICard';
import VideoFeedGrid from './components/VideoFeedGrid';
import AlertFeed from './components/AlertFeed';
import CrowdAnalyticsChart from './components/CrowdAnalyticsChart';
import LocationSelector from './components/LocationSelector';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const RealTimeMonitoringCommandCenter = () => {
  const [selectedLocation, setSelectedLocation] = useState('Downtown District');
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [timeRange, setTimeRange] = useState('1h');
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [kpiData, setKpiData] = useState({
    population: { value: 145, trend: 5.2, status: 'success' },
    genderRatio: { value: '58:42', trend: -1.1, status: 'info' },
    activeAlerts: { value: 3, trend: 12.5, status: 'warning' },
    safetyScore: { value: 87, trend: 2.3, status: 'success' }
  });
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [sihDemoMode, setSihDemoMode] = useState(false);

  // Enhanced KPI data for SIH2025 presentation
  const sihEnhancedKPI = {
    population: { value: 1250, trend: 8.5, status: 'success', description: 'Real-time crowd detection using AI' },
    genderRatio: { value: '62:38', trend: 2.1, status: 'info', description: 'Gender-based safety analytics' },
    activeAlerts: { value: 2, trend: -25.3, status: 'success', description: 'AI-powered threat detection alerts' },
    safetyScore: { value: 94, trend: 12.7, status: 'success', description: 'Overall women safety index' }
  };

  useEffect(() => {
    // Check if we're in SIH demo mode based on URL or other conditions
    const urlParams = new URLSearchParams(window.location?.search);
    setSihDemoMode(urlParams?.get('sih2025') === 'true' || window.location?.pathname?.includes('sih'));

    // Simulate real-time KPI updates
    const interval = setInterval(() => {
      const currentData = sihDemoMode ? sihEnhancedKPI : kpiData;
      setKpiData(prev => ({
        population: {
          value: Math.max(50, currentData?.population?.value + Math.floor((Math.random() - 0.5) * 20)),
          trend: (Math.random() - 0.5) * 10,
          status: Math.random() > 0.8 ? 'warning' : 'success',
          description: currentData?.population?.description
        },
        genderRatio: {
          value: `${Math.floor(55 + Math.random() * 15)}:${Math.floor(35 + Math.random() * 15)}`,
          trend: (Math.random() - 0.5) * 5,
          status: 'info',
          description: currentData?.genderRatio?.description
        },
        activeAlerts: {
          value: Math.max(0, currentData?.activeAlerts?.value + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0)),
          trend: (Math.random() - 0.5) * 30,
          status: prev?.activeAlerts?.value > 5 ? 'error' : prev?.activeAlerts?.value > 2 ? 'warning' : 'success',
          description: currentData?.activeAlerts?.description
        },
        safetyScore: {
          value: Math.max(60, Math.min(100, currentData?.safetyScore?.value + Math.floor((Math.random() - 0.5) * 6))),
          trend: (Math.random() - 0.5) * 12,
          status: prev?.safetyScore?.value >= 85 ? 'success' : prev?.safetyScore?.value >= 70 ? 'warning' : 'error',
          description: currentData?.safetyScore?.description
        }
      }));
    }, sihDemoMode ? 5000 : 10000); // Faster updates in demo mode

    // Simulate connection status changes
    const connectionInterval = setInterval(() => {
      const statuses = ['connected', 'warning', 'error'];
      const weights = sihDemoMode ? [0.95, 0.04, 0.01] : [0.8, 0.15, 0.05]; // Better connection in demo mode
      const random = Math.random();
      let cumulative = 0;
      
      for (let i = 0; i < statuses?.length; i++) {
        cumulative += weights?.[i];
        if (random <= cumulative) {
          setConnectionStatus(statuses?.[i]);
          break;
        }
      }
    }, sihDemoMode ? 15000 : 8000);

    return () => {
      clearInterval(interval);
      clearInterval(connectionInterval);
    };
  }, [sihDemoMode]);

  const handleLocationChange = (location) => {
    setSelectedLocation(location?.name);
    setSelectedCamera(null);
  };

  const handleCameraSelect = (camera) => {
    setSelectedCamera(camera);
  };

  const handleAlertAction = (alert, action) => {
    console.log('Alert action:', action, 'for alert:', alert?.id);
    
    if (action === 'escalate') {
      setIsEmergencyMode(true);
      setTimeout(() => setIsEmergencyMode(false), 5000);
    }
  };

  const handleGlobalAlert = (type) => {
    console.log('Global alert triggered:', type);
    setIsEmergencyMode(true);
    setTimeout(() => setIsEmergencyMode(false), 10000);
  };

  const handleKPIClick = (kpiType) => {
    console.log('KPI clicked:', kpiType);
    // Could navigate to detailed view or show modal
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return 'Wifi';
      case 'warning': return 'WifiOff';
      case 'error': return 'AlertCircle';
      default: return 'Wifi';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* SIH2025 Demo Banner */}
      {sihDemoMode && (
        <div className="fixed top-16 left-0 right-0 z-30 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-primary/20 px-6 py-2">
          <div className="flex items-center justify-between max-w-[1920px] mx-auto">
            <div className="flex items-center space-x-3">
              <Icon name="Award" size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">SIH2025 DEMO MODE</span>
              <div className="w-1 h-4 bg-border"></div>
              <span className="text-xs text-muted-foreground">Live Women Safety Analytics Demonstration</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Mode Overlay */}
      {isEmergencyMode && (
        <div className="fixed inset-0 z-40 bg-error/20 backdrop-blur-sm animate-pulse">
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-error text-error-foreground px-6 py-3 rounded-lg tactical-shadow-primary">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={20} />
              <span className="font-medium">
                {sihDemoMode ? 'SIH2025 DEMO: EMERGENCY MODE ACTIVATED' : 'EMERGENCY MODE ACTIVATED'}
              </span>
            </div>
          </div>
        </div>
      )}
      <div className={`${sihDemoMode ? 'pt-28' : 'pt-16'} pb-20 md:pb-8`}>
        <div className="max-w-[1920px] mx-auto p-6">
          {/* Enhanced Top Status Bar for SIH */}
          <div className={`flex items-center justify-between mb-6 bg-card border rounded-lg p-4 ${
            sihDemoMode ? 'border-primary/30 bg-gradient-to-r from-card to-primary/5' : 'border-border'
          }`}>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={20} className="text-primary" />
                <span className="font-semibold text-foreground">
                  {sihDemoMode ? 'SIH2025 Command Center' : 'Command Center'}
                </span>
                {sihDemoMode && (
                  <div className="bg-primary/10 border border-primary/30 rounded px-2 py-1 text-xs text-primary font-medium">
                    DEMO
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Icon name={getConnectionStatusIcon()} size={16} className={getConnectionStatusColor()} />
                <span className={`text-sm font-medium ${getConnectionStatusColor()}`}>
                  {connectionStatus?.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={14} />
                <span className="font-mono">{new Date()?.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {sihDemoMode && (
                <div className="flex items-center space-x-2 bg-success/10 border border-success/30 rounded px-3 py-2">
                  <Icon name="Users" size={14} className="text-success" />
                  <span className="text-sm font-medium text-success">
                    {kpiData?.population?.value?.toLocaleString()} People Protected
                  </span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                iconName="RefreshCw"
                onClick={() => window.location?.reload()}
              >
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Settings"
              >
                Settings
              </Button>
            </div>
          </div>

          {/* Enhanced KPI Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <KPICard
              title={sihDemoMode ? 'AI Population Detection' : 'Current Population'}
              value={kpiData?.population?.value?.toLocaleString()}
              subtitle={sihDemoMode ? 'ML-powered crowd analysis' : 'People detected'}
              icon="Users"
              status={kpiData?.population?.status}
              trend={kpiData?.population?.trend}
              onClick={() => handleKPIClick('population')}
              sihMode={sihDemoMode}
              description={kpiData?.population?.description}
            />
            <KPICard
              title={sihDemoMode ? 'Gender Analytics' : 'Gender Distribution'}
              value={kpiData?.genderRatio?.value}
              subtitle={sihDemoMode ? 'Smart safety insights' : 'Female:Male ratio'}
              icon="PieChart"
              status={kpiData?.genderRatio?.status}
              trend={kpiData?.genderRatio?.trend}
              onClick={() => handleKPIClick('gender')}
              sihMode={sihDemoMode}
              description={kpiData?.genderRatio?.description}
            />
            <KPICard
              title={sihDemoMode ? 'AI Threat Alerts' : 'Active Alerts'}
              value={kpiData?.activeAlerts?.value}
              subtitle={sihDemoMode ? 'Real-time threat detection' : 'Requiring attention'}
              icon="Bell"
              status={kpiData?.activeAlerts?.status}
              trend={kpiData?.activeAlerts?.trend}
              onClick={() => handleKPIClick('alerts')}
              sihMode={sihDemoMode}
              description={kpiData?.activeAlerts?.description}
            />
            <KPICard
              title={sihDemoMode ? 'Women Safety Index' : 'Safety Score'}
              value={`${kpiData?.safetyScore?.value}%`}
              subtitle={sihDemoMode ? 'Comprehensive safety metric' : 'Overall safety index'}
              icon="Shield"
              status={kpiData?.safetyScore?.status}
              trend={kpiData?.safetyScore?.trend}
              onClick={() => handleKPIClick('safety')}
              sihMode={sihDemoMode}
              description={kpiData?.safetyScore?.description}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            {/* Video Feed Grid - Takes up 3 columns on large screens */}
            <div className="lg:col-span-3">
              <VideoFeedGrid
                onCameraSelect={handleCameraSelect}
                selectedCamera={selectedCamera}
                sihMode={sihDemoMode}
              />
            </div>

            {/* Right Sidebar - Takes up 1 column */}
            <div className="space-y-6">
              {/* Location Selector */}
              <LocationSelector
                selectedLocation={selectedLocation}
                onLocationChange={handleLocationChange}
                onGlobalAlert={handleGlobalAlert}
                sihMode={sihDemoMode}
              />

              {/* Alert Feed */}
              <AlertFeed 
                onAlertAction={handleAlertAction} 
                sihMode={sihDemoMode}
              />
            </div>
          </div>

          {/* Bottom Analytics Chart */}
          <div className="mb-6">
            <CrowdAnalyticsChart
              selectedTimeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              sihMode={sihDemoMode}
            />
          </div>

          {/* Selected Camera Details */}
          {selectedCamera && (
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Icon name="Video" size={20} className="text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Camera Details: {selectedCamera?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedCamera?.location} • {selectedCamera?.id}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="X"
                  onClick={() => setSelectedCamera(null)}
                >
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Detection Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total People:</span>
                      <span className="font-medium text-foreground">{selectedCamera?.detections?.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Female:</span>
                      <span className="font-medium text-primary">{selectedCamera?.detections?.female}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Male:</span>
                      <span className="font-medium text-secondary">{selectedCamera?.detections?.male}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Alerts:</span>
                      <span className={`font-medium ${selectedCamera?.detections?.alerts > 0 ? 'text-error' : 'text-success'}`}>
                        {selectedCamera?.detections?.alerts}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Camera Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={`font-medium capitalize ${
                        selectedCamera?.status === 'active' ? 'text-success' :
                        selectedCamera?.status === 'warning' ? 'text-warning' : 'text-error'
                      }`}>
                        {selectedCamera?.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Update:</span>
                      <span className="font-medium text-foreground font-mono">
                        {selectedCamera?.lastUpdate?.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Resolution:</span>
                      <span className="font-medium text-foreground">1920x1080</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">FPS:</span>
                      <span className="font-medium text-foreground">30</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" fullWidth iconName="Maximize2">
                      View Fullscreen
                    </Button>
                    <Button variant="outline" size="sm" fullWidth iconName="Download">
                      Export Recording
                    </Button>
                    <Button variant="outline" size="sm" fullWidth iconName="Settings">
                      Camera Settings
                    </Button>
                    <Button variant="warning" size="sm" fullWidth iconName="AlertTriangle">
                      Report Issue
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealTimeMonitoringCommandCenter;