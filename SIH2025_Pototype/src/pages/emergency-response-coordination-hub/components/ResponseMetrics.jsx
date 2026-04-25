import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const ResponseMetrics = () => {
  const [activeMetric, setActiveMetric] = useState('deployment');
  const [realTimeData, setRealTimeData] = useState({
    deploymentStatus: 85,
    equipmentAvailability: 92,
    communicationActivity: 78
  });

  const deploymentData = [
    { name: 'Patrol Units', deployed: 12, available: 8, total: 20 },
    { name: 'Medical Units', deployed: 3, available: 5, total: 8 },
    { name: 'K9 Units', deployed: 2, available: 2, total: 4 },
    { name: 'Supervisors', deployed: 4, available: 3, total: 7 }
  ];

  const responseTimeData = [
    { time: '00:00', avgResponse: 4.2, target: 5.0 },
    { time: '04:00', avgResponse: 3.8, target: 5.0 },
    { time: '08:00', avgResponse: 5.1, target: 5.0 },
    { time: '12:00', avgResponse: 6.2, target: 5.0 },
    { time: '16:00', avgResponse: 5.8, target: 5.0 },
    { time: '20:00', avgResponse: 4.9, target: 5.0 }
  ];

  const communicationData = [
    { name: 'Radio Channels', value: 45, color: 'var(--color-primary)' },
    { name: 'Mobile Apps', value: 30, color: 'var(--color-success)' },
    { name: 'Emergency Calls', value: 15, color: 'var(--color-warning)' },
    { name: 'System Alerts', value: 10, color: 'var(--color-error)' }
  ];

  const equipmentStatus = [
    { category: 'Vehicles', available: 18, total: 22, percentage: 82 },
    { category: 'Communication', available: 45, total: 48, percentage: 94 },
    { category: 'Medical Equipment', available: 12, total: 15, percentage: 80 },
    { category: 'Safety Gear', available: 67, total: 70, percentage: 96 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        deploymentStatus: Math.max(70, Math.min(95, prev?.deploymentStatus + (Math.random() - 0.5) * 5)),
        equipmentAvailability: Math.max(80, Math.min(98, prev?.equipmentAvailability + (Math.random() - 0.5) * 3)),
        communicationActivity: Math.max(60, Math.min(90, prev?.communicationActivity + (Math.random() - 0.5) * 8))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (percentage) => {
    if (percentage >= 90) return 'text-success';
    if (percentage >= 75) return 'text-warning';
    return 'text-error';
  };

  const getStatusBgColor = (percentage) => {
    if (percentage >= 90) return 'bg-success/10';
    if (percentage >= 75) return 'bg-warning/10';
    return 'bg-error/10';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Team Deployment Status */}
      <div className="bg-card border border-border rounded-lg p-6 tactical-shadow-secondary">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Team Deployment</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBgColor(realTimeData?.deploymentStatus)} ${getStatusColor(realTimeData?.deploymentStatus)}`}>
            {Math.round(realTimeData?.deploymentStatus)}% Active
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deploymentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="deployed" fill="var(--color-primary)" name="Deployed" />
              <Bar dataKey="available" fill="var(--color-success)" name="Available" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 space-y-2">
          {deploymentData?.map((item) => (
            <div key={item?.name} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item?.name}</span>
              <span className="text-foreground font-medium">
                {item?.deployed}/{item?.total} deployed
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Equipment Availability */}
      <div className="bg-card border border-border rounded-lg p-6 tactical-shadow-secondary">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Equipment Status</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBgColor(realTimeData?.equipmentAvailability)} ${getStatusColor(realTimeData?.equipmentAvailability)}`}>
            {Math.round(realTimeData?.equipmentAvailability)}% Ready
          </div>
        </div>

        <div className="space-y-4">
          {equipmentStatus?.map((equipment) => (
            <div key={equipment?.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{equipment?.category}</span>
                <span className="text-sm text-muted-foreground">
                  {equipment?.available}/{equipment?.total}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${equipment?.percentage >= 90 ? 'bg-success' : equipment?.percentage >= 75 ? 'bg-warning' : 'bg-error'}`}
                  style={{ width: `${equipment?.percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Available</span>
                <span className={`font-medium ${getStatusColor(equipment?.percentage)}`}>
                  {equipment?.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-3 bg-muted rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm font-medium text-foreground">Maintenance Alerts</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>• Vehicle Unit-07: Scheduled maintenance due</div>
            <div>• Radio Channel 3: Signal strength low</div>
            <div>• Medical Kit #12: Supplies need restocking</div>
          </div>
        </div>
      </div>
      {/* Communication Activity */}
      <div className="bg-card border border-border rounded-lg p-6 tactical-shadow-secondary">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Communication Channels</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBgColor(realTimeData?.communicationActivity)} ${getStatusColor(realTimeData?.communicationActivity)}`}>
            {Math.round(realTimeData?.communicationActivity)}% Active
          </div>
        </div>

        <div className="h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={communicationData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {communicationData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          {communicationData?.map((channel) => (
            <div key={channel?.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: channel?.color }}
                ></div>
                <span className="text-sm text-muted-foreground">{channel?.name}</span>
              </div>
              <span className="text-sm font-medium text-foreground">{channel?.value}%</span>
            </div>
          ))}
        </div>

        <div className="mt-6 p-3 bg-primary/10 border border-primary rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Radio" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Live Activity</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>• 23 active radio transmissions</div>
            <div>• 8 emergency app alerts received</div>
            <div>• 12 units reporting status updates</div>
          </div>
        </div>
      </div>
      {/* Response Time Trends */}
      <div className="lg:col-span-3 bg-card border border-border rounded-lg p-6 tactical-shadow-secondary">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Response Time Performance</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm text-muted-foreground">Actual Response</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-error rounded-full"></div>
              <span className="text-sm text-muted-foreground">Target (5 min)</span>
            </div>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [
                  `${value} min`,
                  name === 'avgResponse' ? 'Average Response' : 'Target'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="avgResponse" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="var(--color-error)" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-success">4.8</div>
            <div className="text-sm text-muted-foreground">Avg Response (min)</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">23</div>
            <div className="text-sm text-muted-foreground">Incidents Today</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-warning">2</div>
            <div className="text-sm text-muted-foreground">Over Target</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-success">91%</div>
            <div className="text-sm text-muted-foreground">Target Met</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseMetrics;