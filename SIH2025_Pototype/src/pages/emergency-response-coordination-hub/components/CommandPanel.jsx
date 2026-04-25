import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CommandPanel = () => {
  const [activeTab, setActiveTab] = useState('incidents');
  const [draggedItem, setDraggedItem] = useState(null);

  const incidents = [
    {
      id: 1,
      priority: 1,
      type: 'Emergency SOS',
      location: 'Shopping Complex',
      time: '2 min ago',
      status: 'responding',
      severity: 'critical',
      assignedUnits: 3
    },
    {
      id: 2,
      priority: 2,
      type: 'Harassment Report',
      location: 'Downtown District',
      time: '5 min ago',
      status: 'active',
      severity: 'high',
      assignedUnits: 2
    },
    {
      id: 3,
      priority: 3,
      type: 'Suspicious Activity',
      location: 'University Campus',
      time: '10 min ago',
      status: 'investigating',
      severity: 'medium',
      assignedUnits: 1
    },
    {
      id: 4,
      priority: 4,
      type: 'Safety Concern',
      location: 'Transit Hub',
      time: '15 min ago',
      status: 'pending',
      severity: 'low',
      assignedUnits: 0
    }
  ];

  const resources = [
    {
      id: 'patrol-01',
      type: 'Patrol Unit',
      status: 'available',
      location: 'Downtown District',
      eta: 'Ready',
      officer: 'Officer Martinez'
    },
    {
      id: 'patrol-02',
      type: 'Patrol Unit',
      status: 'responding',
      location: 'En route to Shopping Complex',
      eta: '2 min',
      officer: 'Officer Chen'
    },
    {
      id: 'medical-01',
      type: 'Medical Unit',
      status: 'available',
      location: 'Central Station',
      eta: 'Ready',
      officer: 'Paramedic Johnson'
    },
    {
      id: 'k9-01',
      type: 'K9 Unit',
      status: 'deployed',
      location: 'University Campus',
      eta: 'On scene',
      officer: 'Officer Rodriguez'
    }
  ];

  const communications = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 120000),
      sender: 'Unit-07',
      message: 'Arrived at scene, situation under control',
      type: 'status'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 180000),
      sender: 'Dispatch',
      message: 'Medical unit requested at Shopping Complex',
      type: 'request'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 240000),
      sender: 'Unit-03',
      message: 'Suspect detained, requesting backup',
      type: 'alert'
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 300000),
      sender: 'Command',
      message: 'All units, be advised: increased patrol in downtown area',
      type: 'broadcast'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'border-l-error bg-error/5';
      case 'high': return 'border-l-warning bg-warning/5';
      case 'medium': return 'border-l-primary bg-primary/5';
      case 'low': return 'border-l-success bg-success/5';
      default: return 'border-l-muted bg-muted/5';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-success';
      case 'responding': return 'text-warning';
      case 'deployed': return 'text-primary';
      case 'offline': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getMessageTypeIcon = (type) => {
    switch (type) {
      case 'status': return 'CheckCircle';
      case 'request': return 'HelpCircle';
      case 'alert': return 'AlertTriangle';
      case 'broadcast': return 'Radio';
      default: return 'MessageCircle';
    }
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetItem) => {
    e?.preventDefault();
    if (draggedItem && draggedItem?.id !== targetItem?.id) {
      // Handle priority reordering logic here
      console.log(`Reordering: ${draggedItem?.id} -> ${targetItem?.id}`);
    }
    setDraggedItem(null);
  };

  return (
    <div className="bg-card border border-border rounded-lg tactical-shadow-secondary h-full">
      {/* Panel Header */}
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground mb-3">Command Center</h3>
        <div className="flex space-x-1">
          {[
            { id: 'incidents', label: 'Incident Queue', icon: 'AlertTriangle' },
            { id: 'resources', label: 'Resources', icon: 'Users' },
            { id: 'comms', label: 'Communications', icon: 'Radio' }
          ]?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg text-sm tactical-transition
                ${activeTab === tab?.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
            >
              <Icon name={tab?.icon} size={14} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Panel Content */}
      <div className="p-4 h-96 overflow-y-auto">
        {/* Incident Queue */}
        {activeTab === 'incidents' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Priority Queue</span>
              <Button variant="outline" size="sm" iconName="ArrowUpDown">
                Sort
              </Button>
            </div>
            {incidents?.map((incident) => (
              <div
                key={incident?.id}
                draggable
                onDragStart={(e) => handleDragStart(e, incident)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, incident)}
                className={`
                  p-3 rounded-lg border-l-4 cursor-move tactical-transition hover:tactical-shadow-primary
                  ${getSeverityColor(incident?.severity)}
                  ${draggedItem?.id === incident?.id ? 'opacity-50' : ''}
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      {incident?.priority}
                    </span>
                    <span className="font-medium text-foreground">{incident?.type}</span>
                  </div>
                  <Button variant="ghost" size="sm" iconName="MoreVertical" />
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="text-foreground">{incident?.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="text-foreground capitalize">{incident?.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Units:</span>
                    <span className="text-foreground">{incident?.assignedUnits} assigned</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="text-foreground">{incident?.time}</span>
                  </div>
                </div>

                <div className="flex space-x-2 mt-3">
                  <Button variant="outline" size="sm" iconName="UserPlus">
                    Assign
                  </Button>
                  <Button variant="outline" size="sm" iconName="MessageSquare">
                    Contact
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resources */}
        {activeTab === 'resources' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Available Resources</span>
              <Button variant="outline" size="sm" iconName="Filter">
                Filter
              </Button>
            </div>
            {resources?.map((resource) => (
              <div key={resource?.id} className="p-3 bg-muted rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(resource?.status) === 'text-success' ? 'bg-success' : getStatusColor(resource?.status) === 'text-warning' ? 'bg-warning' : getStatusColor(resource?.status) === 'text-primary' ? 'bg-primary' : 'bg-error'}`}></div>
                    <span className="font-medium text-foreground">{resource?.type}</span>
                  </div>
                  <span className={`text-sm font-medium ${getStatusColor(resource?.status)}`}>
                    {resource?.status?.toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Officer:</span>
                    <span className="text-foreground">{resource?.officer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="text-foreground">{resource?.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ETA:</span>
                    <span className="text-foreground">{resource?.eta}</span>
                  </div>
                </div>

                <div className="flex space-x-2 mt-3">
                  <Button variant="outline" size="sm" iconName="MapPin">
                    Track
                  </Button>
                  <Button variant="outline" size="sm" iconName="Phone">
                    Contact
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Communications */}
        {activeTab === 'comms' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Communication Log</span>
              <Button variant="outline" size="sm" iconName="Send">
                Broadcast
              </Button>
            </div>
            {communications?.map((comm) => (
              <div key={comm?.id} className="p-3 bg-muted rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon name={getMessageTypeIcon(comm?.type)} size={16} className="text-primary" />
                    <span className="font-medium text-foreground">{comm?.sender}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {comm?.timestamp?.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{comm?.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommandPanel;