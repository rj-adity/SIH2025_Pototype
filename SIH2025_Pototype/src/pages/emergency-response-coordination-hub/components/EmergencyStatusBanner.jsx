import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmergencyStatusBanner = () => {
  const [emergencyLevel, setEmergencyLevel] = useState('HIGH');
  const [activeIncidents, setActiveIncidents] = useState(7);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const emergencyLevels = {
    LOW: { color: 'text-success', bgColor: 'bg-success/10', borderColor: 'border-success' },
    MEDIUM: { color: 'text-warning', bgColor: 'bg-warning/10', borderColor: 'border-warning' },
    HIGH: { color: 'text-error', bgColor: 'bg-error/10', borderColor: 'border-error' },
    CRITICAL: { color: 'text-error', bgColor: 'bg-error/20', borderColor: 'border-error animate-pulse' }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleBroadcast = () => {
    setIsBroadcasting(true);
    setTimeout(() => setIsBroadcasting(false), 3000);
  };

  const handleEscalate = () => {
    const levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const currentIndex = levels?.indexOf(emergencyLevel);
    if (currentIndex < levels?.length - 1) {
      setEmergencyLevel(levels?.[currentIndex + 1]);
    }
  };

  return (
    <div className={`w-full p-6 rounded-lg border-2 ${emergencyLevels?.[emergencyLevel]?.bgColor} ${emergencyLevels?.[emergencyLevel]?.borderColor} tactical-shadow-primary`}>
      <div className="flex items-center justify-between">
        {/* Emergency Status */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full ${emergencyLevels?.[emergencyLevel]?.bgColor} border-2 ${emergencyLevels?.[emergencyLevel]?.borderColor} flex items-center justify-center`}>
              <Icon name="AlertTriangle" size={24} className={emergencyLevels?.[emergencyLevel]?.color} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Emergency Response Active</h1>
              <div className="flex items-center space-x-4 mt-1">
                <span className={`text-lg font-semibold ${emergencyLevels?.[emergencyLevel]?.color}`}>
                  {emergencyLevel} ALERT
                </span>
                <span className="text-sm text-muted-foreground">
                  Last Updated: {lastUpdate?.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          {/* Active Incidents Counter */}
          <div className="flex items-center space-x-2 px-4 py-2 bg-card rounded-lg border border-border">
            <Icon name="Activity" size={20} className="text-primary" />
            <div>
              <div className="text-2xl font-bold text-foreground">{activeIncidents}</div>
              <div className="text-xs text-muted-foreground">Active Incidents</div>
            </div>
          </div>
        </div>

        {/* Control Actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="warning"
            size="lg"
            onClick={handleEscalate}
            iconName="ArrowUp"
            iconPosition="left"
            disabled={emergencyLevel === 'CRITICAL'}
          >
            Escalate Level
          </Button>
          
          <Button
            variant={isBroadcasting ? "success" : "destructive"}
            size="lg"
            onClick={handleBroadcast}
            iconName={isBroadcasting ? "Radio" : "Megaphone"}
            iconPosition="left"
            loading={isBroadcasting}
            className={isBroadcasting ? "animate-pulse" : ""}
          >
            {isBroadcasting ? "Broadcasting..." : "Emergency Broadcast"}
          </Button>

          <Button
            variant="outline"
            size="lg"
            iconName="Settings"
            iconPosition="left"
          >
            Master Controls
          </Button>
        </div>
      </div>
      {/* Status Indicators */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Communication Systems Online</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">GPS Tracking Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Backup Systems Standby</span>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground font-mono">
          System Time: {new Date()?.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default EmergencyStatusBanner;