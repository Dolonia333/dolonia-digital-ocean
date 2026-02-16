import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Activity, Server, Database, Zap, TrendingUp, Clock } from 'lucide-react';

interface MetricData {
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricData[]>([
    { label: 'CPU Usage', value: 45, unit: '%', trend: 'stable', status: 'good' },
    { label: 'Memory', value: 68, unit: '%', trend: 'up', status: 'good' },
    { label: 'Storage', value: 32, unit: '%', trend: 'down', status: 'excellent' },
    { label: 'Network I/O', value: 78, unit: 'Mbps', trend: 'up', status: 'good' },
    { label: 'Response Time', value: 125, unit: 'ms', trend: 'down', status: 'excellent' },
    { label: 'Uptime', value: 99.98, unit: '%', trend: 'stable', status: 'excellent' }
  ]);

  const [realTimeData, setRealTimeData] = useState({
    activeConnections: 1247,
    requestsPerSecond: 89,
    dataProcessed: 2.4,
    securityThreats: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 5))
      })));

      setRealTimeData(prev => ({
        activeConnections: Math.max(1000, prev.activeConnections + Math.floor((Math.random() - 0.5) * 50)),
        requestsPerSecond: Math.max(50, prev.requestsPerSecond + Math.floor((Math.random() - 0.5) * 20)),
        dataProcessed: Math.max(1, prev.dataProcessed + (Math.random() - 0.5) * 0.2),
        securityThreats: Math.max(0, prev.securityThreats + Math.floor(Math.random() * 2) - 1)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-cyan-bright';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-cyan-soft';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '→';
      default: return '→';
    }
  };

  return (
    <section className="py-20 bg-gradient-ocean">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-cyber bg-clip-text text-transparent">
              Real-Time Performance Dashboard
            </span>
          </h2>
          <p className="text-xl text-cyan-soft max-w-3xl mx-auto">
            Monitor your infrastructure performance with live metrics and AI-powered insights
          </p>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-ocean-surface/50 backdrop-blur-sm border-ocean-surface">
            <CardContent className="p-4 text-center">
              <Activity className="w-8 h-8 text-cyan-bright mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{realTimeData.activeConnections.toLocaleString()}</p>
              <p className="text-sm text-cyan-soft">Active Connections</p>
            </CardContent>
          </Card>
          
          <Card className="bg-ocean-surface/50 backdrop-blur-sm border-ocean-surface">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 text-cyan-bright mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{realTimeData.requestsPerSecond}</p>
              <p className="text-sm text-cyan-soft">Requests/sec</p>
            </CardContent>
          </Card>
          
          <Card className="bg-ocean-surface/50 backdrop-blur-sm border-ocean-surface">
            <CardContent className="p-4 text-center">
              <Database className="w-8 h-8 text-cyan-bright mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{realTimeData.dataProcessed.toFixed(1)} TB</p>
              <p className="text-sm text-cyan-soft">Data Processed</p>
            </CardContent>
          </Card>
          
          <Card className="bg-ocean-surface/50 backdrop-blur-sm border-ocean-surface">
            <CardContent className="p-4 text-center">
              <Server className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{realTimeData.securityThreats}</p>
              <p className="text-sm text-cyan-soft">Security Threats</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-ocean-surface/50 backdrop-blur-sm border-ocean-surface hover:border-cyan-bright/30 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-foreground">{metric.label}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getTrendIcon(metric.trend)}</span>
                    <Badge variant="outline" className={`border-transparent ${getStatusColor(metric.status)} bg-transparent`}>
                      {metric.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                      {metric.value.toFixed(metric.label === 'Uptime' ? 2 : 0)}{metric.unit}
                    </span>
                    <TrendingUp className={`w-4 h-4 ${getStatusColor(metric.status)}`} />
                  </div>
                  <Progress 
                    value={metric.label === 'Response Time' ? 100 - (metric.value / 200 * 100) : metric.value} 
                    className="h-2"
                  />
                  <p className="text-sm text-cyan-soft/70">
                    Last updated: <Clock className="inline w-3 h-3 mr-1" />
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Insights */}
        <Card className="mt-8 bg-ocean-surface/50 backdrop-blur-sm border-ocean-surface">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-foreground">
              <Activity className="w-6 h-6 text-cyan-bright" />
              <span>AI Performance Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-cyan-bright">Optimization Recommendations</h4>
                <ul className="space-y-2 text-cyan-soft">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>CPU utilization is optimal at 45%</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-400 mt-0.5">⚠</span>
                    <span>Consider scaling up memory allocation during peak hours</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-cyan-bright mt-0.5">ℹ</span>
                    <span>Network throughput can be optimized by 15%</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-cyan-bright">Cost Optimization</h4>
                <ul className="space-y-2 text-cyan-soft">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400 mt-0.5">💰</span>
                    <span>Potential savings of $247/month identified</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-cyan-bright mt-0.5">📊</span>
                    <span>Auto-scaling could reduce costs by 18%</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PerformanceDashboard;