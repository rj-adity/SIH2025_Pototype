import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const DateRangeControls = ({ onDateRangeChange, onLocationChange, onReportTemplateChange }) => {
  const [selectedPreset, setSelectedPreset] = useState('last-30-days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isCustomRange, setIsCustomRange] = useState(false);

  const presetOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last-7-days', label: 'Last 7 Days' },
    { value: 'last-30-days', label: 'Last 30 Days' },
    { value: 'last-quarter', label: 'Last Quarter' },
    { value: 'last-6-months', label: 'Last 6 Months' },
    { value: 'last-year', label: 'Last Year' },
    { value: 'fiscal-year', label: 'Current Fiscal Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    { value: 'downtown', label: 'Downtown District' },
    { value: 'university', label: 'University Campus' },
    { value: 'shopping', label: 'Shopping Complex' },
    { value: 'transit', label: 'Transit Hub' },
    { value: 'residential', label: 'Residential Area' },
    { value: 'business', label: 'Business District' }
  ];

  const reportTemplateOptions = [
    { value: '', label: 'Select Template' },
    { value: 'executive-summary', label: 'Executive Summary' },
    { value: 'detailed-analytics', label: 'Detailed Analytics' },
    { value: 'compliance-report', label: 'Compliance Report' },
    { value: 'incident-analysis', label: 'Incident Analysis' },
    { value: 'trend-report', label: 'Trend Report' },
    { value: 'comparative-analysis', label: 'Comparative Analysis' }
  ];

  const handlePresetChange = (preset) => {
    setSelectedPreset(preset);
    setIsCustomRange(preset === 'custom');
    
    if (preset !== 'custom') {
      const dateRange = getDateRangeFromPreset(preset);
      onDateRangeChange?.(dateRange);
    }
  };

  const getDateRangeFromPreset = (preset) => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    switch (preset) {
      case 'today':
        return { start: startOfDay, end: endOfDay };
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday?.setDate(yesterday?.getDate() - 1);
        return { 
          start: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()),
          end: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59)
        };
      case 'last-7-days':
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo?.setDate(sevenDaysAgo?.getDate() - 7);
        return { start: sevenDaysAgo, end: endOfDay };
      case 'last-30-days':
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo?.setDate(thirtyDaysAgo?.getDate() - 30);
        return { start: thirtyDaysAgo, end: endOfDay };
      case 'last-quarter':
        const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3 - 3, 1);
        const quarterEnd = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 0, 23, 59, 59);
        return { start: quarterStart, end: quarterEnd };
      case 'last-6-months':
        const sixMonthsAgo = new Date(today);
        sixMonthsAgo?.setMonth(sixMonthsAgo?.getMonth() - 6);
        return { start: sixMonthsAgo, end: endOfDay };
      case 'last-year':
        const lastYear = new Date(today.getFullYear() - 1, 0, 1);
        const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31, 23, 59, 59);
        return { start: lastYear, end: lastYearEnd };
      case 'fiscal-year':
        const fiscalStart = new Date(today.getFullYear(), 3, 1); // April 1st
        const fiscalEnd = new Date(today.getFullYear() + 1, 2, 31, 23, 59, 59); // March 31st next year
        return { start: fiscalStart, end: fiscalEnd };
      default:
        return { start: thirtyDaysAgo, end: endOfDay };
    }
  };

  const handleCustomDateChange = () => {
    if (customStartDate && customEndDate) {
      const dateRange = {
        start: new Date(customStartDate),
        end: new Date(customEndDate)
      };
      onDateRangeChange?.(dateRange);
    }
  };

  const handleLocationChange = (locations) => {
    setSelectedLocations(locations);
    onLocationChange?.(locations);
  };

  const handleTemplateChange = (template) => {
    setSelectedTemplate(template);
    onReportTemplateChange?.(template);
  };

  const handleQuickRefresh = () => {
    // Trigger data refresh
    window.location?.reload();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 tactical-shadow-secondary mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Analytics Controls</h3>
          <p className="text-sm text-muted-foreground">
            Configure date range, locations, and report parameters
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" iconName="RefreshCw" onClick={handleQuickRefresh}>
            Refresh
          </Button>
          <Button variant="outline" size="sm" iconName="Settings">
            Settings
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {/* Date Range Preset */}
        <Select
          label="Date Range"
          placeholder="Select date range"
          options={presetOptions}
          value={selectedPreset}
          onChange={handlePresetChange}
        />

        {/* Location Filter */}
        <Select
          label="Locations"
          placeholder="Select locations"
          options={locationOptions}
          value={selectedLocations}
          onChange={handleLocationChange}
          multiple
          searchable
        />

        {/* Report Template */}
        <Select
          label="Report Template"
          placeholder="Select template"
          options={reportTemplateOptions}
          value={selectedTemplate}
          onChange={handleTemplateChange}
        />

        {/* Quick Actions */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Quick Actions</label>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" iconName="Download" fullWidth>
              Export
            </Button>
            <Button variant="outline" size="sm" iconName="Share" fullWidth>
              Share
            </Button>
          </div>
        </div>
      </div>
      {/* Custom Date Range */}
      {isCustomRange && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <Input
            label="Start Date"
            type="date"
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e?.target?.value)}
          />
          <Input
            label="End Date"
            type="date"
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e?.target?.value)}
          />
          <div className="flex items-end">
            <Button 
              variant="primary" 
              size="sm" 
              iconName="Check"
              onClick={handleCustomDateChange}
              disabled={!customStartDate || !customEndDate}
              fullWidth
            >
              Apply Range
            </Button>
          </div>
        </div>
      )}
      {/* Current Selection Summary */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={14} />
            <span>
              {selectedPreset === 'custom' && customStartDate && customEndDate
                ? `${customStartDate} to ${customEndDate}`
                : presetOptions?.find(opt => opt?.value === selectedPreset)?.label || 'Last 30 Days'
              }
            </span>
          </div>
          {selectedLocations?.length > 0 && (
            <div className="flex items-center space-x-2">
              <Icon name="MapPin" size={14} />
              <span>
                {selectedLocations?.length === 1 
                  ? locationOptions?.find(opt => opt?.value === selectedLocations?.[0])?.label
                  : `${selectedLocations?.length} locations selected`
                }
              </span>
            </div>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground">
          Last updated: {new Date()?.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default DateRangeControls;