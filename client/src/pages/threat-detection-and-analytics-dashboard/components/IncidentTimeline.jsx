import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const IncidentTimeline = () => {
  const [selectedMetric, setSelectedMetric] = useState('incidents');
  const [timeRange, setTimeRange] = useState('24h');

  // Mock timeline data
  const timelineData = [
    { time: '00:00', incidents: 2, gestureEvents: 5, crowdAnomalies: 1, emergencyResponses: 0, hour: 0 },
    { time: '02:00', incidents: 1, gestureEvents: 3, crowdAnomalies: 0, emergencyResponses: 1, hour: 2 },
    { time: '04:00', incidents: 0, gestureEvents: 2, crowdAnomalies: 1, emergencyResponses: 0, hour: 4 },
    { time: '06:00', incidents: 3, gestureEvents: 8, crowdAnomalies: 2, emergencyResponses: 1, hour: 6 },
    { time: '08:00', incidents: 7, gestureEvents: 15, crowdAnomalies: 4, emergencyResponses: 2, hour: 8 },
    { time: '10:00', incidents: 12, gestureEvents: 22, crowdAnomalies: 6, emergencyResponses: 3, hour: 10 },
    { time: '12:00', incidents: 18, gestureEvents: 28, crowdAnomalies: 8, emergencyResponses: 5, hour: 12 },
    { time: '14:00', incidents: 15, gestureEvents: 25, crowdAnomalies: 7, emergencyResponses: 4, hour: 14 },
    { time: '16:00', incidents: 22, gestureEvents: 35, crowdAnomalies: 10, emergencyResponses: 6, hour: 16 },
    { time: '18:00', incidents: 28, gestureEvents: 42, crowdAnomalies: 12, emergencyResponses: 8, hour: 18 },
    { time: '20:00', incidents: 25, gestureEvents: 38, crowdAnomalies: 11, emergencyResponses: 7, hour: 20 },
    { time: '22:00', incidents: 16, gestureEvents: 28, crowdAnomalies: 8, emergencyResponses: 4, hour: 22 }
  ];

  const metrics = [
    { key: 'incidents', label: 'Total Incidents', color: '#00FFFF', icon: 'AlertTriangle' },
    { key: 'gestureEvents', label: 'Gesture Events', color: '#FF6B00', icon: 'Hand' },
    { key: 'crowdAnomalies', label: 'Crowd Anomalies', color: '#FFD700', icon: 'Users' },
    { key: 'emergencyResponses', label: 'Emergency Responses', color: '#FF0000', icon: 'Siren' }
  ];

  const timeRanges = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 tactical-shadow-secondary">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {metrics?.map((metric) => (
            <div key={metric?.key} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: metric?.color }}
                ></div>
                <span className="text-xs text-muted-foreground">{metric?.label}</span>
              </div>
              <span className="text-xs font-medium text-foreground">{data?.[metric?.key]}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const getCurrentMetric = () => metrics?.find(m => m?.key === selectedMetric);

  return (
    <div className="bg-card border border-border rounded-lg tactical-shadow-secondary">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Incident Timeline Analysis</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
          >
            Export
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
          {/* Metric Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-muted-foreground">Metric:</span>
            <div className="flex space-x-1">
              {metrics?.map((metric) => (
                <button
                  key={metric?.key}
                  onClick={() => setSelectedMetric(metric?.key)}
                  className={`
                    flex items-center space-x-1 px-3 py-1 text-xs rounded tactical-transition
                    ${selectedMetric === metric?.key
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-card hover:text-foreground'
                    }
                  `}
                >
                  <Icon name={metric?.icon} size={12} />
                  <span>{metric?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-muted-foreground">Range:</span>
            <div className="flex space-x-1">
              {timeRanges?.map((range) => (
                <button
                  key={range?.value}
                  onClick={() => setTimeRange(range?.value)}
                  className={`
                    px-3 py-1 text-xs rounded tactical-transition
                    ${timeRange === range?.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-card hover:text-foreground'
                    }
                  `}
                >
                  {range?.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="time" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Peak hours reference lines */}
              <ReferenceLine x="08:00" stroke="var(--color-warning)" strokeDasharray="2 2" />
              <ReferenceLine x="18:00" stroke="var(--color-warning)" strokeDasharray="2 2" />
              
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke={getCurrentMetric()?.color}
                strokeWidth={2}
                dot={{ fill: getCurrentMetric()?.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: getCurrentMetric()?.color, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pattern Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="TrendingUp" size={16} className="text-success" />
              <span className="text-sm font-medium text-foreground">Peak Period</span>
            </div>
            <div className="text-lg font-bold text-foreground">6:00 PM - 8:00 PM</div>
            <div className="text-xs text-muted-foreground">Highest incident rate</div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="TrendingDown" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Low Activity</span>
            </div>
            <div className="text-lg font-bold text-foreground">2:00 AM - 6:00 AM</div>
            <div className="text-xs text-muted-foreground">Minimal threat detection</div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Clock" size={16} className="text-warning" />
              <span className="text-sm font-medium text-foreground">Avg Response</span>
            </div>
            <div className="text-lg font-bold text-foreground">2.3 minutes</div>
            <div className="text-xs text-muted-foreground">Emergency response time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentTimeline;