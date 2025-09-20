import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const ThreatClassificationChart = () => {
  const threatData = [
    { name: 'Gesture Recognition', value: 35, color: '#00FFFF', incidents: 42 },
    { name: 'Crowd Anomaly', value: 28, color: '#FF6B00', incidents: 34 },
    { name: 'Suspicious Behavior', value: 22, color: '#FFD700', incidents: 26 },
    { name: 'Emergency Signal', value: 15, color: '#FF0000', incidents: 18 }
  ];

  const severityData = [
    { level: 'Critical', count: 8, color: '#FF0000', percentage: 6.7 },
    { level: 'High', count: 23, color: '#FF6B00', percentage: 19.2 },
    { level: 'Medium', count: 45, color: '#FFD700', percentage: 37.5 },
    { level: 'Low', count: 44, color: '#00FF88', percentage: 36.7 }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 tactical-shadow-secondary">
          <p className="text-sm font-medium text-foreground">{data?.name}</p>
          <p className="text-xs text-muted-foreground">
            {data?.value}% ({data?.incidents} incidents)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg tactical-shadow-secondary">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="PieChart" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Threat Classification</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Download"
          >
            Export
          </Button>
        </div>
      </div>
      <div className="p-4 space-y-6">
        {/* Threat Type Distribution */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-4">Threat Type Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {threatData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {threatData?.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item?.color }}
                ></div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-foreground truncate">
                    {item?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item?.value}% ({item?.incidents})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Severity Distribution */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-4">Severity Distribution</h3>
          <div className="space-y-3">
            {severityData?.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item?.color }}
                    ></div>
                    <span className="text-sm font-medium text-foreground">{item?.level}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item?.count} ({item?.percentage}%)
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="h-2 rounded-full tactical-transition"
                    style={{ 
                      width: `${item?.percentage}%`,
                      backgroundColor: item?.color 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-xl font-bold text-primary">120</div>
            <div className="text-xs text-muted-foreground">Total Threats</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-success">94.2%</div>
            <div className="text-xs text-muted-foreground">Classification Accuracy</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatClassificationChart;