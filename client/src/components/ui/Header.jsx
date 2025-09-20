import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [selectedLocation, setSelectedLocation] = useState('Downtown District');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isSIHMode, setIsSIHMode] = useState(false);

  // Check if we're on SIH2025 showcase page
  useEffect(() => {
    setIsSIHMode(location?.pathname === '/' || location?.pathname === '/sih2025-showcase');
  }, [location?.pathname]);

  const navigationItems = [
    {
      label: 'SIH2025 Demo',
      path: '/sih2025-showcase',
      icon: 'Award',
      operationalContext: 'Smart India Hackathon 2025 showcase and presentation',
      sihFeature: true
    },
    {
      label: 'Live Monitor',
      path: '/real-time-monitoring-command-center',
      icon: 'Monitor',
      operationalContext: 'Primary operational dashboard with continuous data streams'
    },
    {
      label: 'Threat Analysis',
      path: '/threat-detection-and-analytics-dashboard',
      icon: 'Shield',
      operationalContext: 'Deep investigative capabilities and pattern recognition'
    },
    {
      label: 'Emergency Response',
      path: '/emergency-response-coordination-hub',
      icon: 'AlertTriangle',
      operationalContext: 'Crisis management tools and resource allocation',
      emergencyAccess: true
    },
    {
      label: 'Safety Reports',
      path: '/safety-analytics-and-reporting-center',
      icon: 'FileText',
      operationalContext: 'Compliance documentation and trend analysis'
    }
  ];

  const locations = [
    'Downtown District',
    'University Campus',
    'Shopping Complex',
    'Transit Hub',
    'Residential Area',
    'Business District'
  ];

  // Simulate connection status monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses = ['connected', 'warning', 'error'];
      const randomStatus = statuses?.[Math.floor(Math.random() * statuses?.length)];
      setConnectionStatus(randomStatus);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

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

  const handleEmergencyToggle = () => {
    setIsEmergencyOpen(!isEmergencyOpen);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setIsLocationDropdownOpen(false);
  };

  return (
    <>
      {/* Main Header */}
      <header className="fixed top-0 left-0 right-0 z-[1000] bg-background border-b border-border h-[60px]">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <Link to="/sih2025-showcase" className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isSIHMode ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-primary'
              }`}>
                <Icon name={isSIHMode ? 'Award' : 'Shield'} size={20} color="white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-foreground">
                  {isSIHMode ? 'SIH2025' : 'Women Safety'}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {isSIHMode ? 'Smart Analytics' : 'Analytics'}
                </span>
              </div>
            </Link>
            
            {/* SIH Badge */}
            {isSIHMode && (
              <div className="hidden lg:flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-xs font-medium text-primary">PRESENTATION MODE</span>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems?.map((item) => {
              const isActive = location?.pathname === item?.path;
              return (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg tactical-transition
                    ${isActive 
                      ? `${item?.sihFeature ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-primary'} text-primary-foreground tactical-glow` 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                    ${item?.sihFeature ? 'border border-primary/30' : ''}
                  `}
                  title={item?.operationalContext}
                >
                  <Icon name={item?.icon} size={16} />
                  <span className="text-sm font-medium">{item?.label}</span>
                  {item?.sihFeature && !isActive && (
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Location Selector */}
          {!isSIHMode && (
            <div className="hidden lg:block relative">
              <button
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 bg-muted rounded-lg text-sm tactical-transition hover:bg-card"
              >
                <Icon name="MapPin" size={14} />
                <span className="text-muted-foreground">{selectedLocation}</span>
                <Icon name="ChevronDown" size={14} />
              </button>
              
              {isLocationDropdownOpen && (
                <div className="absolute top-full mt-2 right-0 w-48 bg-popover border border-border rounded-lg tactical-shadow-secondary z-[1200]">
                  {locations?.map((location) => (
                    <button
                      key={location}
                      onClick={() => handleLocationSelect(location)}
                      className={`
                        w-full text-left px-3 py-2 text-sm tactical-transition
                        ${selectedLocation === location 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-popover-foreground hover:bg-muted'
                        }
                        first:rounded-t-lg last:rounded-b-lg
                      `}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* SIH Info Display */}
            {isSIHMode && (
              <div className="hidden lg:flex items-center space-x-3 text-sm">
                <div className="text-primary font-medium">Team ID: SIH2025_WS_001</div>
                <div className="w-1 h-4 bg-border"></div>
                <div className="text-muted-foreground">Women Safety Analytics</div>
              </div>
            )}

            {/* Connection Status */}
            {!isSIHMode && (
              <div 
                className="flex items-center space-x-2 cursor-pointer"
                title={`Connection: ${connectionStatus} | Last update: ${new Date()?.toLocaleTimeString()}`}
              >
                <Icon 
                  name={getConnectionStatusIcon()} 
                  size={16} 
                  className={`${getConnectionStatusColor()} ${connectionStatus === 'connected' ? 'animate-pulse-slow' : ''}`}
                />
                <span className={`text-xs font-mono ${getConnectionStatusColor()}`}>
                  {connectionStatus?.toUpperCase()}
                </span>
              </div>
            )}

            {/* Emergency Button */}
            <Button
              variant={isEmergencyOpen ? "destructive" : "outline"}
              size="sm"
              onClick={handleEmergencyToggle}
              iconName="AlertTriangle"
              iconPosition="left"
              className={`
                ${isEmergencyOpen ? 'animate-glow' : ''}
                border-error text-error hover:bg-error hover:text-error-foreground
              `}
            >
              {isSIHMode ? 'Demo Alert' : 'Emergency'}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-[1000]">
          <div className="flex items-center justify-around py-2">
            {navigationItems?.map((item) => {
              const isActive = location?.pathname === item?.path;
              return (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`
                    flex flex-col items-center space-y-1 px-3 py-2 rounded-lg tactical-transition
                    ${isActive 
                      ? 'text-primary' :'text-muted-foreground'
                    }
                  `}
                >
                  <Icon name={item?.icon} size={20} />
                  <span className="text-xs font-medium">
                    {item?.sihFeature ? 'SIH2025' : item?.label?.split(' ')?.[0]}
                  </span>
                  {item?.sihFeature && !isActive && (
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </header>
      
      {/* Emergency Alert Overlay */}
      {isEmergencyOpen && (
        <div className="fixed inset-0 z-[2000] bg-background/80 backdrop-blur-sm">
          <div className="fixed top-[68px] left-1/2 transform -translate-x-1/2 w-full max-w-4xl mx-auto p-6">
            <div className="bg-card border-2 border-error rounded-lg tactical-shadow-primary">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-error rounded-full flex items-center justify-center animate-pulse">
                    <Icon name="AlertTriangle" size={20} color="white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {isSIHMode ? 'SIH2025 Demo Alert System' : 'Emergency Response Center'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {isSIHMode 
                        ? 'Demonstration of emergency response capabilities for hackathon presentation'
                        : 'Crisis management and resource coordination'
                      }
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEmergencyToggle}
                  iconName="X"
                />
              </div>
              
              <div className="p-6">
                {isSIHMode && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Award" size={16} className="text-primary" />
                      <span className="text-sm font-medium text-primary">SIH2025 DEMO MODE</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This is a demonstration of our emergency response system capabilities for the Smart India Hackathon 2025 presentation.
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-medium text-foreground">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button variant="destructive" size="sm" fullWidth iconName="Phone">
                        {isSIHMode ? 'Demo: Call Emergency' : 'Call Emergency Services'}
                      </Button>
                      <Button variant="warning" size="sm" fullWidth iconName="Users">
                        {isSIHMode ? 'Demo: Alert Security' : 'Alert Security Team'}
                      </Button>
                      <Button variant="outline" size="sm" fullWidth iconName="Radio">
                        {isSIHMode ? 'Demo: Broadcast' : 'Broadcast Alert'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-foreground">Resource Status</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Security Personnel</span>
                        <span className="text-success">12 Available</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Emergency Vehicles</span>
                        <span className="text-warning">3 Deployed</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Medical Units</span>
                        <span className="text-success">2 Standby</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-foreground">Active Incidents</h3>
                    <div className="space-y-2 text-sm">
                      <div className="p-2 bg-muted rounded border-l-2 border-warning">
                        <div className="font-medium">
                          {isSIHMode ? 'Demo: Suspicious Activity' : 'Suspicious Activity'}
                        </div>
                        <div className="text-muted-foreground">Downtown District - 2 min ago</div>
                      </div>
                      <div className="p-2 bg-muted rounded border-l-2 border-success">
                        <div className="font-medium">All Clear</div>
                        <div className="text-muted-foreground">University Campus - 5 min ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;