import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import EmergencyStatusBanner from './components/EmergencyStatusBanner';
import StatusCard from './components/StatusCard';
import InteractiveMap from './components/InteractiveMap';
import CommandPanel from './components/CommandPanel';
import ResponseMetrics from './components/ResponseMetrics';

const EmergencyResponseCoordinationHub = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connected');

  useEffect(() => {
    // Simulate initial data loading
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Monitor connection status
    const connectionTimer = setInterval(() => {
      const statuses = ['connected', 'warning', 'error'];
      const randomStatus = statuses?.[Math.floor(Math.random() * statuses?.length)];
      setConnectionStatus(randomStatus);
    }, 15000);

    return () => {
      clearTimeout(loadingTimer);
      clearInterval(connectionTimer);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-[60px] pb-[80px] md:pb-0">
          <div className="flex items-center justify-center h-[calc(100vh-60px)]">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">Initializing Emergency Response Center</h2>
                <p className="text-muted-foreground">Loading critical systems and real-time data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-[60px] pb-[80px] md:pb-0">
        <div className="container mx-auto px-6 py-6 space-y-6">
          {/* Emergency Status Banner - Full Width */}
          <EmergencyStatusBanner />

          {/* Status Cards Row - 3 Equal Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatusCard
              title="Active Incidents"
              value={7}
              subtitle="Requiring immediate response"
              icon="AlertTriangle"
              color="error"
              trend={-12}
              countdownTarget={0}
            />
            <StatusCard
              title="Deployed Resources"
              value={23}
              subtitle="Units currently in field"
              icon="Users"
              color="primary"
              trend={8}
              countdownTarget={0}
            />
            <StatusCard
              title="Average Response Time"
              value={0}
              subtitle="Target: 5:00 minutes"
              icon="Clock"
              color="success"
              trend={0}
              isCountdown={true}
              countdownTarget={285}
            />
          </div>

          {/* Main Coordination Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Interactive Map - 8 Columns */}
            <div className="lg:col-span-8">
              <InteractiveMap />
            </div>

            {/* Command Panel - 4 Columns */}
            <div className="lg:col-span-4">
              <CommandPanel />
            </div>
          </div>

          {/* Response Performance Metrics - Full Width */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Performance Analytics</h2>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${connectionStatus === 'connected' ? 'bg-success animate-pulse' : connectionStatus === 'warning' ? 'bg-warning' : 'bg-error'}`}></div>
                <span className="text-sm text-muted-foreground">
                  Real-time Updates {connectionStatus === 'connected' ? 'Active' : connectionStatus === 'warning' ? 'Limited' : 'Offline'}
                </span>
              </div>
            </div>
            <ResponseMetrics />
          </div>

          {/* Emergency Protocols Quick Access */}
          <div className="bg-card border border-border rounded-lg p-6 tactical-shadow-secondary">
            <h3 className="text-lg font-semibold text-foreground mb-4">Emergency Protocols</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-error/10 border border-error rounded-lg text-center">
                <div className="w-12 h-12 bg-error rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-error-foreground font-bold">1</span>
                </div>
                <h4 className="font-medium text-foreground mb-1">Code Red</h4>
                <p className="text-xs text-muted-foreground">Immediate life-threatening emergency</p>
              </div>
              
              <div className="p-4 bg-warning/10 border border-warning rounded-lg text-center">
                <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-warning-foreground font-bold">2</span>
                </div>
                <h4 className="font-medium text-foreground mb-1">Code Orange</h4>
                <p className="text-xs text-muted-foreground">High priority safety concern</p>
              </div>
              
              <div className="p-4 bg-primary/10 border border-primary rounded-lg text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary-foreground font-bold">3</span>
                </div>
                <h4 className="font-medium text-foreground mb-1">Code Blue</h4>
                <p className="text-xs text-muted-foreground">Standard response protocol</p>
              </div>
              
              <div className="p-4 bg-success/10 border border-success rounded-lg text-center">
                <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-success-foreground font-bold">4</span>
                </div>
                <h4 className="font-medium text-foreground mb-1">All Clear</h4>
                <p className="text-xs text-muted-foreground">Situation resolved and secure</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmergencyResponseCoordinationHub;