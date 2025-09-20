import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import ThreatMetricsCard from './components/ThreatMetricsCard';
import FilterPanel from './components/FilterPanel';
import ThreatHeatmap from './components/ThreatHeatmap';
import ThreatClassificationChart from './components/ThreatClassificationChart';
import IncidentTimeline from './components/IncidentTimeline';
import CorrelationAnalysis from './components/CorrelationAnalysis';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';



const ThreatDetectionAndAnalyticsDashboard = () => {
  const [filters, setFilters] = useState({
    dateRange: 'last-24h',
    locations: ['Downtown District'],
    threatTypes: ['all'],
    confidenceThreshold: 75
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock primary metrics data
  const primaryMetrics = [
    {
      title: 'Threat Detection Accuracy',
      value: '94.2',
      unit: '%',
      trend: 'up',
      trendValue: '+2.1%',
      icon: 'Target',
      color: 'primary'
    },
    {
      title: 'False Positive Rate',
      value: '5.8',
      unit: '%',
      trend: 'down',
      trendValue: '-1.3%',
      icon: 'AlertCircle',
      color: 'warning'
    },
    {
      title: 'Average Response Time',
      value: '2.3',
      unit: 'min',
      trend: 'down',
      trendValue: '-0.4min',
      icon: 'Clock',
      color: 'success'
    },
    {
      title: 'Incident Resolution Rate',
      value: '87.5',
      unit: '%',
      trend: 'up',
      trendValue: '+3.2%',
      icon: 'CheckCircle',
      color: 'primary'
    }
  ];

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setLastUpdated(new Date());
  };

  const handleManualRefresh = () => {
    setLastUpdated(new Date());
  };

  return (
    <>
      <Helmet>
        <title>Threat Detection & Analytics Dashboard - Women Safety Analytics</title>
        <meta name="description" content="Advanced analytics dashboard for investigating behavioral patterns, assessing risk scenarios, and analyzing threat detection performance across monitored environments." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-[60px] pb-20 md:pb-6">
          <div className="max-w-[1920px] mx-auto p-6 space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Threat Detection & Analytics</h1>
                <p className="text-sm text-muted-foreground">
                  Advanced behavioral pattern analysis and risk assessment dashboard
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-xs text-muted-foreground">
                  Last updated: {lastUpdated?.toLocaleTimeString()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualRefresh}
                  iconName="RefreshCw"
                >
                  Refresh
                </Button>
              </div>
            </div>

            {/* Filter Panel */}
            <FilterPanel onFiltersChange={handleFiltersChange} />

            {/* Primary Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {primaryMetrics?.map((metric, index) => (
                <ThreatMetricsCard
                  key={index}
                  title={metric?.title}
                  value={metric?.value}
                  unit={metric?.unit}
                  trend={metric?.trend}
                  trendValue={metric?.trendValue}
                  icon={metric?.icon}
                  color={metric?.color}
                />
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Threat Heatmap - 12 cols */}
              <div className="xl:col-span-3">
                <ThreatHeatmap />
              </div>

              {/* Threat Classification - 4 cols */}
              <div className="xl:col-span-1">
                <ThreatClassificationChart />
              </div>
            </div>

            {/* Timeline Chart - Full Width */}
            <div className="w-full">
              <IncidentTimeline />
            </div>

            {/* Correlation Analysis - Full Width */}
            <div className="w-full">
              <CorrelationAnalysis />
            </div>

            {/* Additional Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* AI Model Performance */}
              <div className="bg-card border border-border rounded-lg p-6 tactical-shadow-secondary">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name="Brain" size={20} color="var(--color-primary-foreground)" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">AI Model Performance</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Gesture Recognition</span>
                    <span className="text-sm font-medium text-success">96.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Crowd Analysis</span>
                    <span className="text-sm font-medium text-success">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Behavior Detection</span>
                    <span className="text-sm font-medium text-warning">89.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Emergency Signals</span>
                    <span className="text-sm font-medium text-success">98.1%</span>
                  </div>
                </div>
              </div>

              {/* Environmental Factors */}
              <div className="bg-card border border-border rounded-lg p-6 tactical-shadow-secondary">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                    <Icon name="CloudRain" size={20} color="var(--color-primary-foreground)" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Environmental Impact</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Weather Correlation</span>
                    <span className="text-sm font-medium text-primary">0.73</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Lighting Conditions</span>
                    <span className="text-sm font-medium text-success">Optimal</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Crowd Density</span>
                    <span className="text-sm font-medium text-warning">High</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Noise Level</span>
                    <span className="text-sm font-medium text-success">Normal</span>
                  </div>
                </div>
              </div>

              {/* Predictive Analytics */}
              <div className="bg-card border border-border rounded-lg p-6 tactical-shadow-secondary">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
                    <Icon name="TrendingUp" size={20} color="var(--color-primary-foreground)" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Predictive Insights</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm font-medium text-foreground mb-1">Next Hour Forecast</div>
                    <div className="text-xs text-muted-foreground">Expected 15% increase in threat activity</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm font-medium text-foreground mb-1">Risk Assessment</div>
                    <div className="text-xs text-muted-foreground">Downtown District shows elevated risk patterns</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm font-medium text-foreground mb-1">Resource Allocation</div>
                    <div className="text-xs text-muted-foreground">Recommend 2 additional units for evening shift</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ThreatDetectionAndAnalyticsDashboard;