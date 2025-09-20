import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ComplianceDeadlines = () => {
  const deadlines = [
    {
      id: 1,
      title: 'Monthly Safety Report',
      description: 'Comprehensive safety analytics report for regulatory submission',
      dueDate: '2025-01-31',
      priority: 'high',
      status: 'pending',
      department: 'Safety Management',
      estimatedHours: 8
    },
    {
      id: 2,
      title: 'Quarterly Incident Analysis',
      description: 'Detailed analysis of Q4 2024 safety incidents and trends',
      dueDate: '2025-02-15',
      priority: 'medium',
      status: 'in-progress',
      department: 'Analytics Team',
      estimatedHours: 16
    },
    {
      id: 3,
      title: 'Annual Safety Audit',
      description: 'Complete safety infrastructure and protocol audit',
      dueDate: '2025-03-01',
      priority: 'critical',
      status: 'not-started',
      department: 'Compliance Office',
      estimatedHours: 40
    },
    {
      id: 4,
      title: 'Emergency Response Drill Report',
      description: 'Documentation of emergency response training effectiveness',
      dueDate: '2025-02-05',
      priority: 'medium',
      status: 'pending',
      department: 'Emergency Response',
      estimatedHours: 6
    },
    {
      id: 5,
      title: 'Technology Compliance Review',
      description: 'Assessment of surveillance and monitoring system compliance',
      dueDate: '2025-02-20',
      priority: 'high',
      status: 'not-started',
      department: 'IT Security',
      estimatedHours: 12
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-error border-error bg-error/10';
      case 'high': return 'text-warning border-warning bg-warning/10';
      case 'medium': return 'text-secondary border-secondary bg-secondary/10';
      default: return 'text-muted-foreground border-border bg-muted/10';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress': return 'text-warning';
      case 'pending': return 'text-muted-foreground';
      case 'not-started': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in-progress': return 'Clock';
      case 'pending': return 'AlertCircle';
      case 'not-started': return 'Circle';
      default: return 'Circle';
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const sortedDeadlines = deadlines?.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div className="bg-card border border-border rounded-lg p-6 tactical-shadow-secondary">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Compliance Deadlines</h3>
          <p className="text-sm text-muted-foreground">
            {deadlines?.filter(d => getDaysUntilDue(d?.dueDate) <= 7)?.length} urgent deadlines
          </p>
        </div>
        <Button variant="outline" size="sm" iconName="Calendar">
          View All
        </Button>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {sortedDeadlines?.map((deadline) => {
          const daysUntilDue = getDaysUntilDue(deadline?.dueDate);
          const isUrgent = daysUntilDue <= 7;
          
          return (
            <div 
              key={deadline?.id}
              className={`p-4 rounded-lg border tactical-transition hover:bg-muted/50 ${getPriorityColor(deadline?.priority)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-foreground mb-1 truncate">
                    {deadline?.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {deadline?.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-3">
                  <Icon 
                    name={getStatusIcon(deadline?.status)} 
                    size={14} 
                    className={getStatusColor(deadline?.status)}
                  />
                  {isUrgent && (
                    <Icon name="AlertTriangle" size={14} className="text-error animate-pulse" />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-4">
                  <span className="text-muted-foreground">
                    Due: {new Date(deadline.dueDate)?.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="text-muted-foreground">
                    {deadline?.estimatedHours}h estimated
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${
                    daysUntilDue < 0 ? 'text-error' : 
                    daysUntilDue <= 3 ? 'text-warning': 'text-foreground'
                  }`}>
                    {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                     daysUntilDue === 0 ? 'Due today' :
                     `${daysUntilDue} days left`}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                <span className="text-xs text-muted-foreground">
                  {deadline?.department}
                </span>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="xs" iconName="Eye">
                    View
                  </Button>
                  <Button variant="ghost" size="xs" iconName="Edit">
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <Button variant="primary" size="sm" iconName="Plus" fullWidth>
          Add Deadline
        </Button>
      </div>
    </div>
  );
};

export default ComplianceDeadlines;