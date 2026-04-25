import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';

const SERVER_URL = window.SERVER_URL;


const CrowdAnalyticsChart = ({ selectedTimeRange, onTimeRangeChange }) => {
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState('area');
  const [analyticsData, setAnalyticsData] = useState([]);
  const [demographicData, setDemographicData] = useState([]);
  const [locationData, setLocationData] = useState([]);

  const cameras = [
    "main_entrance",
    "parking",
    "corridor",
    "library",
    "food_court",
    "platform"
  ];

  const fetchAnalytics = async () => {

  try {

    const res = await fetch(`${SERVER_URL}/dashboard_stats`, {
      headers: {
        "ngrok-skip-browser-warning": "true"
      }
    });

    const data = await res.json();

    const now = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    const newPoint = {
      time: now,
      female: data.female,
      male: data.male,
      alerts: data.alerts
    };

    setChartData(prev => [...prev.slice(-20), newPoint]);

  } catch (err) {

    console.log("Analytics error:", err);

  }

};


 useEffect(() => {

  const data = [
    { name: "Female", value: chartData?.at(-1)?.female || 0, color: "#00FFFF" },
    { name: "Male", value: chartData?.at(-1)?.male || 0, color: "#0066CC" }
  ];

  setDemographicData(data);

}, [chartData]);

  useEffect(() => {

    fetchAnalytics();

    const interval = setInterval(fetchAnalytics, 5000);

    return () => clearInterval(interval);

  }, []);

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
            <AreaChart data={chartData}>
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

              <Area
                type="monotone"
                dataKey="alerts"
                stroke="#ff4d4f"
                fill="#ff4d4f"
                fillOpacity={0.3}
                name="Violence Alerts"
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
              {chartData?.length > 0 ? chartData?.[chartData.length - 1]?.alerts || 0 : 0}
            </div>
            <div className="text-xs text-muted-foreground">Current Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {chartData?.length > 0 ? chartData?.[chartData.length - 1]?.female || 0 : 0}
            </div>
            <div className="text-xs text-muted-foreground">Female Count</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">
              {chartData?.length > 0 ? chartData?.[chartData.length - 1]?.male || 0 : 0}
            </div>
            <div className="text-xs text-muted-foreground">Male Count</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">
              {chartData?.length > 0 ? chartData[chartData.length - 1]?.alerts : 0}
            </div>
            <div className="text-xs text-muted-foreground">Active Alerts</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrowdAnalyticsChart;