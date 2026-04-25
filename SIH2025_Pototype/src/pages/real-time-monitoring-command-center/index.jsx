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
  const [activeAlerts, setActiveAlerts] = useState(0);
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

  const SERVER_URL = window.SERVER_URL;

  const fetchDashboardStats = async () => {

    try {

      const res = await fetch(`${SERVER_URL}/dashboard_stats`, {
        headers: {
          "ngrok-skip-browser-warning": "true"
        }
      });

      const data = await res.json();

      setKpiData({
        population: {
          value: data.population,
          trend: 0,
          status: "success"
        },
        genderRatio: {
          value: `${data.female_ratio}:${data.male_ratio}`,
          trend: 0,
          status: "info"
        },
        activeAlerts: {
          value: data.alerts,
          trend: 0,
          status: data.alerts > 0 ? "warning" : "success"
        },
        safetyScore: {
          value: data.safety_score,
          trend: 0,
          status:
            data.safety_score >= 85
              ? "success"
              : data.safety_score >= 70
                ? "warning"
                : "error"
        }
      });

    } catch (err) {

      console.log("Dashboard stats error:", err);

    }

  };

  useEffect(() => {

    fetchDashboardStats();

    const interval = setInterval(fetchDashboardStats, 5000);

    return () => clearInterval(interval);

  }, []);

  const fetchIncidents = async () => {

    try {

      const res = await fetch("http://127.0.0.1:8000/incidents");
      const data = await res.json();

      const active = data.incidents.filter(
        i => i.status !== "resolved"
      );

      setActiveAlerts(active.length);

    } catch (err) {

      console.log("Incident fetch error:", err);

    }

  };



  useEffect(() => {

    fetchIncidents(); // run once when page loads

    const interval = setInterval(fetchIncidents, 3000); // run every 3 seconds

    return () => clearInterval(interval);

  }, []);

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

      {/* Emergency Mode Banner */}
      {isEmergencyMode && (
        <div className="fixed top-16 left-0 right-0 z-20 bg-destructive/10 border-b border-destructive/20 px-6 py-2">
          <div className="max-w-[1920px] mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <Icon name="AlertTriangle" size={20} />
              <span className="font-medium">
                EMERGENCY MODE ACTIVATED
              </span>
            </div>
          </div>
        </div>
      )}
      <div className="pt-16 pb-20 md:pb-8">
        <div className="max-w-[1920px] mx-auto p-6">
          {/* Top Status Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={20} className="text-primary" />
                <span className="font-semibold text-foreground">
                  Command Center
                </span>
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

          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <KPICard
              title="Current Population"
              value={kpiData?.population?.value?.toLocaleString()}
              subtitle="People detected"
              icon="Users"
              status={kpiData?.population?.status}
              trend={kpiData?.population?.trend}
              onClick={() => handleKPIClick('population')}
            />
            <KPICard
              title="Gender Distribution"
              value={kpiData?.genderRatio?.value}
              subtitle="Female:Male ratio"
              icon="PieChart"
              status={kpiData?.genderRatio?.status}
              trend={kpiData?.genderRatio?.trend}
              onClick={() => handleKPIClick('gender')}
            />
            <KPICard
              title="Active Alerts"
              value={kpiData?.activeAlerts?.value}
              subtitle="Requiring attention"
              icon="Bell"
              status={kpiData?.activeAlerts?.status}
              trend={kpiData?.activeAlerts?.trend}
              onClick={() => handleKPIClick('alerts')}
            />
            <KPICard
              title="Safety Score"
              value={`${kpiData?.safetyScore?.value}%`}
              subtitle="Overall safety index"
              icon="Shield"
              status={kpiData?.safetyScore?.status}
              trend={kpiData?.safetyScore?.trend}
              onClick={() => handleKPIClick('safety')}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            {/* Video Feed Grid - Takes up 3 columns on large screens */}
            <div className="lg:col-span-3">
              <VideoFeedGrid
                onCameraSelect={handleCameraSelect}
                selectedCamera={selectedCamera}
              />
            </div>

            {/* Right Sidebar - Takes up 1 column */}
            <div className="space-y-6">
              {/* Location Selector */}
              <LocationSelector
                selectedLocation={selectedLocation}
                onLocationChange={handleLocationChange}
                onGlobalAlert={handleGlobalAlert}
              />

              {/* Alert Feed */}
              <AlertFeed
                onAlertAction={handleAlertAction}
              />
            </div>
          </div>

          {/* Bottom Analytics Chart */}
          <div className="mb-6">
            <CrowdAnalyticsChart
              selectedTimeRange={timeRange}
              onTimeRangeChange={setTimeRange}
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
                      <span className={`font-medium capitalize ${selectedCamera?.status === 'active' ? 'text-success' :
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