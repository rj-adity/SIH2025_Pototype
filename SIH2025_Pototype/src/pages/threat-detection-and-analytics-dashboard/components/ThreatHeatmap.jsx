import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const ThreatHeatmap = () => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('current');
  const [viewMode, setViewMode] = useState('density');

  // Mock heatmap data
  const heatmapData = [
    { location: 'Downtown District', x: 2, y: 1, intensity: 85, incidents: 12, type: 'high' },
    { location: 'University Campus', x: 4, y: 2, intensity: 45, incidents: 6, type: 'medium' },
    { location: 'Shopping Complex', x: 1, y: 3, intensity: 92, incidents: 18, type: 'critical' },
    { location: 'Transit Hub', x: 5, y: 1, intensity: 67, incidents: 9, type: 'high' },
    { location: 'Residential Area', x: 3, y: 4, intensity: 23, incidents: 3, type: 'low' },
    { location: 'Business District', x: 6, y: 3, intensity: 56, incidents: 8, type: 'medium' },
    { location: 'Park Area', x: 1, y: 5, intensity: 34, incidents: 4, type: 'low' },
    { location: 'Entertainment Zone', x: 4, y: 5, intensity: 78, incidents: 14, type: 'high' }
  ];

  const getIntensityColor = (intensity) => {
    if (intensity >= 80) return 'bg-error';
    if (intensity >= 60) return 'bg-warning';
    if (intensity >= 40) return 'bg-accent';
    return 'bg-success';
  };

  const getIntensityOpacity = (intensity) => {
    return Math.max(0.3, intensity / 100);
  };

  const timeSlots = [
    { value: 'current', label: 'Current Hour' },
    { value: 'last-hour', label: 'Last Hour' },
    { value: 'peak-hours', label: 'Peak Hours' },
    { value: 'off-peak', label: 'Off Peak' }
  ];

  const viewModes = [
    { value: 'density', label: 'Threat Density', icon: 'Zap' },
    { value: 'incidents', label: 'Incident Count', icon: 'AlertTriangle' },
    { value: 'response', label: 'Response Time', icon: 'Clock' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg tactical-shadow-secondary">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Map" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Threat Density Heatmap</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
          >
            Refresh
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Maximize2"
          >
            Fullscreen
          </Button>
        </div>
      </div>
      <div className="p-4">
        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          {/* Time Slot Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-muted-foreground">Time:</span>
            <div className="flex space-x-1">
              {timeSlots?.map((slot) => (
                <button
                  key={slot?.value}
                  onClick={() => setSelectedTimeSlot(slot?.value)}
                  className={`
                    px-3 py-1 text-xs rounded tactical-transition
                    ${selectedTimeSlot === slot?.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-card hover:text-foreground'
                    }
                  `}
                >
                  {slot?.label}
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-muted-foreground">View:</span>
            <div className="flex space-x-1">
              {viewModes?.map((mode) => (
                <button
                  key={mode?.value}
                  onClick={() => setViewMode(mode?.value)}
                  className={`
                    flex items-center space-x-1 px-3 py-1 text-xs rounded tactical-transition
                    ${viewMode === mode?.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-card hover:text-foreground'
                    }
                  `}
                >
                  <Icon name={mode?.icon} size={12} />
                  <span>{mode?.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="relative bg-muted rounded-lg p-6 min-h-[400px]">
          <div className="grid grid-cols-6 grid-rows-5 gap-2 h-full">
            {Array.from({ length: 30 }, (_, index) => {
              const x = (index % 6) + 1;
              const y = Math.floor(index / 6) + 1;
              const dataPoint = heatmapData?.find(d => d?.x === x && d?.y === y);
              
              return (
                <div
                  key={index}
                  className={`
                    relative rounded border border-border/50 tactical-transition cursor-pointer
                    hover:border-primary hover:scale-105
                    ${dataPoint ? getIntensityColor(dataPoint?.intensity) : 'bg-background'}
                  `}
                  style={{
                    opacity: dataPoint ? getIntensityOpacity(dataPoint?.intensity) : 0.1
                  }}
                  title={dataPoint ? `${dataPoint?.location}: ${dataPoint?.incidents} incidents` : 'No data'}
                >
                  {dataPoint && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xs font-bold text-white">
                          {viewMode === 'density' ? dataPoint?.intensity : dataPoint?.incidents}
                        </div>
                        <div className="text-[10px] text-white/80">
                          {dataPoint?.location?.split(' ')?.[0]}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3">
            <div className="text-xs font-medium text-foreground mb-2">Threat Level</div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded"></div>
                <span className="text-xs text-muted-foreground">Low (0-39)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-accent rounded"></div>
                <span className="text-xs text-muted-foreground">Medium (40-59)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning rounded"></div>
                <span className="text-xs text-muted-foreground">High (60-79)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-error rounded"></div>
                <span className="text-xs text-muted-foreground">Critical (80+)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-error">3</div>
            <div className="text-xs text-muted-foreground">Critical Zones</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">5</div>
            <div className="text-xs text-muted-foreground">High Risk Areas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">74</div>
            <div className="text-xs text-muted-foreground">Total Incidents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">2.3m</div>
            <div className="text-xs text-muted-foreground">Avg Response</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatHeatmap;