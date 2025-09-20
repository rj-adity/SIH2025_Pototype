import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const StatusCard = ({ title, value, subtitle, icon, color, trend, countdownTarget, isCountdown = false }) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [countdown, setCountdown] = useState(countdownTarget || 0);

  useEffect(() => {
    if (isCountdown && countdownTarget) {
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 0) {
            return countdownTarget;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isCountdown, countdownTarget]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isCountdown) {
        const variation = Math.floor(Math.random() * 3) - 1;
        setCurrentValue(prev => Math.max(0, prev + variation));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isCountdown]);

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getColorClasses = (colorType) => {
    const colors = {
      primary: {
        text: 'text-primary',
        bg: 'bg-primary/10',
        border: 'border-primary',
        icon: 'text-primary'
      },
      success: {
        text: 'text-success',
        bg: 'bg-success/10',
        border: 'border-success',
        icon: 'text-success'
      },
      warning: {
        text: 'text-warning',
        bg: 'bg-warning/10',
        border: 'border-warning',
        icon: 'text-warning'
      },
      error: {
        text: 'text-error',
        bg: 'bg-error/10',
        border: 'border-error',
        icon: 'text-error'
      }
    };
    return colors?.[colorType] || colors?.primary;
  };

  const colorClasses = getColorClasses(color);

  return (
    <div className={`bg-card border ${colorClasses?.border} rounded-lg p-6 tactical-shadow-secondary tactical-transition hover:tactical-shadow-primary`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${colorClasses?.bg} rounded-lg flex items-center justify-center`}>
          <Icon name={icon} size={24} className={colorClasses?.icon} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${trend > 0 ? 'text-success' : trend < 0 ? 'text-error' : 'text-muted-foreground'}`}>
            <Icon name={trend > 0 ? 'TrendingUp' : trend < 0 ? 'TrendingDown' : 'Minus'} size={16} />
            <span className="text-sm font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </h3>
        
        <div className={`text-3xl font-bold ${colorClasses?.text}`}>
          {isCountdown ? formatCountdown(countdown) : currentValue}
        </div>
        
        <p className="text-sm text-muted-foreground">
          {subtitle}
        </p>
      </div>
      {/* Progress indicator for countdown */}
      {isCountdown && countdownTarget && (
        <div className="mt-4">
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${colorClasses?.bg} transition-all duration-1000`}
              style={{ width: `${((countdownTarget - countdown) / countdownTarget) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
      {/* Capacity indicator */}
      {!isCountdown && (
        <div className="mt-4 flex items-center space-x-2">
          <div className="flex-1 bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${colorClasses?.bg} transition-all duration-500`}
              style={{ width: `${Math.min(100, (currentValue / (currentValue + 10)) * 100)}%` }}
            ></div>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {Math.min(100, Math.round((currentValue / (currentValue + 10)) * 100))}%
          </span>
        </div>
      )}
    </div>
  );
};

export default StatusCard;