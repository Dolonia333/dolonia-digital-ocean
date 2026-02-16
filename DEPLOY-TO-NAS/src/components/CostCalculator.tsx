import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { trackEngagement } from '@/lib/engagement'
import { Calculator, DollarSign, TrendingDown, Server, Database, Shield, Zap } from 'lucide-react'

const CostCalculator: React.FC = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [config, setConfig] = useState({
    servers: 2,
    storage: 100, // GB
    bandwidth: 500, // GB
    users: 10,
    securityLevel: 'standard', // basic, standard, enterprise
    aiOptimization: true,
    multiCloud: false,
  })

  const [costs, setCosts] = useState({
    servers: 0,
    storage: 0,
    bandwidth: 0,
    security: 0,
    aiOptimization: 0,
    multiCloud: 0,
    total: 0,
    savings: 0,
  })

  const calculateCosts = useCallback(() => {
    const serverCost = config.servers * 89 // $89 per server
    const storageCost = config.storage * 0.25 // $0.25 per GB
    const bandwidthCost = config.bandwidth * 0.12 // $0.12 per GB

    let securityCost = 0
    switch (config.securityLevel) {
      case 'basic':
        securityCost = 29
        break
      case 'standard':
        securityCost = 99
        break
      case 'enterprise':
        securityCost = 299
        break
    }

    const aiCost = config.aiOptimization ? 149 : 0
    const multiCloudCost = config.multiCloud ? 199 : 0

    const subtotal =
      serverCost + storageCost + bandwidthCost + securityCost + aiCost + multiCloudCost

    // AI optimization savings
    const aiSavings = config.aiOptimization ? subtotal * 0.25 : 0
    const total = subtotal - aiSavings

    setCosts({
      servers: serverCost,
      storage: storageCost,
      bandwidth: bandwidthCost,
      security: securityCost,
      aiOptimization: aiCost,
      multiCloud: multiCloudCost,
      total: total,
      savings: aiSavings,
    })
  }, [config])

  useEffect(() => {
    calculateCosts()
  }, [config, calculateCosts])

  const handleConfigChange = (key: string, value: number | string | boolean) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const getSecurityBadgeColor = (level: string) => {
    switch (level) {
      case 'basic':
        return 'bg-yellow-400/20 text-yellow-400'
      case 'standard':
        return 'bg-cyan-400/20 text-cyan-400'
      case 'enterprise':
        return 'bg-green-400/20 text-green-400'
      default:
        return 'bg-cyan-400/20 text-cyan-400'
    }
  }

  const handleGetStartedWithConfig = () => {
    // Store the configuration in localStorage for the contact form
    localStorage.setItem(
      'dolonia-calculator-config',
      JSON.stringify({
        config,
        costs,
        timestamp: new Date().toISOString(),
      }),
    )

    toast({
      title: 'Configuration Saved',
      description: "Your configuration has been saved. We'll discuss this setup with you.",
    })

    void trackEngagement('cost_calculator_saved_config', {
      servers: config.servers,
      storage_gb: config.storage,
      bandwidth_gb: config.bandwidth,
      users: config.users,
      security_level: config.securityLevel,
      includes_ai: config.aiOptimization,
      includes_multicloud: config.multiCloud,
      estimated_total: costs.total,
    })

    // Navigate to contact page
    navigate('/contact')
  }

  const handleScheduleConsultation = () => {
    // Store the configuration for consultation
    localStorage.setItem(
      'dolonia-consultation-config',
      JSON.stringify({
        config,
        costs,
        consultationType: 'pricing',
        timestamp: new Date().toISOString(),
      }),
    )

    toast({
      title: 'Ready for Consultation',
      description:
        "Your configuration is ready. Let's schedule a consultation to discuss your needs.",
    })

    void trackEngagement('cost_calculator_schedule_consultation', {
      servers: config.servers,
      storage_gb: config.storage,
      bandwidth_gb: config.bandwidth,
      users: config.users,
      security_level: config.securityLevel,
      includes_ai: config.aiOptimization,
      includes_multicloud: config.multiCloud,
      estimated_total: costs.total,
    })

    // Navigate to contact page with consultation focus
    navigate('/contact?type=consultation')
  }

  return (
    <section className="py-20 bg-gradient-ocean">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-cyber bg-clip-text text-transparent">Cost Calculator</span>
          </h2>
          <p className="text-xl text-cyan-soft max-w-3xl mx-auto">
            Estimate your monthly costs and discover potential savings with Dolonia
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configuration Panel */}
            <Card className="bg-ocean-surface/50 backdrop-blur-sm border-ocean-surface">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Calculator className="w-6 h-6 text-cyan-bright" />
                  <span>Configure Your Infrastructure</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Servers */}
                <div className="space-y-3">
                  <Label className="text-foreground flex items-center space-x-2">
                    <Server className="w-4 h-4 text-cyan-bright" />
                    <span>Number of Servers: {config.servers}</span>
                  </Label>
                  <Slider
                    value={[config.servers]}
                    onValueChange={(value) => handleConfigChange('servers', value[0])}
                    max={20}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-cyan-soft">
                    <span>1 server</span>
                    <span>20 servers</span>
                  </div>
                </div>

                {/* Storage */}
                <div className="space-y-3">
                  <Label className="text-foreground flex items-center space-x-2">
                    <Database className="w-4 h-4 text-cyan-bright" />
                    <span>Storage: {config.storage} GB</span>
                  </Label>
                  <Slider
                    value={[config.storage]}
                    onValueChange={(value) => handleConfigChange('storage', value[0])}
                    max={5000}
                    min={50}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-cyan-soft">
                    <span>50 GB</span>
                    <span>5,000 GB</span>
                  </div>
                </div>

                {/* Bandwidth */}
                <div className="space-y-3">
                  <Label className="text-foreground flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-cyan-bright" />
                    <span>Monthly Bandwidth: {config.bandwidth} GB</span>
                  </Label>
                  <Slider
                    value={[config.bandwidth]}
                    onValueChange={(value) => handleConfigChange('bandwidth', value[0])}
                    max={10000}
                    min={100}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-cyan-soft">
                    <span>100 GB</span>
                    <span>10,000 GB</span>
                  </div>
                </div>

                {/* Users */}
                <div className="space-y-3">
                  <Label className="text-foreground">Number of Users</Label>
                  <Input
                    type="number"
                    value={config.users}
                    onChange={(e) => handleConfigChange('users', parseInt(e.target.value) || 0)}
                    className="bg-ocean-deep border-ocean-surface text-foreground"
                    min="1"
                    max="1000"
                  />
                </div>

                {/* Security Level */}
                <div className="space-y-3">
                  <Label className="text-foreground flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-cyan-bright" />
                    <span>Security Level</span>
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['basic', 'standard', 'enterprise'].map((level) => (
                      <Button
                        key={level}
                        variant={config.securityLevel === level ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleConfigChange('securityLevel', level)}
                        className={
                          config.securityLevel === level
                            ? 'bg-gradient-cyber text-ocean-deep'
                            : 'bg-transparent border-ocean-surface text-cyan-soft hover:text-cyan-bright hover:border-cyan-bright/30'
                        }
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Feature Toggles */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">AI Optimization</Label>
                    <Button
                      variant={config.aiOptimization ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleConfigChange('aiOptimization', !config.aiOptimization)}
                      className={
                        config.aiOptimization
                          ? 'bg-gradient-cyber text-ocean-deep'
                          : 'bg-transparent border-ocean-surface text-cyan-soft hover:text-cyan-bright'
                      }
                    >
                      {config.aiOptimization ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">Multi-Cloud Support</Label>
                    <Button
                      variant={config.multiCloud ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleConfigChange('multiCloud', !config.multiCloud)}
                      className={
                        config.multiCloud
                          ? 'bg-gradient-cyber text-ocean-deep'
                          : 'bg-transparent border-ocean-surface text-cyan-soft hover:text-cyan-bright'
                      }
                    >
                      {config.multiCloud ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <Card className="bg-ocean-surface/50 backdrop-blur-sm border-ocean-surface">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <DollarSign className="w-6 h-6 text-cyan-bright" />
                  <span>Monthly Cost Breakdown</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cost Items */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-cyan-soft">Servers ({config.servers}x)</span>
                    <span className="text-foreground font-medium">${costs.servers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyan-soft">Storage ({config.storage} GB)</span>
                    <span className="text-foreground font-medium">${costs.storage.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyan-soft">Bandwidth ({config.bandwidth} GB)</span>
                    <span className="text-foreground font-medium">
                      ${costs.bandwidth.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyan-soft flex items-center space-x-2">
                      <span>Security</span>
                      <Badge className={`text-xs ${getSecurityBadgeColor(config.securityLevel)}`}>
                        {config.securityLevel}
                      </Badge>
                    </span>
                    <span className="text-foreground font-medium">${costs.security}</span>
                  </div>
                  {config.aiOptimization && (
                    <div className="flex justify-between">
                      <span className="text-cyan-soft">AI Optimization</span>
                      <span className="text-foreground font-medium">${costs.aiOptimization}</span>
                    </div>
                  )}
                  {config.multiCloud && (
                    <div className="flex justify-between">
                      <span className="text-cyan-soft">Multi-Cloud Support</span>
                      <span className="text-foreground font-medium">${costs.multiCloud}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-ocean-surface pt-4">
                  {costs.savings > 0 && (
                    <div className="flex justify-between text-green-400 mb-2">
                      <span className="flex items-center space-x-1">
                        <TrendingDown className="w-4 h-4" />
                        <span>AI Optimization Savings (25%)</span>
                      </span>
                      <span className="font-medium">-${costs.savings.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-foreground">Total Monthly Cost</span>
                    <span className="text-cyan-bright">${costs.total.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-cyan-soft mt-2">
                    Annual cost: ${(costs.total * 12).toFixed(2)}
                  </div>
                </div>

                {/* Savings Highlight */}
                {costs.savings > 0 && (
                  <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-4 mt-4">
                    <div className="flex items-center space-x-2 text-green-400 mb-2">
                      <TrendingDown className="w-5 h-5" />
                      <span className="font-semibold">AI-Powered Savings</span>
                    </div>
                    <p className="text-sm text-cyan-soft">
                      Our AI optimization can save you{' '}
                      <strong className="text-green-400">${costs.savings.toFixed(2)}/month</strong>{' '}
                      through intelligent resource management and automated scaling.
                    </p>
                    <p className="text-xs text-cyan-soft/70 mt-2">
                      Annual savings: ${(costs.savings * 12).toFixed(2)}
                    </p>
                  </div>
                )}

                {/* CTA */}
                <div className="pt-4 space-y-3">
                  <Button
                    onClick={handleGetStartedWithConfig}
                    className="w-full bg-gradient-cyber hover:shadow-glow text-ocean-deep font-semibold transition-all duration-300"
                  >
                    Get Started with This Configuration
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleScheduleConsultation}
                    className="w-full bg-transparent border-cyan-bright text-cyan-bright hover:bg-cyan-bright hover:text-ocean-deep transition-all duration-300"
                  >
                    Schedule a Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CostCalculator
