import React from 'react';
import Icon from '../../../components/AppIcon';

const SafetyKPICard = ({ title, value, change, changeType, icon, trend, benchmark }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-warning';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 tactical-shadow-secondary">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={icon} size={20} className="text-primary" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
        <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
          <Icon name={getChangeIcon()} size={16} />
          <span className="text-sm font-medium">{change}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        
        {trend && (
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${trend}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{trend}%</span>
          </div>
        )}
        
        {benchmark && (
          <div className="text-xs text-muted-foreground">
            Benchmark: <span className="text-foreground font-medium">{benchmark}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SafetyKPICard;