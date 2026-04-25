import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const IncidentDataTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const incidentData = [
    {
      id: 'INC-2025-001',
      timestamp: '2025-01-20 14:30:15',
      location: 'Downtown District - Block A',
      type: 'Suspicious Activity',
      severity: 'medium',
      status: 'resolved',
      reportedBy: 'AI Detection System',
      responseTime: '3.2 min',
      description: 'Individual loitering near restricted area for extended period',
      assignedTo: 'Security Team Alpha',
      environmentalFactors: 'Low lighting, Heavy foot traffic'
    },
    {
      id: 'INC-2025-002',
      timestamp: '2025-01-20 13:45:22',
      location: 'University Campus - Library',
      type: 'Emergency Alert',
      severity: 'high',
      status: 'in-progress',
      reportedBy: 'Manual Report',
      responseTime: '1.8 min',
      description: 'Student reported feeling unsafe due to harassment',
      assignedTo: 'Campus Security',
      environmentalFactors: 'Normal lighting, Moderate crowd'
    },
    {
      id: 'INC-2025-003',
      timestamp: '2025-01-20 12:15:08',
      location: 'Shopping Complex - Parking Lot',
      type: 'Safety Concern',
      severity: 'low',
      status: 'resolved',
      reportedBy: 'Security Guard',
      responseTime: '5.1 min',
      description: 'Broken lighting fixture creating dark spot',
      assignedTo: 'Maintenance Team',
      environmentalFactors: 'Daylight, Low traffic'
    },
    {
      id: 'INC-2025-004',
      timestamp: '2025-01-20 11:20:33',
      location: 'Transit Hub - Platform 3',
      type: 'Crowd Anomaly',
      severity: 'medium',
      status: 'monitoring',
      reportedBy: 'AI Detection System',
      responseTime: '2.5 min',
      description: 'Unusual crowd gathering pattern detected',
      assignedTo: 'Transit Security',
      environmentalFactors: 'Good lighting, High density'
    },
    {
      id: 'INC-2025-005',
      timestamp: '2025-01-20 10:55:17',
      location: 'Business District - Main Plaza',
      type: 'Gesture Alert',
      severity: 'critical',
      status: 'resolved',
      reportedBy: 'AI Detection System',
      responseTime: '0.9 min',
      description: 'SOS gesture detected and verified',
      assignedTo: 'Emergency Response',
      environmentalFactors: 'Excellent lighting, Moderate crowd'
    },
    {
      id: 'INC-2025-006',
      timestamp: '2025-01-20 09:30:45',
      location: 'Residential Area - Park Zone',
      type: 'Safety Concern',
      severity: 'low',
      status: 'pending',
      reportedBy: 'Citizen Report',
      responseTime: '8.3 min',
      description: 'Inadequate lighting reported in walking path',
      assignedTo: 'Municipal Services',
      environmentalFactors: 'Poor lighting, Low traffic'
    }
  ];

  const severityOptions = [
    { value: '', label: 'All Severities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'downtown', label: 'Downtown District' },
    { value: 'university', label: 'University Campus' },
    { value: 'shopping', label: 'Shopping Complex' },
    { value: 'transit', label: 'Transit Hub' },
    { value: 'business', label: 'Business District' },
    { value: 'residential', label: 'Residential Area' }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-error text-error-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-secondary text-secondary-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'text-success';
      case 'in-progress': return 'text-warning';
      case 'monitoring': return 'text-secondary';
      case 'pending': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return 'CheckCircle';
      case 'in-progress': return 'Clock';
      case 'monitoring': return 'Eye';
      case 'pending': return 'AlertCircle';
      default: return 'Circle';
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = incidentData?.filter(incident => {
      const matchesSearch = incident?.id?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           incident?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           incident?.location?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      
      const matchesSeverity = !filterSeverity || incident?.severity === filterSeverity;
      const matchesLocation = !filterLocation || incident?.location?.toLowerCase()?.includes(filterLocation);
      
      return matchesSearch && matchesSeverity && matchesLocation;
    });

    filtered?.sort((a, b) => {
      let aValue = a?.[sortField];
      let bValue = b?.[sortField];
      
      if (sortField === 'timestamp') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [incidentData, searchTerm, sortField, sortDirection, filterSeverity, filterLocation]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData?.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedData?.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExport = () => {
    // Simulate export functionality
    console.log('Exporting incident data...');
  };

  return (
    <div className="bg-card border border-border rounded-lg tactical-shadow-secondary">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Incident Data Table</h3>
          <p className="text-sm text-muted-foreground">
            {filteredAndSortedData?.length} incidents found
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" iconName="RefreshCw">
            Refresh
          </Button>
          <Button variant="outline" size="sm" iconName="Download" onClick={handleExport}>
            Export
          </Button>
        </div>
      </div>
      {/* Filters */}
      <div className="p-6 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search incidents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="md:col-span-2"
          />
          <Select
            placeholder="Filter by severity"
            options={severityOptions}
            value={filterSeverity}
            onChange={setFilterSeverity}
          />
          <Select
            placeholder="Filter by location"
            options={locationOptions}
            value={filterLocation}
            onChange={setFilterLocation}
          />
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('id')}
                  className="flex items-center space-x-1 hover:text-foreground tactical-transition"
                >
                  <span>Incident ID</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('timestamp')}
                  className="flex items-center space-x-1 hover:text-foreground tactical-transition"
                >
                  <span>Timestamp</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Location</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('severity')}
                  className="flex items-center space-x-1 hover:text-foreground tactical-transition"
                >
                  <span>Severity</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Response Time</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData?.map((incident, index) => (
              <tr 
                key={incident?.id}
                className={`border-b border-border hover:bg-muted/30 tactical-transition ${
                  index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                }`}
              >
                <td className="p-4">
                  <span className="font-mono text-sm text-primary">{incident?.id}</span>
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    <div className="text-foreground">
                      {new Date(incident.timestamp)?.toLocaleDateString()}
                    </div>
                    <div className="text-muted-foreground font-mono">
                      {new Date(incident.timestamp)?.toLocaleTimeString()}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-foreground">{incident?.location}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-foreground">{incident?.type}</span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(incident?.severity)}`}>
                    {incident?.severity}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getStatusIcon(incident?.status)} 
                      size={14} 
                      className={getStatusColor(incident?.status)}
                    />
                    <span className={`text-sm ${getStatusColor(incident?.status)}`}>
                      {incident?.status?.replace('-', ' ')}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm font-mono text-foreground">{incident?.responseTime}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="xs" iconName="Eye">
                      View
                    </Button>
                    <Button variant="ghost" size="xs" iconName="Edit">
                      Edit
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between p-6 border-t border-border">
        <div className="text-sm text-muted-foreground">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedData?.length)} of {filteredAndSortedData?.length} incidents
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronLeft"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronRight"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IncidentDataTable;