import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const SIH2025Showcase = () => {
  const [currentMetric, setCurrentMetric] = useState(0);
  const [demoMode, setDemoMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const sihMetrics = [
    { label: 'Women Safety Score', value: '92.5%', trend: '+8.3%', icon: 'Shield' },
    { label: 'Real-time Monitoring', value: '24/7', trend: 'Active', icon: 'Eye' },
    { label: 'Incident Response', value: '<2min', trend: '-45%', icon: 'Clock' },
    { label: 'Coverage Areas', value: '150+', trend: '+25%', icon: 'MapPin' }
  ];

  const sihFeatures = [
    {
      title: 'AI-Powered Threat Detection',
      description: 'Advanced computer vision and machine learning algorithms for real-time threat identification',
      icon: 'Brain',
      status: 'Active',
      demo: '/threat-detection-and-analytics-dashboard'
    },
    {
      title: 'Real-time Monitoring Network',
      description: 'Comprehensive surveillance system with live video feeds and instant alert mechanisms',
      icon: 'Monitor',
      status: 'Live',
      demo: '/real-time-monitoring-command-center'
    },
    {
      title: 'Emergency Response Hub',
      description: 'Coordinated emergency response with automated resource allocation and communication',
      icon: 'AlertTriangle',
      status: 'Ready',
      demo: '/emergency-response-coordination-hub'
    },
    {
      title: 'Analytics & Reporting',
      description: 'Comprehensive data analytics with predictive insights and compliance reporting',
      icon: 'BarChart3',
      status: 'Generating',
      demo: '/safety-analytics-and-reporting-center'
    }
  ];

  const teamInfo = {
    teamName: 'SafeTech Innovators',
    teamId: 'SIH2025_WS_001',
    problemStatement: 'PS001: Smart Women Safety Analytics System',
    category: 'Smart Automation',
    institute: 'Technology Institute of Excellence'
  };

  const techStack = [
    { name: 'React.js', type: 'Frontend', icon: 'Code' },
    { name: 'Node.js', type: 'Backend', icon: 'Server' },
    { name: 'TensorFlow', type: 'AI/ML', icon: 'Brain' },
    { name: 'MongoDB', type: 'Database', icon: 'Database' },
    { name: 'WebRTC', type: 'Video Stream', icon: 'Video' },
    { name: 'Socket.io', type: 'Real-time', icon: 'Zap' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      setCurrentMetric((prev) => (prev + 1) % sihMetrics?.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleDemoMode = () => {
    setDemoMode(true);
    setTimeout(() => setDemoMode(false), 10000);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': case'live':
        return 'text-success bg-success/10 border-success/30';
      case 'ready':
        return 'text-primary bg-primary/10 border-primary/30';
      case 'generating':
        return 'text-warning bg-warning/10 border-warning/30';
      default:
        return 'text-muted-foreground bg-muted/10 border-muted/30';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Demo Mode Overlay */}
      {demoMode && (
        <div className="fixed inset-0 z-50 bg-primary/20 backdrop-blur-sm animate-pulse">
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card border-2 border-primary rounded-lg p-6 tactical-shadow-primary">
            <div className="flex items-center space-x-3">
              <Icon name="Play" size={24} className="text-primary animate-spin" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">DEMO MODE ACTIVE</h3>
                <p className="text-sm text-muted-foreground">Showcasing SIH2025 Women Safety Analytics</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          
          {/* SIH2025 Header Banner */}
          <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border border-primary/20 rounded-xl p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-full -ml-12 -mb-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                    <Icon name="Award" size={32} color="white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-foreground mb-2">Smart India Hackathon 2025</h1>
                    <p className="text-xl text-primary font-semibold">Women Safety Analytics System</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-muted-foreground font-mono">
                    {currentTime?.toLocaleDateString()} • {currentTime?.toLocaleTimeString()}
                  </div>
                  <div className="text-lg font-semibold text-primary">{teamInfo?.teamId}</div>
                </div>
              </div>

              {/* Team Information Card */}
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Team Name</div>
                    <div className="font-semibold text-foreground">{teamInfo?.teamName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Problem Statement</div>
                    <div className="font-semibold text-foreground">{teamInfo?.problemStatement}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Category</div>
                    <div className="font-semibold text-foreground">{teamInfo?.category}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Institute</div>
                    <div className="font-semibold text-foreground">{teamInfo?.institute}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sihMetrics?.map((metric, index) => (
              <div 
                key={index}
                className={`
                  bg-card border rounded-xl p-6 tactical-transition cursor-pointer
                  ${currentMetric === index 
                    ? 'border-primary bg-primary/5 tactical-glow' :'border-border hover:border-primary/30'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    currentMetric === index ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    <Icon name={metric?.icon} size={24} />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">{metric?.value}</div>
                    <div className="text-xs text-success">{metric?.trend}</div>
                  </div>
                </div>
                <div className="text-sm font-medium text-muted-foreground">{metric?.label}</div>
                <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-primary transition-all duration-3000 ${
                      currentMetric === index ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* System Features Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">System Capabilities</h2>
              <Button
                variant="outline"
                onClick={handleDemoMode}
                iconName="Play"
                iconPosition="left"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Start Demo
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sihFeatures?.map((feature, index) => (
                <Link
                  key={index}
                  to={feature?.demo}
                  className="group bg-card border border-border rounded-xl p-6 tactical-transition hover:border-primary/50 hover:tactical-shadow-primary block"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground tactical-transition">
                        <Icon name={feature?.icon} size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary tactical-transition">
                          {feature?.title}
                        </h3>
                        <div className={`inline-flex items-center space-x-1 text-xs px-2 py-1 rounded ${getStatusColor(feature?.status)}`}>
                          <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                          <span>{feature?.status}</span>
                        </div>
                      </div>
                    </div>
                    <Icon name="ExternalLink" size={16} className="text-muted-foreground group-hover:text-primary tactical-transition" />
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature?.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Technology Stack */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Technology Stack</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {techStack?.map((tech, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-4 text-center tactical-transition hover:border-primary/30">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Icon name={tech?.icon} size={16} className="text-primary" />
                  </div>
                  <div className="text-sm font-medium text-foreground">{tech?.name}</div>
                  <div className="text-xs text-muted-foreground">{tech?.type}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="bg-gradient-to-r from-success/5 to-primary/5 border border-success/20 rounded-xl p-8">
            <h3 className="text-xl font-bold text-foreground mb-6 text-center">Expected Impact & Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="TrendingUp" size={24} color="white" />
                </div>
                <div className="text-2xl font-bold text-success mb-2">75%</div>
                <div className="text-sm text-muted-foreground">Reduction in Response Time</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Users" size={24} color="white" />
                </div>
                <div className="text-2xl font-bold text-primary mb-2">10M+</div>
                <div className="text-sm text-muted-foreground">Women Benefited</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-warning rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Shield" size={24} color="white" />
                </div>
                <div className="text-2xl font-bold text-warning mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Continuous Protection</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-4 pt-8 border-t border-border">
            <h3 className="text-2xl font-bold text-foreground">Ready for SIH2025 Presentation</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience our comprehensive Women Safety Analytics System designed to revolutionize public safety through advanced AI and real-time monitoring.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/real-time-monitoring-command-center">
                <Button variant="primary" size="lg" iconName="Monitor" iconPosition="left">
                  Start Live Demo
                </Button>
              </Link>
              <Button variant="outline" size="lg" iconName="Download" iconPosition="left">
                Download Presentation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SIH2025Showcase;