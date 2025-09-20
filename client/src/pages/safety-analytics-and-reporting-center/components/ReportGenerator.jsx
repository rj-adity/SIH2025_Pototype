import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const ReportGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [locations, setLocations] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTemplates = [
    { value: 'monthly-safety', label: 'Monthly Safety Report' },
    { value: 'incident-analysis', label: 'Incident Analysis Report' },
    { value: 'compliance-audit', label: 'Compliance Audit Report' },
    { value: 'trend-analysis', label: 'Trend Analysis Report' },
    { value: 'emergency-response', label: 'Emergency Response Report' },
    { value: 'custom', label: 'Custom Report Template' }
  ];

  const dateRangeOptions = [
    { value: 'last-7-days', label: 'Last 7 Days' },
    { value: 'last-30-days', label: 'Last 30 Days' },
    { value: 'last-quarter', label: 'Last Quarter' },
    { value: 'last-year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Date Range' }
  ];

  const locationOptions = [
    { value: 'downtown', label: 'Downtown District' },
    { value: 'university', label: 'University Campus' },
    { value: 'shopping', label: 'Shopping Complex' },
    { value: 'transit', label: 'Transit Hub' },
    { value: 'residential', label: 'Residential Area' },
    { value: 'business', label: 'Business District' }
  ];

  const recentReports = [
    {
      id: 1,
      name: 'Monthly Safety Report - December 2024',
      type: 'Monthly Safety Report',
      generatedDate: '2025-01-05',
      size: '2.4 MB',
      status: 'completed'
    },
    {
      id: 2,
      name: 'Q4 2024 Incident Analysis',
      type: 'Incident Analysis Report',
      generatedDate: '2025-01-03',
      size: '1.8 MB',
      status: 'completed'
    },
    {
      id: 3,
      name: 'Emergency Response Effectiveness',
      type: 'Emergency Response Report',
      generatedDate: '2025-01-02',
      size: '3.1 MB',
      status: 'completed'
    }
  ];

  const handleGenerateReport = async () => {
    if (!selectedTemplate || !dateRange) return;
    
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      // Reset form
      setSelectedTemplate('');
      setDateRange('');
      setLocations([]);
    }, 3000);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 tactical-shadow-secondary">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Report Generator</h3>
          <p className="text-sm text-muted-foreground">
            Generate automated compliance reports
          </p>
        </div>
        <Icon name="FileText" size={20} className="text-primary" />
      </div>
      <div className="space-y-4 mb-6">
        <Select
          label="Report Template"
          placeholder="Select a report template"
          options={reportTemplates}
          value={selectedTemplate}
          onChange={setSelectedTemplate}
          required
        />

        <Select
          label="Date Range"
          placeholder="Select date range"
          options={dateRangeOptions}
          value={dateRange}
          onChange={setDateRange}
          required
        />

        <Select
          label="Locations"
          placeholder="Select locations (optional)"
          options={locationOptions}
          value={locations}
          onChange={setLocations}
          multiple
          searchable
        />

        {dateRange === 'custom' && (
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              placeholder="Select start date"
            />
            <Input
              label="End Date"
              type="date"
              placeholder="Select end date"
            />
          </div>
        )}
      </div>
      <div className="space-y-3 mb-6">
        <Button
          variant="primary"
          fullWidth
          iconName="Download"
          loading={isGenerating}
          onClick={handleGenerateReport}
          disabled={!selectedTemplate || !dateRange}
        >
          {isGenerating ? 'Generating Report...' : 'Generate Report'}
        </Button>
        
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" iconName="Eye">
            Preview
          </Button>
          <Button variant="outline" size="sm" iconName="Send">
            Schedule
          </Button>
        </div>
      </div>
      <div className="border-t border-border pt-6">
        <h4 className="text-sm font-semibold text-foreground mb-4">Recent Reports</h4>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {recentReports?.map((report) => (
            <div 
              key={report?.id}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted tactical-transition"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="FileText" size={16} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <h5 className="text-sm font-medium text-foreground truncate">
                    {report?.name}
                  </h5>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{new Date(report.generatedDate)?.toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{report?.size}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="xs" iconName="Download">
                  Download
                </Button>
                <Button variant="ghost" size="xs" iconName="Share">
                  Share
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;