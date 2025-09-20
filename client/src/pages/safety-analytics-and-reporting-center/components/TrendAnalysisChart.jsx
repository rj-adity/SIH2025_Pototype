import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter } from 'recharts';

const TrendAnalysisChart = ({ type, data, title, height = 300 }) => {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="period" 
              stroke="#B0B0B3" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#B0B0B3" 
              fontSize={12}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1A1A1D',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#FFFFFF'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="safetyScore" 
              stroke="#00FFFF" 
              strokeWidth={2}
              dot={{ fill: '#00FFFF', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#00FFFF', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="incidents" 
              stroke="#FF6B00" 
              strokeWidth={2}
              dot={{ fill: '#FF6B00', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        );
      
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="location" 
              stroke="#B0B0B3" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#B0B0B3" 
              fontSize={12}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1A1A1D',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#FFFFFF'
              }}
            />
            <Bar dataKey="incidents" fill="#00FFFF" radius={[4, 4, 0, 0]} />
            <Bar dataKey="resolved" fill="#00FF88" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      
      case 'scatter':
        return (
          <ScatterChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              type="number"
              dataKey="safetyMeasures" 
              stroke="#B0B0B3" 
              fontSize={12}
              tickLine={false}
              name="Safety Measures"
            />
            <YAxis 
              type="number"
              dataKey="incidentRate" 
              stroke="#B0B0B3" 
              fontSize={12}
              tickLine={false}
              name="Incident Rate"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1A1A1D',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#FFFFFF'
              }}
              cursor={{ strokeDasharray: '3 3' }}
            />
            <Scatter fill="#00FFFF" />
          </ScatterChart>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 tactical-shadow-secondary">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendAnalysisChart;