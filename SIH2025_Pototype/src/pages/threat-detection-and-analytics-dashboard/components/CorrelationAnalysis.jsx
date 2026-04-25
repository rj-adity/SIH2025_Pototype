import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const CorrelationAnalysis = () => {
  const [selectedCorrelation, setSelectedCorrelation] = useState('weather-incidents');

  // Mock correlation data
  const correlationData = {
    'weather-incidents': [
      { x: 72, y: 8, name: 'Sunny', size: 120, color: '#00FF88' },
      { x: 65, y: 12, name: 'Cloudy', size: 180, color: '#FFD700' },
      { x: 58, y: 18, name: 'Rainy', size: 240, color: '#FF6B00' },
      { x: 45, y: 25, name: 'Stormy', size: 300, color: '#FF0000' }
    ],
    'crowd-density': [
      { x: 50, y: 5, name: 'Low Density', size: 100, color: '#00FF88' },
      { x: 150, y: 12, name: 'Medium Density', size: 200, color: '#FFD700' },
      { x: 300, y: 22, name: 'High Density', size: 300, color: '#FF6B00' },
      { x: 500, y: 35, name: 'Very High Density', size: 400, color: '#FF0000' }
    ],
    'time-threats': [
      { x: 6, y: 3, name: 'Morning', size: 150, color: '#00FF88' },
      { x: 12, y: 18, name: 'Noon', size: 280, color: '#FFD700' },
      { x: 18, y: 28, name: 'Evening', size: 350, color: '#FF6B00' },
      { x: 22, y: 16, name: 'Night', size: 200, color: '#00FFFF' }
    ]
  };

  const correlationTypes = [
    {
      key: 'weather-incidents',
      label: 'Weather vs Incidents',
      xLabel: 'Temperature (°F)',
      yLabel: 'Incident Count',
      icon: 'Cloud'
    },
    {
      key: 'crowd-density',
      label: 'Crowd Density vs Threats',
      xLabel: 'People Count',
      yLabel: 'Threat Level',
      icon: 'Users'
    },
    {
      key: 'time-threats',
      label: 'Time vs Threat Severity',
      xLabel: 'Hour of Day',
      yLabel: 'Threat Score',
      icon: 'Clock'
    }
  ];

  const insights = {
    'weather-incidents': [
      { title: 'Weather Impact', value: 'Strong Correlation', trend: 'up', description: 'Incidents increase by 15% during adverse weather' },
      { title: 'Temperature Factor', value: '68°F Threshold', trend: 'neutral', description: 'Below 68°F shows higher incident rates' },
      { title: 'Seasonal Pattern', value: 'Winter Peak', trend: 'up', description: 'December-February show 23% more incidents' }
    ],
    'crowd-density': [
      { title: 'Density Threshold', value: '200+ People', trend: 'up', description: 'Threat level increases exponentially above 200 people' },
      { title: 'Space Utilization', value: '75% Capacity', trend: 'neutral', description: 'Optimal safety at 75% space capacity' },
      { title: 'Crowd Behavior', value: 'Predictive Model', trend: 'up', description: '89% accuracy in predicting crowd-related incidents' }
    ],
    'time-threats': [
      { title: 'Peak Hours', value: '6-8 PM', trend: 'up', description: 'Evening hours show highest threat concentration' },
      { title: 'Safe Window', value: '2-6 AM', trend: 'down', description: 'Lowest threat activity during early morning' },
      { title: 'Response Time', value: '40% Faster', trend: 'up', description: 'Faster response during predicted peak hours' }
    ]
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      const currentType = correlationTypes?.find(t => t?.key === selectedCorrelation);
      return (
        <div className="bg-popover border border-border rounded-lg p-3 tactical-shadow-secondary">
          <p className="text-sm font-medium text-foreground mb-1">{data?.name}</p>
          <p className="text-xs text-muted-foreground">
            {currentType?.xLabel}: {data?.x}
          </p>
          <p className="text-xs text-muted-foreground">
            {currentType?.yLabel}: {data?.y}
          </p>
        </div>
      );
    }
    return null;
  };

  const getCurrentType = () => correlationTypes?.find(t => t?.key === selectedCorrelation);
  const getCurrentInsights = () => insights?.[selectedCorrelation] || [];

  return (
    <div className="bg-card border border-border rounded-lg tactical-shadow-secondary">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="GitBranch" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Correlation Analysis</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="BarChart3"
          >
            Advanced
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Download"
          >
            Export
          </Button>
        </div>
      </div>
      <div className="p-4">
        {/* Correlation Type Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {correlationTypes?.map((type) => (
            <button
              key={type?.key}
              onClick={() => setSelectedCorrelation(type?.key)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg tactical-transition
                ${selectedCorrelation === type?.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-card hover:text-foreground'
                }
              `}
            >
              <Icon name={type?.icon} size={16} />
              <span className="text-sm font-medium">{type?.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scatter Plot */}
          <div className="lg:col-span-2">
            <div className="bg-muted rounded-lg p-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      name={getCurrentType()?.xLabel}
                      stroke="var(--color-muted-foreground)"
                      fontSize={12}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      name={getCurrentType()?.yLabel}
                      stroke="var(--color-muted-foreground)"
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Scatter 
                      data={correlationData?.[selectedCorrelation]} 
                      fill="var(--color-primary)"
                    >
                      {correlationData?.[selectedCorrelation]?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry?.color} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              
              {/* Chart Legend */}
              <div className="flex flex-wrap gap-4 mt-4">
                {correlationData?.[selectedCorrelation]?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item?.color }}
                    ></div>
                    <span className="text-xs text-muted-foreground">{item?.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insights Panel */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Key Insights</h3>
            {getCurrentInsights()?.map((insight, index) => (
              <div key={index} className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{insight?.title}</span>
                  <Icon 
                    name={insight?.trend === 'up' ? 'TrendingUp' : insight?.trend === 'down' ? 'TrendingDown' : 'Minus'} 
                    size={14} 
                    className={
                      insight?.trend === 'up' ? 'text-success' : 
                      insight?.trend === 'down'? 'text-error' : 'text-muted-foreground'
                    }
                  />
                </div>
                <div className="text-lg font-bold text-primary mb-1">{insight?.value}</div>
                <div className="text-xs text-muted-foreground">{insight?.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistical Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <div className="text-xl font-bold text-primary">0.87</div>
            <div className="text-xs text-muted-foreground">Correlation Coefficient</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-success">94.2%</div>
            <div className="text-xs text-muted-foreground">Prediction Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-warning">156</div>
            <div className="text-xs text-muted-foreground">Data Points</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-error">0.03</div>
            <div className="text-xs text-muted-foreground">P-Value</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrelationAnalysis;