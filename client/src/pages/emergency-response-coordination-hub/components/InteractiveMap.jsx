import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InteractiveMap = () => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [mapView, setMapView] = useState('incidents');
  const [showRoutes, setShowRoutes] = useState(true);

  const incidents = [
    {
      id: 1,
      type: 'harassment',
      severity: 'high',
      location: { lat: 40.7128, lng: -74.0060, name: 'Downtown District' },
      status: 'active',
      reportedAt: new Date(Date.now() - 300000),
      description: 'Reported harassment incident near subway entrance',
      assignedUnits: ['Unit-07', 'Unit-12']
    },
    {
      id: 2,
      type: 'suspicious',
      severity: 'medium',
      location: { lat: 40.7589, lng: -73.9851, name: 'University Campus' },
      status: 'investigating',
      reportedAt: new Date(Date.now() - 600000),
      description: 'Suspicious individual following female students',
      assignedUnits: ['Unit-03']
    },
    {
      id: 3,
      type: 'emergency',
      severity: 'critical',
      location: { lat: 40.7505, lng: -73.9934, name: 'Shopping Complex' },
      status: 'responding',
      reportedAt: new Date(Date.now() - 120000),
      description: 'Emergency SOS signal detected from mobile app',
      assignedUnits: ['Unit-01', 'Unit-05', 'Medical-02']
    }
  ];

  const resources = [
    {
      id: 'unit-01',
      type: 'patrol',
      location: { lat: 40.7480, lng: -73.9950 },
      status: 'responding',
      eta: '2 min'
    },
    {
      id: 'unit-03',
      type: 'patrol',
      location: { lat: 40.7600, lng: -73.9850 },
      status: 'investigating',
      eta: 'On scene'
    },
    {
      id: 'medical-02',
      type: 'medical',
      location: { lat: 40.7520, lng: -73.9920 },
      status: 'en-route',
      eta: '4 min'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-error border-error text-error-foreground';
      case 'high': return 'bg-warning border-warning text-warning-foreground';
      case 'medium': return 'bg-primary border-primary text-primary-foreground';
      case 'low': return 'bg-success border-success text-success-foreground';
      default: return 'bg-muted border-border text-muted-foreground';
    }
  };

  const getResourceColor = (type, status) => {
    if (status === 'responding' || status === 'en-route') return 'bg-warning';
    if (status === 'investigating' || status === 'on-scene') return 'bg-primary';
    return 'bg-success';
  };

  return (
    <div className="bg-card border border-border rounded-lg tactical-shadow-secondary h-full">
      {/* Map Controls */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Geographic Command Center</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant={mapView === 'incidents' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMapView('incidents')}
              iconName="AlertTriangle"
              iconPosition="left"
            >
              Incidents
            </Button>
            <Button
              variant={mapView === 'resources' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMapView('resources')}
              iconName="Users"
              iconPosition="left"
            >
              Resources
            </Button>
            <Button
              variant={showRoutes ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowRoutes(!showRoutes)}
              iconName="Route"
              iconPosition="left"
            >
              Routes
            </Button>
          </div>
        </div>
      </div>
      {/* Map Container */}
      <div className="relative h-96 bg-muted">
        {/* Google Maps Iframe */}
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Emergency Response Map"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=40.7128,-74.0060&z=12&output=embed"
          className="rounded-b-lg"
        />

        {/* Overlay Markers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Incident Markers */}
          {(mapView === 'incidents' || mapView === 'all') && incidents?.map((incident) => (
            <div
              key={incident?.id}
              className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer pointer-events-auto tactical-transition hover:scale-110 ${getSeverityColor(incident?.severity)}`}
              style={{
                top: `${20 + (incident?.id * 15)}%`,
                left: `${30 + (incident?.id * 20)}%`
              }}
              onClick={() => setSelectedIncident(incident)}
            >
              <Icon name="AlertTriangle" size={16} />
            </div>
          ))}

          {/* Resource Markers */}
          {(mapView === 'resources' || mapView === 'all') && resources?.map((resource) => (
            <div
              key={resource?.id}
              className={`absolute w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${getResourceColor(resource?.type, resource?.status)}`}
              style={{
                top: `${40 + (resources?.indexOf(resource) * 10)}%`,
                left: `${50 + (resources?.indexOf(resource) * 15)}%`
              }}
            >
              <Icon name={resource?.type === 'medical' ? 'Cross' : 'Shield'} size={12} color="white" />
            </div>
          ))}

          {/* Route Lines */}
          {showRoutes && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                        refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-primary)" />
                </marker>
              </defs>
              {incidents?.filter(i => i?.status === 'responding')?.map((incident, index) => (
                <line
                  key={incident?.id}
                  x1={`${50 + (index * 15)}%`}
                  y1={`${40 + (index * 10)}%`}
                  x2={`${30 + (incident?.id * 20)}%`}
                  y2={`${20 + (incident?.id * 15)}%`}
                  stroke="var(--color-primary)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  markerEnd="url(#arrowhead)"
                  className="animate-pulse"
                />
              ))}
            </svg>
          )}
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3 space-y-2">
          <div className="text-xs font-semibold text-foreground mb-2">Legend</div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error rounded-full"></div>
            <span className="text-xs text-muted-foreground">Critical</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-xs text-muted-foreground">High Priority</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-xs text-muted-foreground">Active Units</span>
          </div>
        </div>
      </div>
      {/* Selected Incident Details */}
      {selectedIncident && (
        <div className="p-4 border-t border-border bg-muted/50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-foreground">Incident Details</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIncident(null)}
              iconName="X"
            />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location:</span>
              <span className="text-foreground">{selectedIncident?.location?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Severity:</span>
              <span className={`font-medium ${selectedIncident?.severity === 'critical' ? 'text-error' : selectedIncident?.severity === 'high' ? 'text-warning' : 'text-primary'}`}>
                {selectedIncident?.severity?.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-foreground capitalize">{selectedIncident?.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Assigned Units:</span>
              <span className="text-foreground">{selectedIncident?.assignedUnits?.join(', ')}</span>
            </div>
            <p className="text-muted-foreground mt-2">{selectedIncident?.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;