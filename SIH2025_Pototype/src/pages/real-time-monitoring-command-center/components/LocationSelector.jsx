import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LocationSelector = ({ selectedLocation, onLocationChange, onGlobalAlert }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const [globalStatus, setGlobalStatus] = useState('normal');
  const [activeAlerts, setActiveAlerts] = useState(0);
  const SERVER_URL = window.SERVER_URL;

  const [stats, setStats] = useState(null);

  const fetchStats = async () => {

  try {

    const res = await fetch(`${SERVER_URL}/dashboard_stats`, {
      headers: {
        "ngrok-skip-browser-warning": "true"
      }
    });

    const data = await res.json();

    setStats(data);
    setActiveAlerts(data.alerts);

    // determine global status
    if (data.alerts > 3) {
      setGlobalStatus("critical");
    } else if (data.alerts > 0) {
      setGlobalStatus("warning");
    } else {
      setGlobalStatus("normal");
    }

    // create camera locations
    const cameraLocations = [
      { id: "main_entrance", name: "Main Entrance" },
      { id: "parking", name: "Parking Area" },
      { id: "corridor", name: "Corridor" },
      { id: "library", name: "Library" },
      { id: "food_court", name: "Food Court" },
      { id: "platform", name: "Platform" }
    ];

    const locs = cameraLocations.map(cam => ({
      id: cam.id,
      name: cam.name,
      population: data.population,
      activeAlerts: data.alerts,
      totalCameras: data.cameras_active,
      activeCameras: data.cameras_active,
      status: data.alerts > 0 ? "warning" : "normal",
      lastUpdate: new Date()
    }));

    setLocations(locs);

  } catch (err) {

    console.log("Stats fetch error:", err);

  }

};

  const fetchLocations = async () => {

  try {

    const res = await fetch(`${SERVER_URL}/dashboard_stats`);
    const stats = await res.json();

    const locations = [
      {
        id: "main_entrance",
        name: "Main Entrance",
        population: stats.population,
        activeAlerts: stats.alerts,
        totalCameras: stats.cameras_active,
        activeCameras: stats.cameras_active,
        status: stats.alerts > 0 ? "warning" : "normal",
        lastUpdate: new Date()
      }
    ];

    setLocations(locations);

  } catch (err) {

    console.log("Location fetch error");

  }

};



  useEffect(() => {

  fetchStats();

  const interval = setInterval(fetchStats, 5000);

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

  const TOTAL_CAMERAS = 6;
  const currentLocation = locations?.find(l => l?.name === selectedLocation) || locations?.[0];
  const totalAlerts = locations?.reduce((sum, loc) => sum + loc?.activeAlerts, 0);
  const totalPopulation = stats?.population || 0;

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
                  {activeAlerts} alerts • {stats?.population || 0} People
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
            <div className="text-2xl font-bold text-warning">{activeAlerts}</div>
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
                  {stats?.cameras_active || 0}/{TOTAL_CAMERAS} Online
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Population</div>
                <div className="font-medium text-foreground">{stats?.population || 0} People</div>
              </div>
              <div>
                <div className="text-muted-foreground">Active Alerts</div>
                <div className={`font-medium ${activeAlerts > 0 ? 'text-error' : 'text-success'}`}>
                  {activeAlerts} Alerts
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Last Update</div>
                <div className="font-medium text-foreground font-mono text-xs">
                  {stats ? new Date(stats.timestamp * 1000).toLocaleTimeString() : "--"}
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