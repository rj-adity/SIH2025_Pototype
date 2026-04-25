import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertFeed = ({ onAlertAction }) => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  useEffect(() => {

    const fetchIncidents = async () => {

      try {

        const res = await fetch("http://127.0.0.1:8000/incidents");
        const data = await res.json();

        const formatted = data.incidents.map((i) => ({
          id: i.id,
          type: "violence",
          severity: "critical",
          title: "Violence Detected",
          description: `Confidence: ${(i.probability * 100).toFixed(2)}%`,
          location: i.camera,
          cameraId: i.camera,
          timestamp: i.timestamp ? new Date(i.timestamp) : new Date(),
          status: i.status || "active",
          assignedTo: null,
          actions: ["investigate"],
          image: i.image_url
        }));

        setAlerts(formatted);

      } catch (err) {
        console.error("Failed to fetch incidents", err);
      }

    };

    fetchIncidents();

    const interval = setInterval(fetchIncidents, 3000);

    // ------------------
    // REALTIME ALERT SOCKET
    // ------------------

    const ws = new WebSocket("ws://127.0.0.1:8000/ws/alerts");

    ws.onmessage = (event) => {

      const data = JSON.parse(event.data);

      const newAlert = {
        id: Date.now(),
        type: "violence",
        severity: "critical",
        title: "Violence Detected",
        description: `Confidence: ${(data.probability * 100).toFixed(2)}%`,
        location: data.camera,
        cameraId: data.camera,
        timestamp: new Date(),
        status: "active",
        assignedTo: null,
        actions: ["investigate"],
        image: data.image_url
      };

      setAlerts(prev => [newAlert, ...prev]);

    };

    return () => {
      clearInterval(interval);
      ws.close();
    };



  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'border-error bg-error/5 text-error';
      case 'warning': return 'border-warning bg-warning/5 text-warning';
      case 'medium': return 'border-accent bg-accent/5 text-accent';
      case 'low': return 'border-muted bg-muted/5 text-muted-foreground';
      default: return 'border-muted bg-muted/5 text-muted-foreground';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return 'AlertTriangle';
      case 'warning': return 'AlertCircle';
      case 'medium': return 'Info';
      case 'low': return 'Bell';
      default: return 'Bell';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-error';
      case 'investigating': return 'text-warning';
      case 'acknowledged': return 'text-accent';
      case 'resolved': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'gesture_detection': return 'Hand';
      case 'crowd_density': return 'Users';
      case 'behavioral_anomaly': return 'Eye';
      case 'system_alert': return 'Settings';
      case 'safety_violation': return 'Shield';
      default: return 'Bell';
    }
  };

  const filteredAlerts = alerts?.filter(alert => {

  if (alert.status === "resolved") return false;

  if (filter === 'all') return true;
  if (filter === 'active') return alert?.status === 'active';
  if (filter === 'critical') return alert?.severity === 'critical';

  return alert?.severity === filter;
});

  const handleAlertAction = async (alert, action) => {

    onAlertAction(alert, action);

    // decide new status
    let newStatus = "active";

    if (action === "resolve") newStatus = "resolved";
    if (action === "investigate") newStatus = "investigating";

    try {

      await fetch(`http://127.0.0.1:8000/update_incident_status/${alert.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: newStatus
        })
      });

    } catch (err) {
      console.error("Failed to update incident status", err);
    }

    // update UI
    setAlerts(prev => prev.map(a =>
      a.id === alert.id ? { ...a, status: newStatus } : a
    ));

  };

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Bell" size={20} className="text-primary" />

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Real-Time Alerts
            </h2>

            <p className="text-sm text-muted-foreground">
              {filteredAlerts?.filter(a => a?.status === 'active')?.length} active alerts
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={isAutoScroll ? "default" : "outline"}
            size="sm"
            iconName="RotateCcw"
            onClick={() => setIsAutoScroll(!isAutoScroll)}
          >
            Auto
          </Button>
        </div>
      </div>


      {/* Filter Tabs */}
      <div className="flex items-center space-x-1 p-4 border-b border-border">
        {['all', 'active', 'critical', 'warning', 'medium']?.map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`
        px-3 py-1 text-xs font-medium rounded tactical-transition
        ${filter === filterOption
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'}
      `}
          >
            {filterOption?.charAt(0)?.toUpperCase() + filterOption?.slice(1)}

            {filterOption === 'active' && (
              <span className="ml-1 bg-error text-error-foreground rounded-full px-1 text-xs">
                {alerts?.filter(a => a?.status === 'active')?.length}
              </span>
            )}
          </button>
        ))}
      </div>


      {/* Alert List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-4">

          {filteredAlerts?.map((alert) => (

            <div
              key={alert?.id}
              className={`
          border rounded-lg p-4 tactical-transition hover:tactical-shadow-primary
          ${getSeverityColor(alert?.severity)}
        `}
            >

              <div className="flex items-start justify-between mb-3">

                <div className="flex items-center space-x-3">

                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getSeverityColor(alert?.severity)}`}>
                    <Icon name={getTypeIcon(alert?.type)} size={16} />
                  </div>

                  <div className="flex-1">

                    <div className="flex items-center space-x-2 mb-1">

                      <h3 className="font-medium text-foreground">
                        {alert?.title}
                      </h3>

                      <div className={`flex items-center space-x-1 ${getSeverityColor(alert?.severity)}`}>
                        <Icon name={getSeverityIcon(alert?.severity)} size={12} />
                        <span className="text-xs font-medium uppercase">
                          {alert?.severity}
                        </span>
                      </div>

                    </div>


                    <p className="text-sm text-muted-foreground mb-2">
                      {alert?.description}
                    </p>


                    {/* Incident Image */}
                    {alert?.image && (
                      <img
                        src={alert.image}
                        alt="incident"
                        className="rounded-md border mt-2 mb-2 w-full max-h-48 object-cover"
                      />
                    )}


                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">

                      <div className="flex items-center space-x-1">
                        <Icon name="MapPin" size={12} />
                        <span>{alert?.location}</span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={12} />
                        <span>{alert?.timestamp?.toLocaleTimeString()}</span>
                      </div>

                    </div>

                  </div>
                </div>


                <div className={`text-xs font-medium ${getStatusColor(alert?.status)}`}>
                  {alert?.status?.toUpperCase()}
                </div>

              </div>


              {/* Assignment Info */}
              {alert?.assignedTo && (
                <div className="flex items-center space-x-2 mb-3 text-xs text-muted-foreground">
                  <Icon name="User" size={12} />
                  <span>Assigned to: {alert?.assignedTo}</span>
                </div>
              )}


              {/* Action Buttons */}
              <div className="flex items-center space-x-2">

                {alert?.status === 'active' && (
                  <>
                    <Button
                      variant="destructive"
                      size="xs"
                      iconName="AlertTriangle"
                      onClick={() => handleAlertAction(alert, 'escalate')}
                    >
                      Escalate
                    </Button>

                    <Button
                      variant="warning"
                      size="xs"
                      iconName="Eye"
                      onClick={() => handleAlertAction(alert, 'investigate')}
                    >
                      Investigate
                    </Button>

                    <Button
                      variant="success"
                      size="xs"
                      iconName="Check"
                      onClick={() => handleAlertAction(alert, 'resolve')}
                    >
                      Resolve
                    </Button>
                  </>
                )}

                <Button
                  variant="outline"
                  size="xs"
                  iconName="ExternalLink"
                  onClick={() => handleAlertAction(alert, 'view_details')}
                >
                  Details
                </Button>

              </div>

            </div>

          ))}

        </div>
      </div>
    </div>
  );
};

export default AlertFeed;