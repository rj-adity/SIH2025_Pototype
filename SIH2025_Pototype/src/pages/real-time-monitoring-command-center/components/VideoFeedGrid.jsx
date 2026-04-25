import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SERVER_URL = window.SERVER_URL;
function hexToBase64(hex) {

  let binary = "";

  for (let i = 0; i < hex.length; i += 2) {
    binary += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }

  return btoa(binary);
}

const VideoFeedGrid = ({ onCameraSelect, selectedCamera }) => {

  const [cameras, setCameras] = useState([]);
  const [frames, setFrames] = useState({});
  const [genders, setGenders] = useState({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({});
  const [violenceDetected, setViolenceDetected] = useState(false);

  useEffect(() => {

    const cameraList = [
      { id: "main_entrance", name: "Main Entrance", location: "Building A", status: "active", lastUpdate: new Date() },
      { id: "parking", name: "Parking Area", location: "Building A", status: "active", lastUpdate: new Date() },
      { id: "corridor", name: "Corridor", location: "Floor 2", status: "active", lastUpdate: new Date() },
      { id: "library", name: "Library", location: "Floor 3", status: "active", lastUpdate: new Date() },
      { id: "food_court", name: "Food Court", location: "Campus Center", status: "active", lastUpdate: new Date() },
      { id: "platform", name: "Platform", location: "Transit Area", status: "active", lastUpdate: new Date() }
    ];

    setCameras(cameraList);

  }, []);


  // -------- CAMERA FRAME POLLING --------
  useEffect(() => {


    const fetchFrames = async () => {

  if (cameras.length === 0) return;

  const newFrames = {};
  const newGenders = {};

  await Promise.all(
    cameras.map(async (cam) => {

      try {

        const res = await fetch(`${SERVER_URL}/camera_feed/${cam.id}`);

        if (!res.ok) return;

        const data = await res.json();

        if (data.status === "online" && data.frame) {
          newFrames[cam.id] = data.frame;
          newGenders[cam.id] = data.gender || "Unknown";
        }

      } catch {
        // ignore offline camera
      }

    })
  );

  setFrames(newFrames);
  setGenders(newGenders);

};

    const interval = setInterval(fetchFrames, 200);

    return () => clearInterval(interval);

  }, [cameras]);


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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (

    <div className={`bg-card border border-border rounded-lg ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>

      <div className="flex items-center justify-between p-4 border-b border-border">

        <div className="flex items-center space-x-3">
          <Icon name="Video" size={20} className="text-primary" />

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Live Video Feeds
            </h2>

            <p className="text-sm text-muted-foreground">
              {cameras.length} Cameras
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          iconName={isFullscreen ? "Minimize2" : "Maximize2"}
          onClick={toggleFullscreen}
        >
          {isFullscreen ? 'Exit' : 'Fullscreen'}
        </Button>

      </div>

      <div className="p-4">

        <div className={`grid gap-4 ${isFullscreen ? 'grid-cols-3' : 'grid-cols-2 lg:grid-cols-3'}`}>

          {cameras.map((camera) => (

            <div
              key={camera.id}
              className={`relative bg-muted rounded-lg overflow-hidden border-2 ${getStatusColor(camera.status)}`}
            >

              <div className="aspect-video relative">

                {frames[camera.id] ? (

                  <>
                    <img
                      src={`data:image/jpeg;base64,${frames[camera.id]}`}
                      className="w-full h-full object-cover"
                      alt="camera"
                    />

                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                      {genders[camera.id] || "Detecting..."}
                    </div>
                  </>

                ) : (

                  <div className="w-full h-full flex items-center justify-center bg-muted">

                    <div className="text-center">

                      <Icon
                        name="VideoOff"
                        size={32}
                        className="text-muted-foreground mx-auto mb-2"
                      />

                      <p className="text-sm text-muted-foreground">
                        Waiting for camera...
                      </p>

                    </div>

                  </div>

                )}

              </div>

              <div className="p-3">

                <div className="flex items-center justify-between mb-2">

                  <h3 className="font-medium text-foreground">
                    {camera.name}
                  </h3>

                  <span className="text-xs text-muted-foreground font-mono">
                    {camera.id}
                  </span>

                </div>

                <div className="text-xs text-muted-foreground">
                  {camera.location}
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