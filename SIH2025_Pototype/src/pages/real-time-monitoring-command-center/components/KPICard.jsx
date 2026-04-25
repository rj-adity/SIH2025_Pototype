import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  status, 
  trend, 
  onClick, 
  sihMode = false, 
  description 
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'text-success border-success/20 bg-success/5';
      case 'warning': return 'text-warning border-warning/20 bg-warning/5';
      case 'error': return 'text-error border-error/20 bg-error/5';
      default: return 'text-primary border-primary/20 bg-primary/5';
    }
  };

  const getTrendIcon = () => {
    if (trend > 0) return 'TrendingUp';
    if (trend < 0) return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (trend > 0) return 'text-success';
    if (trend < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div 
      className={`
        bg-card border rounded-lg p-6 tactical-transition cursor-pointer relative overflow-hidden
        hover:tactical-shadow-primary hover:border-primary/30
        ${getStatusColor()}
        ${sihMode ? 'border-primary/30 bg-gradient-to-br from-card to-primary/5' : ''}
      `}
      onClick={onClick}
      title={sihMode ? description : ''}
    >
      {/* SIH2025 Badge */}
      {sihMode && (
        <div className="absolute top-2 right-2 bg-primary/10 border border-primary/30 rounded px-2 py-1 text-xs text-primary font-medium">
          AI
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            sihMode ? 'bg-gradient-to-br from-primary to-secondary text-white' : getStatusColor()
          }`}>
            <Icon name={icon} size={20} />
          </div>
          <div>
            <h3 className={`text-sm font-medium ${sihMode ? 'text-primary' : 'text-muted-foreground'}`}>
              {title}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`text-2xl font-bold ${sihMode ? 'text-foreground' : 'text-foreground'}`}>
                {value}
              </span>
              {trend !== undefined && (
                <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
                  <Icon name={getTrendIcon()} size={14} />
                  <span className="text-xs font-medium">{Math.abs(trend)?.toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-xs ${sihMode ? 'text-primary' : 'text-muted-foreground'}`}>
            {subtitle}
          </div>
          <div className="text-xs font-mono text-muted-foreground mt-1">
            {new Date()?.toLocaleTimeString()}
          </div>
          {sihMode && (
            <div className="flex items-center space-x-1 mt-1">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-xs text-success font-medium">LIVE</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className={`text-xs font-medium ${
          sihMode ? 'text-primary' : getStatusColor()?.split(' ')?.[0]
        }`}>
          {sihMode ? (
            <span className="flex items-center space-x-1">
              <Icon name="Cpu" size={10} />
              <span>AI Powered</span>
            </span>
          ) : (
            <>
              {status === 'success' && 'Normal'}
              {status === 'warning' && 'Attention'}
              {status === 'error' && 'Critical'}
              {status === 'info' && 'Monitoring'}
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {sihMode && (
            <div className="bg-primary/10 rounded px-2 py-1">
              <span className="text-xs text-primary font-mono">ML</span>
            </div>
          )}
          <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
        </div>
      </div>

      {/* Enhanced Progress Bar for SIH */}
      <div className="mt-3 space-y-2">
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full ${sihMode ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-primary'} transition-all duration-1000`}
            style={{ 
              width: sihMode 
                ? `${Math.min(100, Math.max(20, (trend + 50)))}%` 
                : `${Math.abs(trend) * 2}%` 
            }}
          />
        </div>
        {sihMode && description && (
          <div className="text-xs text-muted-foreground">
            {description}
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;