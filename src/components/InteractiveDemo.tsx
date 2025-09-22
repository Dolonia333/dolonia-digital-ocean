import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, CheckCircle, AlertTriangle, Server, Shield, Zap } from 'lucide-react';

const InteractiveDemo: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const demoSteps = [
    {
      title: "Infrastructure Setup",
      description: "Deploying secure cloud infrastructure",
      icon: Server,
      duration: 2000,
      status: "pending"
    },
    {
      title: "Security Configuration",
      description: "Implementing zero-trust security protocols",
      icon: Shield,
      duration: 3000,
      status: "pending"
    },
    {
      title: "AI Optimization",
      description: "Applying machine learning optimizations",
      icon: Zap,
      duration: 2500,
      status: "pending"
    },
    {
      title: "Performance Testing",
      description: "Running comprehensive performance tests",
      icon: CheckCircle,
      duration: 1500,
      status: "pending"
    }
  ];

  const [steps, setSteps] = useState(demoSteps);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isRunning && currentStep < steps.length) {
      setSteps(prev => prev.map((step, index) => 
        index === currentStep 
          ? { ...step, status: "running" }
          : step
      ));

      timeout = setTimeout(() => {
        setSteps(prev => prev.map((step, index) => 
          index === currentStep 
            ? { ...step, status: "completed" }
            : step
        ));
        
        setCompletedSteps(prev => [...prev, currentStep]);
        setCurrentStep(prev => prev + 1);
      }, steps[currentStep].duration);
    } else if (currentStep >= steps.length && isRunning) {
      setIsRunning(false);
    }

    return () => clearTimeout(timeout);
  }, [isRunning, currentStep, steps]);

  const startDemo = () => {
    setIsRunning(true);
    setCurrentStep(0);
    setCompletedSteps([]);
    setSteps(demoSteps.map(step => ({ ...step, status: "pending" })));
  };

  const pauseDemo = () => {
    setIsRunning(false);
  };

  const resetDemo = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setCompletedSteps([]);
    setSteps(demoSteps.map(step => ({ ...step, status: "pending" })));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 border-green-400';
      case 'running': return 'text-cyan-bright border-cyan-bright';
      case 'pending': return 'text-cyan-soft border-ocean-surface';
      default: return 'text-cyan-soft border-ocean-surface';
    }
  };

  const getStatusIcon = (status: string, IconComponent: any) => {
    if (status === 'completed') return <CheckCircle className="w-6 h-6 text-green-400" />;
    if (status === 'running') return <IconComponent className="w-6 h-6 text-cyan-bright animate-pulse" />;
    return <IconComponent className="w-6 h-6 text-cyan-soft" />;
  };

  return (
    <section className="py-20 bg-ocean-deep/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-cyber bg-clip-text text-transparent">
              Interactive Cloud Deployment Demo
            </span>
          </h2>
          <p className="text-xl text-cyan-soft max-w-3xl mx-auto">
            Experience our automated deployment process in real-time
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Control Panel */}
          <Card className="mb-8 bg-ocean-surface/50 backdrop-blur-sm border-ocean-surface">
            <CardHeader>
              <CardTitle className="text-center text-foreground">Demo Control Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={startDemo}
                  disabled={isRunning}
                  className="bg-gradient-cyber hover:shadow-glow text-ocean-deep font-semibold transition-all duration-300"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Demo
                </Button>
                <Button
                  onClick={pauseDemo}
                  disabled={!isRunning}
                  variant="outline"
                  className="bg-transparent border-cyan-bright text-cyan-bright hover:bg-cyan-bright hover:text-ocean-deep transition-all duration-300"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
                <Button
                  onClick={resetDemo}
                  variant="outline"
                  className="bg-transparent border-ocean-surface text-cyan-soft hover:border-cyan-bright hover:text-cyan-bright transition-all duration-300"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Demo Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <Card 
                key={index} 
                className={`bg-ocean-surface/50 backdrop-blur-sm border transition-all duration-300 ${getStatusColor(step.status)} ${
                  step.status === 'running' ? 'scale-105 shadow-glow' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-3 text-foreground">
                      {getStatusIcon(step.status, step.icon)}
                      <span className="text-lg">{step.title}</span>
                    </CardTitle>
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(step.status)} bg-transparent capitalize`}
                    >
                      {step.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-cyan-soft mb-4">{step.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-ocean-deep rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        step.status === 'completed' 
                          ? 'w-full bg-green-400' 
                          : step.status === 'running'
                          ? 'w-full bg-cyan-bright animate-pulse'
                          : 'w-0 bg-cyan-soft'
                      }`}
                    />
                  </div>
                  
                  {step.status === 'running' && (
                    <div className="mt-3 flex items-center space-x-2 text-cyan-bright">
                      <div className="w-2 h-2 bg-cyan-bright rounded-full animate-ping"></div>
                      <span className="text-sm">Processing...</span>
                    </div>
                  )}
                  
                  {step.status === 'completed' && (
                    <div className="mt-3 flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Completed successfully</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Demo Results */}
          {completedSteps.length === steps.length && (
            <Card className="mt-8 bg-gradient-cyber/10 backdrop-blur-sm border-cyan-bright animate-fade-in">
              <CardHeader>
                <CardTitle className="text-center text-foreground flex items-center justify-center space-x-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span>Demo Completed Successfully!</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-cyan-soft mb-6">
                  Your cloud infrastructure has been deployed with enterprise-grade security and AI optimization.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-ocean-surface/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400">99.9%</div>
                    <div className="text-cyan-soft">Uptime Guaranteed</div>
                  </div>
                  <div className="bg-ocean-surface/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-cyan-bright">&lt; 50ms</div>
                    <div className="text-cyan-soft">Response Time</div>
                  </div>
                  <div className="bg-ocean-surface/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400">Zero</div>
                    <div className="text-cyan-soft">Security Vulnerabilities</div>
                  </div>
                </div>
                <Button 
                  className="mt-6 bg-gradient-cyber hover:shadow-glow text-ocean-deep font-semibold transition-all duration-300"
                >
                  Schedule Your Real Deployment
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;