import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SafetyAuditChecklist = () => {
  const [checkedItems, setCheckedItems] = useState(new Set());

  const auditItems = [
    {
      id: 'emergency-exits',
      category: 'Infrastructure',
      item: 'Emergency Exit Accessibility',
      status: 'completed',
      dueDate: '2025-01-15',
      priority: 'high'
    },
    {
      id: 'lighting-systems',
      category: 'Infrastructure',
      item: 'Lighting System Functionality',
      status: 'pending',
      dueDate: '2025-01-20',
      priority: 'medium'
    },
    {
      id: 'camera-coverage',
      category: 'Surveillance',
      item: 'Camera Coverage Assessment',
      status: 'in-progress',
      dueDate: '2025-01-25',
      priority: 'high'
    },
    {
      id: 'staff-training',
      category: 'Personnel',
      item: 'Security Staff Training Records',
      status: 'overdue',
      dueDate: '2025-01-10',
      priority: 'critical'
    },
    {
      id: 'communication-systems',
      category: 'Technology',
      item: 'Emergency Communication Systems',
      status: 'completed',
      dueDate: '2025-01-18',
      priority: 'high'
    },
    {
      id: 'incident-protocols',
      category: 'Procedures',
      item: 'Incident Response Protocol Review',
      status: 'pending',
      dueDate: '2025-01-30',
      priority: 'medium'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'in-progress': return 'text-warning';
      case 'pending': return 'text-muted-foreground';
      case 'overdue': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'in-progress': return 'Clock';
      case 'pending': return 'Circle';
      case 'overdue': return 'AlertCircle';
      default: return 'Circle';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-error text-error-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const toggleCheck = (itemId) => {
    const newChecked = new Set(checkedItems);
    if (newChecked?.has(itemId)) {
      newChecked?.delete(itemId);
    } else {
      newChecked?.add(itemId);
    }
    setCheckedItems(newChecked);
  };

  const completedCount = auditItems?.filter(item => item?.status === 'completed')?.length;
  const totalCount = auditItems?.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-card border border-border rounded-lg p-6 tactical-shadow-secondary">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Safety Audit Checklist</h3>
          <p className="text-sm text-muted-foreground">
            {completedCount} of {totalCount} items completed ({completionPercentage}%)
          </p>
        </div>
        <Button variant="outline" size="sm" iconName="Download">
          Export
        </Button>
      </div>
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progress</span>
          <span className="text-foreground font-medium">{completionPercentage}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {auditItems?.map((item) => (
          <div 
            key={item?.id}
            className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg hover:bg-muted tactical-transition"
          >
            <button
              onClick={() => toggleCheck(item?.id)}
              className="mt-0.5 tactical-transition"
            >
              <Icon 
                name={checkedItems?.has(item?.id) ? 'CheckSquare' : 'Square'} 
                size={16} 
                className={checkedItems?.has(item?.id) ? 'text-primary' : 'text-muted-foreground'}
              />
            </button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {item?.item}
                </h4>
                <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(item?.priority)}`}>
                  {item?.priority}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{item?.category}</span>
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={getStatusIcon(item?.status)} 
                    size={14} 
                    className={getStatusColor(item?.status)}
                  />
                  <span className={`text-xs ${getStatusColor(item?.status)}`}>
                    {item?.status?.replace('-', ' ')}
                  </span>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground mt-1">
                Due: {new Date(item.dueDate)?.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex space-x-2">
          <Button variant="primary" size="sm" iconName="Plus" fullWidth>
            Add Item
          </Button>
          <Button variant="outline" size="sm" iconName="RefreshCw" fullWidth>
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SafetyAuditChecklist;