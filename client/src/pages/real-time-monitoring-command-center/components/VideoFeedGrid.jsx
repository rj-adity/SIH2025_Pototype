import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VideoFeedGrid = ({ onCameraSelect, selectedCamera }) => {
  const [cameras, setCameras] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({});

  useEffect(() => {
    // Mock camera data
    const mockCameras = [
      {
        id: 'cam-001',
        name: 'Main Entrance',
        location: 'Downtown District',
        status: 'active',
        detections: {
          total: 12,
          female: 7,
          male: 5,
          alerts: 0
        },
        lastUpdate: new Date(),
        streamUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg'
      },
      {
        id: 'cam-002',
        name: 'Parking Area',
        location: 'Downtown District',
        status: 'active',
        detections: {
          total: 8,
          female: 3,
          male: 5,
          alerts: 1
        },
        lastUpdate: new Date(),
        streamUrl: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'
      },
      {
        id: 'cam-003',
        name: 'Corridor A',
        location: 'University Campus',
        status: 'active',
        detections: {
          total: 15,
          female: 9,
          male: 6,
          alerts: 0
        },
        lastUpdate: new Date(),
        streamUrl: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg'
      },
      {
        id: 'cam-004',
        name: 'Study Hall',
        location: 'University Campus',
        status: 'warning',
        detections: {
          total: 22,
          female: 13,
          male: 9,
          alerts: 2
        },
        lastUpdate: new Date(),
        streamUrl: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg'
      },
      {
        id: 'cam-005',
        name: 'Food Court',
        location: 'Shopping Complex',
        status: 'active',
        detections: {
          total: 28,
          female: 16,
          male: 12,
          alerts: 0
        },
        lastUpdate: new Date(),
        streamUrl: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg'
      },
      {
        id: 'cam-006',
        name: 'Platform 1',
        location: 'Transit Hub',
        status: 'error',
        detections: {
          total: 0,
          female: 0,
          male: 0,
          alerts: 0
        },
        lastUpdate: new Date(Date.now() - 300000),
        streamUrl: null
      }
    ];

    setCameras(mockCameras);

    // Simulate connection status updates
    const interval = setInterval(() => {
      const newStatus = {};
      mockCameras?.forEach(camera => {
        newStatus[camera.id] = Math.random() > 0.1 ? 'connected' : 'disconnected';
      });
      setConnectionStatus(newStatus);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'border-success';
      case 'warning': return 'border-warning';
      case 'error': return 'border-error';
      default: return 'border-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      default: return 'Circle';
    }
  };

  const handleCameraClick = (camera) => {
    onCameraSelect(camera);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Video" size={20} className="text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">Live Video Feeds</h2>
            <p className="text-sm text-muted-foreground">
              {cameras?.filter(c => c?.status === 'active')?.length} of {cameras?.length} cameras active
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName={isFullscreen ? "Minimize2" : "Maximize2"}
            onClick={toggleFullscreen}
          >
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </Button>
        </div>
      </div>
      <div className="p-4">
        <div className={`grid gap-4 ${isFullscreen ? 'grid-cols-3' : 'grid-cols-2 lg:grid-cols-3'}`}>
          {cameras?.map((camera) => (
            <div
              key={camera?.id}
              className={`
                relative bg-muted rounded-lg overflow-hidden cursor-pointer tactical-transition
                border-2 ${getStatusColor(camera?.status)}
                ${selectedCamera?.id === camera?.id ? 'ring-2 ring-primary' : ''}
                hover:tactical-shadow-primary
              `}
              onClick={() => handleCameraClick(camera)}
            >
              {/* Video Stream */}
              <div className="aspect-video relative">
                {camera?.streamUrl ? (
                  <img
                    src={camera?.streamUrl}
                    alt={camera?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <div className="text-center">
                      <Icon name="VideoOff" size={32} className="text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No Signal</p>
                    </div>
                  </div>
                )}

                {/* Status Indicator */}
                <div className="absolute top-2 left-2">
                  <div className={`
                    flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium
                    ${camera?.status === 'active' ? 'bg-success/20 text-success' : ''}
                    ${camera?.status === 'warning' ? 'bg-warning/20 text-warning' : ''}
                    ${camera?.status === 'error' ? 'bg-error/20 text-error' : ''}
                  `}>
                    <Icon name={getStatusIcon(camera?.status)} size={12} />
                    <span>{camera?.status?.toUpperCase()}</span>
                  </div>
                </div>

                {/* Connection Status */}
                <div className="absolute top-2 right-2">
                  <div className={`
                    w-3 h-3 rounded-full
                    ${connectionStatus?.[camera?.id] === 'connected' ? 'bg-success animate-pulse' : 'bg-error'}
                  `} />
                </div>

                {/* AI Detection Overlay */}
                {camera?.status === 'active' && camera?.detections?.total > 0 && (
                  <div className="absolute inset-0">
                    {/* Mock detection boxes */}
                    <div className="absolute top-1/4 left-1/4 w-16 h-20 border-2 border-primary rounded">
                      <div className="absolute -top-6 left-0 bg-primary text-primary-foreground text-xs px-1 rounded">
                        Female
                      </div>
                    </div>
                    <div className="absolute top-1/3 right-1/4 w-14 h-18 border-2 border-secondary rounded">
                      <div className="absolute -top-6 left-0 bg-secondary text-secondary-foreground text-xs px-1 rounded">
                        Male
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Info */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-foreground">{camera?.name}</h3>
                  <span className="text-xs text-muted-foreground font-mono">
                    {camera?.id}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>{camera?.location}</span>
                  <span>{camera?.lastUpdate?.toLocaleTimeString()}</span>
                </div>

                {/* Detection Stats */}
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-medium text-foreground">{camera?.detections?.total}</div>
                    <div className="text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-primary">{camera?.detections?.female}</div>
                    <div className="text-muted-foreground">Female</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-secondary">{camera?.detections?.male}</div>
                    <div className="text-muted-foreground">Male</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-medium ${camera?.detections?.alerts > 0 ? 'text-error' : 'text-success'}`}>
                      {camera?.detections?.alerts}
                    </div>
                    <div className="text-muted-foreground">Alerts</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoFeedGrid;