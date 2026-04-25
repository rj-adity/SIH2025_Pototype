import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterPanel = ({ onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: 'last-24h',
    locations: ['Downtown District'],
    threatTypes: ['all'],
    confidenceThreshold: 75
  });

  const dateRangeOptions = [
    { value: 'last-hour', label: 'Last Hour' },
    { value: 'last-24h', label: 'Last 24 Hours' },
    { value: 'last-week', label: 'Last Week' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'last-6months', label: 'Last 6 Months' }
  ];

  const locationOptions = [
    'Downtown District',
    'University Campus',
    'Shopping Complex',
    'Transit Hub',
    'Residential Area',
    'Business District'
  ];

  const threatTypeOptions = [
    { value: 'all', label: 'All Threats' },
    { value: 'gesture-recognition', label: 'Gesture Recognition' },
    { value: 'crowd-anomaly', label: 'Crowd Anomaly' },
    { value: 'suspicious-behavior', label: 'Suspicious Behavior' },
    { value: 'emergency-signal', label: 'Emergency Signal' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleLocationToggle = (location) => {
    const newLocations = filters?.locations?.includes(location)
      ? filters?.locations?.filter(l => l !== location)
      : [...filters?.locations, location];
    handleFilterChange('locations', newLocations);
  };

  const handleThreatTypeToggle = (threatType) => {
    const newThreatTypes = filters?.threatTypes?.includes(threatType)
      ? filters?.threatTypes?.filter(t => t !== threatType)
      : [...filters?.threatTypes, threatType];
    handleFilterChange('threatTypes', newThreatTypes);
  };

  return (
    <div className="bg-card border border-border rounded-lg tactical-shadow-secondary">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Advanced Filters</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Date Range */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Time Range</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {dateRangeOptions?.map((option) => (
                <button
                  key={option?.value}
                  onClick={() => handleFilterChange('dateRange', option?.value)}
                  className={`
                    px-3 py-2 text-sm rounded-lg tactical-transition
                    ${filters?.dateRange === option?.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-card hover:text-foreground'
                    }
                  `}
                >
                  {option?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Locations</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {locationOptions?.map((location) => (
                <button
                  key={location}
                  onClick={() => handleLocationToggle(location)}
                  className={`
                    px-3 py-2 text-sm rounded-lg tactical-transition text-left
                    ${filters?.locations?.includes(location)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-card hover:text-foreground'
                    }
                  `}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>

          {/* Threat Types */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Threat Types</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {threatTypeOptions?.map((threatType) => (
                <button
                  key={threatType?.value}
                  onClick={() => handleThreatTypeToggle(threatType?.value)}
                  className={`
                    px-3 py-2 text-sm rounded-lg tactical-transition text-left
                    ${filters?.threatTypes?.includes(threatType?.value)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-card hover:text-foreground'
                    }
                  `}
                >
                  {threatType?.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI Confidence Threshold */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">AI Confidence Threshold</label>
              <span className="text-sm text-primary font-mono">{filters?.confidenceThreshold}%</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={filters?.confidenceThreshold}
                onChange={(e) => handleFilterChange('confidenceThreshold', parseInt(e?.target?.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const resetFilters = {
                  dateRange: 'last-24h',
                  locations: ['Downtown District'],
                  threatTypes: ['all'],
                  confidenceThreshold: 75
                };
                setFilters(resetFilters);
                onFiltersChange?.(resetFilters);
              }}
              iconName="RotateCcw"
            >
              Reset Filters
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="Download"
            >
              Export Data
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;