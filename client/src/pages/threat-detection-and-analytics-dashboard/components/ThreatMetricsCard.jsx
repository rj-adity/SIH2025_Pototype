import React from 'react';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const ThreatMetricsCard = ({
  title,
  value,
  unit,
  trend,
  trendValue,
  icon,
  color = 'primary'
}) => {
  const colorClasses = {
    primary: 'text-primary border-primary/20 bg-primary/5',
    success: 'text-success border-success/20 bg-success/5',
    warning: 'text-warning border-warning/20 bg-warning/5',
    danger: 'text-danger border-danger/20 bg-danger/5'
  };

  const trendIcon = trend === 'up' ? 'TrendingUp' : 'TrendingDown';
  const trendColor = trend === 'up' ? 'text-success' : 'text-danger';

  return (
    <div className={cn(
      "bg-card border border-border rounded-lg p-6 tactical-shadow-secondary hover:tactical-shadow-primary transition-shadow",
      colorClasses[color]
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
          <Icon name={icon} size={24} color={`var(--color-${color})`} />
        </div>
        <div className={cn("flex items-center space-x-1 text-sm font-medium", trendColor)}>
          <Icon name={trendIcon} size={16} />
          <span>{trendValue}</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-bold text-foreground">
          {value}
          <span className="text-sm font-normal text-muted-foreground ml-1">
            {unit}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          {title}
        </div>
      </div>
    </div>
  );
};

export default ThreatMetricsCard;
