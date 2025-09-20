import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertFeed = ({ onAlertAction }) => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  useEffect(() => {
    // Mock alert data
    const mockAlerts = [
      {
        id: 'alert-001',
        type: 'gesture_detection',
        severity: 'critical',
        title: 'SOS Gesture Detected',
        description: 'Distress signal identified in Main Entrance area',
        location: 'Downtown District - Main Entrance',
        cameraId: 'cam-001',
        timestamp: new Date(Date.now() - 120000),
        status: 'active',
        assignedTo: null,
        actions: ['dispatch_security', 'call_emergency', 'alert_supervisor']
      },
      {
        id: 'alert-002',
        type: 'crowd_density',
        severity: 'warning',
        title: 'High Crowd Density',
        description: 'Unusual gathering detected in Study Hall',
        location: 'University Campus - Study Hall',
        cameraId: 'cam-004',
        timestamp: new Date(Date.now() - 300000),
        status: 'investigating',
        assignedTo: 'Security Team Alpha',
        actions: ['monitor_closely', 'increase_patrol']
      },
      {
        id: 'alert-003',
        type: 'behavioral_anomaly',
        severity: 'medium',
        title: 'Suspicious Behavior',
        description: 'Individual loitering for extended period',
        location: 'Shopping Complex - Food Court',
        cameraId: 'cam-005',
        timestamp: new Date(Date.now() - 480000),
        status: 'resolved',
        assignedTo: 'Officer Johnson',
        actions: ['approach_individual', 'document_incident']
      },
      {
        id: 'alert-004',
        type: 'system_alert',
        severity: 'low',
        title: 'Camera Connection Lost',
        description: 'Platform 1 camera offline for 5 minutes',
        location: 'Transit Hub - Platform 1',
        cameraId: 'cam-006',
        timestamp: new Date(Date.now() - 600000),
        status: 'acknowledged',
        assignedTo: 'IT Support',
        actions: ['check_connection', 'restart_camera']
      },
      {
        id: 'alert-005',
        type: 'safety_violation',
        severity: 'medium',
        title: 'Restricted Area Access',
        description: 'Unauthorized entry attempt detected',
        location: 'Downtown District - Parking Area',
        cameraId: 'cam-002',
        timestamp: new Date(Date.now() - 720000),
        status: 'active',
        assignedTo: null,
        actions: ['verify_credentials', 'escort_out']
      }
    ];

    setAlerts(mockAlerts);

    // Simulate new alerts
    const interval = setInterval(() => {
      const newAlert = {
        id: `alert-${Date.now()}`,
        type: ['gesture_detection', 'crowd_density', 'behavioral_anomaly']?.[Math.floor(Math.random() * 3)],
        severity: ['low', 'medium', 'warning', 'critical']?.[Math.floor(Math.random() * 4)],
        title: 'New Alert Detected',
        description: 'Real-time monitoring system detected an anomaly',
        location: 'Various Locations',
        cameraId: `cam-00${Math.floor(Math.random() * 6) + 1}`,
        timestamp: new Date(),
        status: 'active',
        assignedTo: null,
        actions: ['investigate', 'monitor']
      };

      if (Math.random() > 0.7) {
        setAlerts(prev => [newAlert, ...prev?.slice(0, 19)]);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'border-error bg-error/5 text-error';
      case 'warning': return 'border-warning bg-warning/5 text-warning';
      case 'medium': return 'border-accent bg-accent/5 text-accent';
      case 'low': return 'border-muted bg-muted/5 text-muted-foreground';
      default: return 'border-muted bg-muted/5 text-muted-foreground';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return 'AlertTriangle';
      case 'warning': return 'AlertCircle';
      case 'medium': return 'Info';
      case 'low': return 'Bell';
      default: return 'Bell';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-error';
      case 'investigating': return 'text-warning';
      case 'acknowledged': return 'text-accent';
      case 'resolved': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'gesture_detection': return 'Hand';
      case 'crowd_density': return 'Users';
      case 'behavioral_anomaly': return 'Eye';
      case 'system_alert': return 'Settings';
      case 'safety_violation': return 'Shield';
      default: return 'Bell';
    }
  };

  const filteredAlerts = alerts?.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'active') return alert?.status === 'active';
    if (filter === 'critical') return alert?.severity === 'critical';
    return alert?.severity === filter;
  });

  const handleAlertAction = (alert, action) => {
    onAlertAction(alert, action);
    
    // Update alert status
    setAlerts(prev => prev?.map(a => 
      a?.id === alert?.id 
        ? { ...a, status: action === 'resolve' ? 'resolved' : 'investigating' }
        : a
    ));
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Bell" size={20} className="text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">Real-Time Alerts</h2>
            <p className="text-sm text-muted-foreground">
              {filteredAlerts?.filter(a => a?.status === 'active')?.length} active alerts
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={isAutoScroll ? "default" : "outline"}
            size="sm"
            iconName="RotateCcw"
            onClick={() => setIsAutoScroll(!isAutoScroll)}
          >
            Auto
          </Button>
        </div>
      </div>
      {/* Filter Tabs */}
      <div className="flex items-center space-x-1 p-4 border-b border-border">
        {['all', 'active', 'critical', 'warning', 'medium']?.map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`
              px-3 py-1 text-xs font-medium rounded tactical-transition
              ${filter === filterOption 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }
            `}
          >
            {filterOption?.charAt(0)?.toUpperCase() + filterOption?.slice(1)}
            {filterOption === 'active' && (
              <span className="ml-1 bg-error text-error-foreground rounded-full px-1 text-xs">
                {alerts?.filter(a => a?.status === 'active')?.length}
              </span>
            )}
          </button>
        ))}
      </div>
      {/* Alert List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-4">
          {filteredAlerts?.map((alert) => (
            <div
              key={alert?.id}
              className={`
                border rounded-lg p-4 tactical-transition hover:tactical-shadow-primary
                ${getSeverityColor(alert?.severity)}
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getSeverityColor(alert?.severity)}`}>
                    <Icon name={getTypeIcon(alert?.type)} size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-foreground">{alert?.title}</h3>
                      <div className={`flex items-center space-x-1 ${getSeverityColor(alert?.severity)}`}>
                        <Icon name={getSeverityIcon(alert?.severity)} size={12} />
                        <span className="text-xs font-medium uppercase">{alert?.severity}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{alert?.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Icon name="MapPin" size={12} />
                        <span>{alert?.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={12} />
                        <span>{alert?.timestamp?.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`text-xs font-medium ${getStatusColor(alert?.status)}`}>
                  {alert?.status?.toUpperCase()}
                </div>
              </div>

              {/* Assignment Info */}
              {alert?.assignedTo && (
                <div className="flex items-center space-x-2 mb-3 text-xs text-muted-foreground">
                  <Icon name="User" size={12} />
                  <span>Assigned to: {alert?.assignedTo}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {alert?.status === 'active' && (
                  <>
                    <Button
                      variant="destructive"
                      size="xs"
                      iconName="AlertTriangle"
                      onClick={() => handleAlertAction(alert, 'escalate')}
                    >
                      Escalate
                    </Button>
                    <Button
                      variant="warning"
                      size="xs"
                      iconName="Eye"
                      onClick={() => handleAlertAction(alert, 'investigate')}
                    >
                      Investigate
                    </Button>
                    <Button
                      variant="success"
                      size="xs"
                      iconName="Check"
                      onClick={() => handleAlertAction(alert, 'resolve')}
                    >
                      Resolve
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  size="xs"
                  iconName="ExternalLink"
                  onClick={() => handleAlertAction(alert, 'view_details')}
                >
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlertFeed;