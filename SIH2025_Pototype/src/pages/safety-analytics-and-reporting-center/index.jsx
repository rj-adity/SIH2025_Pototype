import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import SafetyKPICard from './components/SafetyKPICard';
import TrendAnalysisChart from './components/TrendAnalysisChart';
import SafetyAuditChecklist from './components/SafetyAuditChecklist';
import ComplianceDeadlines from './components/ComplianceDeadlines';
import ReportGenerator from './components/ReportGenerator';
import IncidentDataTable from './components/IncidentDataTable';
import DateRangeControls from './components/DateRangeControls';

const SafetyAnalyticsAndReportingCenter = () => {
  const [dateRange, setDateRange] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock KPI data
  const kpiData = [
    {
      title: 'Overall Safety Score',
      value: '87.3',
      change: '+2.4%',
      changeType: 'positive',
      icon: 'Shield',
      trend: 87,
      benchmark: '85.0 (Industry Avg)'
    },
    {
      title: 'Incident Reduction',
      value: '23.5%',
      change: '+5.2%',
      changeType: 'positive',
      icon: 'TrendingDown',
      trend: 76,
      benchmark: '20.0% (Target)'
    },
    {
      title: 'Compliance Rating',
      value: '94.8%',
      change: '+1.1%',
      changeType: 'positive',
      icon: 'CheckCircle',
      trend: 95,
      benchmark: '90.0% (Required)'
    },
    {
      title: 'Risk Assessment',
      value: 'Low',
      change: '-0.3%',
      changeType: 'positive',
      icon: 'AlertTriangle',
      trend: 25,
      benchmark: 'Medium (Baseline)'
    }
  ];

  // Mock trend analysis data
  const trendData = [
    { period: 'Jan', safetyScore: 82, incidents: 45 },
    { period: 'Feb', safetyScore: 84, incidents: 38 },
    { period: 'Mar', safetyScore: 83, incidents: 42 },
    { period: 'Apr', safetyScore: 86, incidents: 35 },
    { period: 'May', safetyScore: 85, incidents: 40 },
    { period: 'Jun', safetyScore: 87, incidents: 32 },
    { period: 'Jul', safetyScore: 89, incidents: 28 },
    { period: 'Aug', safetyScore: 88, incidents: 31 },
    { period: 'Sep', safetyScore: 90, incidents: 25 },
    { period: 'Oct', safetyScore: 89, incidents: 29 },
    { period: 'Nov', safetyScore: 91, incidents: 22 },
    { period: 'Dec', safetyScore: 87, incidents: 34 }
  ];

  const locationComparisonData = [
    { location: 'Downtown', incidents: 45, resolved: 42 },
    { location: 'University', incidents: 32, resolved: 30 },
    { location: 'Shopping', incidents: 28, resolved: 26 },
    { location: 'Transit', incidents: 38, resolved: 35 },
    { location: 'Business', incidents: 25, resolved: 24 },
    { location: 'Residential', incidents: 18, resolved: 17 }
  ];

  const correlationData = [
    { safetyMeasures: 15, incidentRate: 8.2 },
    { safetyMeasures: 22, incidentRate: 6.1 },
    { safetyMeasures: 18, incidentRate: 7.5 },
    { safetyMeasures: 25, incidentRate: 4.8 },
    { safetyMeasures: 12, incidentRate: 9.3 },
    { safetyMeasures: 28, incidentRate: 3.9 },
    { safetyMeasures: 20, incidentRate: 6.8 },
    { safetyMeasures: 30, incidentRate: 3.2 },
    { safetyMeasures: 16, incidentRate: 8.7 },
    { safetyMeasures: 24, incidentRate: 5.1 }
  ];

  // Auto-refresh data every hour
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 3600000); // 1 hour

    return () => clearInterval(interval);
  }, []);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    console.log('Date range changed:', range);
  };

  const handleLocationChange = (locations) => {
    setSelectedLocations(locations);
    console.log('Locations changed:', locations);
  };

  const handleReportTemplateChange = (template) => {
    setSelectedTemplate(template);
    console.log('Report template changed:', template);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-[60px] pb-20 md:pb-6">
        <div className="max-w-[1920px] mx-auto p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Safety Analytics & Reporting Center</h1>
                <p className="text-muted-foreground mt-2">
                  Comprehensive analytical dashboard for safety performance insights and regulatory compliance
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Last Updated</div>
                <div className="text-sm font-mono text-foreground">
                  {lastUpdated?.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Date Range Controls */}
          <DateRangeControls
            onDateRangeChange={handleDateRangeChange}
            onLocationChange={handleLocationChange}
            onReportTemplateChange={handleReportTemplateChange}
          />

          {/* KPI Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData?.map((kpi, index) => (
              <SafetyKPICard
                key={index}
                title={kpi?.title}
                value={kpi?.value}
                change={kpi?.change}
                changeType={kpi?.changeType}
                icon={kpi?.icon}
                trend={kpi?.trend}
                benchmark={kpi?.benchmark}
              />
            ))}
          </div>

          {/* Main Analytics Area */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
            {/* Charts Section (12 cols equivalent) */}
            <div className="xl:col-span-3 space-y-6">
              {/* Trend Analysis */}
              <TrendAnalysisChart
                type="line"
                data={trendData}
                title="Safety Score & Incident Trends"
                height={350}
              />

              {/* Location Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TrendAnalysisChart
                  type="bar"
                  data={locationComparisonData}
                  title="Location-wise Incident Comparison"
                  height={300}
                />
                <TrendAnalysisChart
                  type="scatter"
                  data={correlationData}
                  title="Safety Measures vs Incident Rate Correlation"
                  height={300}
                />
              </div>
            </div>

            {/* Right Panel (4 cols equivalent) */}
            <div className="space-y-6">
              <SafetyAuditChecklist />
              <ComplianceDeadlines />
              <ReportGenerator />
            </div>
          </div>

          {/* Comprehensive Data Table */}
          <IncidentDataTable />
        </div>
      </main>
    </div>
  );
};

export default SafetyAnalyticsAndReportingCenter;