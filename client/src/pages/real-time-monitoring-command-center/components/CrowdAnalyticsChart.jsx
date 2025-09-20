import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';


const CrowdAnalyticsChart = ({ selectedTimeRange, onTimeRangeChange }) => {
  const [chartType, setChartType] = useState('area');
  const [analyticsData, setAnalyticsData] = useState([]);
  const [demographicData, setDemographicData] = useState([]);
  const [locationData, setLocationData] = useState([]);

  useEffect(() => {
    // Generate mock time-series data
    const generateTimeSeriesData = () => {
      const data = [];
      const now = new Date();
      const intervals = selectedTimeRange === '1h' ? 12 : selectedTimeRange === '6h' ? 36 : 48;
      const step = selectedTimeRange === '1h' ? 5 : selectedTimeRange === '6h' ? 10 : 30;

      for (let i = intervals; i >= 0; i--) {
        const time = new Date(now.getTime() - (i * step * 60000));
        const baseCount = 20 + Math.sin(i * 0.3) * 15;
        const femaleCount = Math.floor(baseCount * (0.45 + Math.random() * 0.2));
        const maleCount = Math.floor(baseCount * (0.35 + Math.random() * 0.2));
        const total = femaleCount + maleCount;

        data?.push({
          time: time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: time,
          total: total,
          female: femaleCount,
          male: maleCount,
          density: Math.floor((total / 100) * 100),
          alerts: Math.floor(Math.random() * 3)
        });
      }
      return data;
    };

    // Generate demographic breakdown
    const generateDemographicData = () => [
      { name: 'Female', value: 58, color: '#00FFFF' },
      { name: 'Male', value: 42, color: '#0066CC' },
    ];

    // Generate location-based data
    const generateLocationData = () => [
      { location: 'Main Entrance', total: 45, female: 26, male: 19, alerts: 1 },
      { location: 'Parking Area', total: 32, female: 18, male: 14, alerts: 2 },
      { location: 'Corridor A', total: 38, female: 22, male: 16, alerts: 0 },
      { location: 'Study Hall', total: 52, female: 31, male: 21, alerts: 3 },
      { location: 'Food Court', total: 67, female: 39, male: 28, alerts: 1 },
      { location: 'Platform 1', total: 28, female: 16, male: 12, alerts: 0 }
    ];

    setAnalyticsData(generateTimeSeriesData());
    setDemographicData(generateDemographicData());
    setLocationData(generateLocationData());

    // Update data periodically
    const interval = setInterval(() => {
      setAnalyticsData(generateTimeSeriesData());
      setDemographicData(generateDemographicData());
      setLocationData(generateLocationData());
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const timeRangeOptions = [
    { value: '1h', label: '1 Hour' },
    { value: '6h', label: '6 Hours' },
    { value: '24h', label: '24 Hours' }
  ];

  const chartTypeOptions = [
    { value: 'area', label: 'Area Chart', icon: 'AreaChart' },
    { value: 'bar', label: 'Bar Chart', icon: 'BarChart3' },
    { value: 'pie', label: 'Demographics', icon: 'PieChart' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 tactical-shadow-secondary">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-muted-foreground">{entry?.name}:</span>
              <span className="font-medium text-foreground">{entry?.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (chartType) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData}>
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
              <Area
                type="monotone"
                dataKey="female"
                stackId="1"
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={0.6}
                name="Female"
              />
              <Area
                type="monotone"
                dataKey="male"
                stackId="1"
                stroke="var(--color-secondary)"
                fill="var(--color-secondary)"
                fillOpacity={0.6}
                name="Male"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={locationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="location" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="female" fill="var(--color-primary)" name="Female" />
              <Bar dataKey="male" fill="var(--color-secondary)" name="Male" />
              <Bar dataKey="alerts" fill="var(--color-error)" name="Alerts" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <div className="flex items-center justify-center h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demographicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {demographicData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Percentage']}
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">Crowd Analytics</h2>
            <p className="text-sm text-muted-foreground">
              Real-time population and demographic analysis
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            {timeRangeOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => onTimeRangeChange(option?.value)}
                className={`
                  px-3 py-1 text-xs font-medium rounded tactical-transition
                  ${selectedTimeRange === option?.value 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {option?.label}
              </button>
            ))}
          </div>

          {/* Chart Type Selector */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            {chartTypeOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => setChartType(option?.value)}
                className={`
                  flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded tactical-transition
                  ${chartType === option?.value 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
                title={option?.label}
              >
                <Icon name={option?.icon} size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Chart Content */}
      <div className="p-4">
        {renderChart()}
      </div>
      {/* Summary Stats */}
      <div className="border-t border-border p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {analyticsData?.length > 0 ? analyticsData?.[analyticsData?.length - 1]?.total || 0 : 0}
            </div>
            <div className="text-xs text-muted-foreground">Current Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {analyticsData?.length > 0 ? analyticsData?.[analyticsData?.length - 1]?.female || 0 : 0}
            </div>
            <div className="text-xs text-muted-foreground">Female Count</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">
              {analyticsData?.length > 0 ? analyticsData?.[analyticsData?.length - 1]?.male || 0 : 0}
            </div>
            <div className="text-xs text-muted-foreground">Male Count</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">
              {locationData?.reduce((sum, loc) => sum + loc?.alerts, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Active Alerts</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrowdAnalyticsChart;