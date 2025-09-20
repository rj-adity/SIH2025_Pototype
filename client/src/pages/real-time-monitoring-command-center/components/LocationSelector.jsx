import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LocationSelector = ({ selectedLocation, onLocationChange, onGlobalAlert }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const [globalStatus, setGlobalStatus] = useState('normal');

  useEffect(() => {
    // Mock location data with real-time status
    const mockLocations = [
      {
        id: 'downtown',
        name: 'Downtown District',
        status: 'normal',
        activeAlerts: 2,
        totalCameras: 8,
        activeCameras: 7,
        population: 145,
        lastUpdate: new Date()
      },
      {
        id: 'university',
        name: 'University Campus',
        status: 'warning',
        activeAlerts: 5,
        totalCameras: 12,
        activeCameras: 11,
        population: 289,
        lastUpdate: new Date()
      },
      {
        id: 'shopping',
        name: 'Shopping Complex',
        status: 'normal',
        activeAlerts: 1,
        totalCameras: 15,
        activeCameras: 15,
        population: 432,
        lastUpdate: new Date()
      },
      {
        id: 'transit',
        name: 'Transit Hub',
        status: 'critical',
        activeAlerts: 3,
        totalCameras: 6,
        activeCameras: 5,
        population: 178,
        lastUpdate: new Date()
      },
      {
        id: 'residential',
        name: 'Residential Area',
        status: 'normal',
        activeAlerts: 0,
        totalCameras: 10,
        activeCameras: 10,
        population: 67,
        lastUpdate: new Date()
      },
      {
        id: 'business',
        name: 'Business District',
        status: 'warning',
        activeAlerts: 2,
        totalCameras: 14,
        activeCameras: 13,
        population: 234,
        lastUpdate: new Date()
      }
    ];

    setLocations(mockLocations);

    // Determine global status
    const criticalCount = mockLocations?.filter(l => l?.status === 'critical')?.length;
    const warningCount = mockLocations?.filter(l => l?.status === 'warning')?.length;
    
    if (criticalCount > 0) {
      setGlobalStatus('critical');
    } else if (warningCount > 2) {
      setGlobalStatus('warning');
    } else {
      setGlobalStatus('normal');
    }

    // Update location data periodically
    const interval = setInterval(() => {
      setLocations(prev => prev?.map(location => ({
        ...location,
        activeAlerts: Math.max(0, location?.activeAlerts + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0)),
        population: Math.max(0, location?.population + Math.floor((Math.random() - 0.5) * 10)),
        lastUpdate: new Date()
      })));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'text-error border-error bg-error/10';
      case 'warning': return 'text-warning border-warning bg-warning/10';
      case 'normal': return 'text-success border-success bg-success/10';
      default: return 'text-muted-foreground border-muted bg-muted/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'critical': return 'AlertTriangle';
      case 'warning': return 'AlertCircle';
      case 'normal': return 'CheckCircle';
      default: return 'Circle';
    }
  };

  const getGlobalStatusColor = () => {
    switch (globalStatus) {
      case 'critical': return 'bg-error text-error-foreground';
      case 'warning': return 'bg-warning text-warning-foreground';
      case 'normal': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleLocationSelect = (location) => {
    onLocationChange(location);
    setIsDropdownOpen(false);
  };

  const currentLocation = locations?.find(l => l?.name === selectedLocation) || locations?.[0];
  const totalAlerts = locations?.reduce((sum, loc) => sum + loc?.activeAlerts, 0);
  const totalPopulation = locations?.reduce((sum, loc) => sum + loc?.population, 0);

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="MapPin" size={20} className="text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">Location Control</h2>
            <p className="text-sm text-muted-foreground">
              {locations?.length} locations monitored
            </p>
          </div>
        </div>
        
        {/* Global Status Indicator */}
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${getGlobalStatusColor()}`}>
          <Icon name={getStatusIcon(globalStatus)} size={16} />
          <span className="text-sm font-medium">
            Global: {globalStatus?.charAt(0)?.toUpperCase() + globalStatus?.slice(1)}
          </span>
        </div>
      </div>
      <div className="p-4">
        {/* Current Location Selector */}
        <div className="relative mb-4">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between p-3 bg-muted border border-border rounded-lg tactical-transition hover:bg-card"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(currentLocation?.status)?.split(' ')?.[0]}`} />
              <div className="text-left">
                <div className="font-medium text-foreground">{currentLocation?.name}</div>
                <div className="text-xs text-muted-foreground">
                  {currentLocation?.activeAlerts} alerts • {currentLocation?.population} people
                </div>
              </div>
            </div>
            <Icon name={isDropdownOpen ? "ChevronUp" : "ChevronDown"} size={16} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-popover border border-border rounded-lg tactical-shadow-secondary z-50 max-h-80 overflow-y-auto">
              {locations?.map((location) => (
                <button
                  key={location?.id}
                  onClick={() => handleLocationSelect(location)}
                  className={`
                    w-full flex items-center justify-between p-3 tactical-transition
                    ${selectedLocation === location?.name 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-popover-foreground hover:bg-muted'
                    }
                    first:rounded-t-lg last:rounded-b-lg
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(location?.status)?.split(' ')?.[0]}`} />
                    <div className="text-left">
                      <div className="font-medium">{location?.name}</div>
                      <div className="text-xs opacity-80">
                        {location?.activeCameras}/{location?.totalCameras} cameras • {location?.population} people
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-medium ${location?.activeAlerts > 0 ? 'text-error' : 'text-success'}`}>
                      {location?.activeAlerts} alerts
                    </div>
                    <div className="text-xs opacity-60">
                      {location?.lastUpdate?.toLocaleTimeString()}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Users" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Total Population</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{totalPopulation?.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Across all locations</div>
          </div>
          
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Bell" size={16} className="text-warning" />
              <span className="text-sm font-medium text-foreground">Active Alerts</span>
            </div>
            <div className="text-2xl font-bold text-warning">{totalAlerts}</div>
            <div className="text-xs text-muted-foreground">Requiring attention</div>
          </div>
        </div>

        {/* Current Location Details */}
        {currentLocation && (
          <div className={`border rounded-lg p-4 ${getStatusColor(currentLocation?.status)}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-foreground">Current Location Status</h3>
              <Icon name={getStatusIcon(currentLocation?.status)} size={16} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Camera Status</div>
                <div className="font-medium text-foreground">
                  {currentLocation?.activeCameras}/{currentLocation?.totalCameras} Online
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Population</div>
                <div className="font-medium text-foreground">{currentLocation?.population} People</div>
              </div>
              <div>
                <div className="text-muted-foreground">Active Alerts</div>
                <div className={`font-medium ${currentLocation?.activeAlerts > 0 ? 'text-error' : 'text-success'}`}>
                  {currentLocation?.activeAlerts} Alerts
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Last Update</div>
                <div className="font-medium text-foreground font-mono text-xs">
                  {currentLocation?.lastUpdate?.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Actions */}
        <div className="mt-4 space-y-2">
          <Button
            variant="destructive"
            size="sm"
            fullWidth
            iconName="AlertTriangle"
            onClick={() => onGlobalAlert('emergency')}
          >
            Trigger Global Emergency Alert
          </Button>
          <Button
            variant="warning"
            size="sm"
            fullWidth
            iconName="Radio"
            onClick={() => onGlobalAlert('broadcast')}
          >
            Broadcast Safety Message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;