import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, DollarSign, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RetainerCalculator: React.FC = () => {
  const navigate = useNavigate();
  const [automationCount, setAutomationCount] = useState(3);
  const [supportLevel, setSupportLevel] = useState(1); // 0=basic, 1=priority, 2=dedicated
  const [hasCustomSite, setHasCustomSite] = useState(true);

  const supportLevels = ['Basic', 'Priority', 'Dedicated'];
  
  // Calculate estimated monthly value
  const calculateMonthlyValue = () => {
    let base = 200; // Base hosting + maintenance
    
    if (hasCustomSite) base += 300; // Site maintenance
    base += automationCount * 100; // $100 per workflow
    base += supportLevel * 200; // Support tier
    
    return base;
  };

  const calculateTimesSaved = () => {
    return automationCount * 5; // 5 hours saved per workflow/month
  };

  const monthlyValue = calculateMonthlyValue();
  const hoursSaved = calculateTimesSaved();
  const annualValue = monthlyValue * 12;

  const handleScheduleConsultation = () => {
    // Save config to localStorage for pre-filling contact form
    localStorage.setItem('retainerConfig', JSON.stringify({
      automationCount,
      supportLevel: supportLevels[supportLevel],
      hasCustomSite,
      estimatedValue: monthlyValue
    }));
    navigate('/contact');
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-ocean-surface/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-cyber bg-clip-text text-transparent">
              Estimate Your Retainer Value
            </span>
          </h2>
          <p className="text-xl text-cyan-soft max-w-3xl mx-auto">
            See what a predictable monthly partnership could look like for your business.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Configuration Panel */}
          <Card className="border-ocean-surface bg-ocean-surface/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Your Requirements</CardTitle>
              <CardDescription className="text-cyan-soft">
                Adjust the sliders to match your needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Custom Site Toggle */}
              <div className="space-y-3">
                <Label className="text-foreground font-semibold">Website Hosting</Label>
                <div className="flex gap-4">
                  <Button
                    variant={hasCustomSite ? "default" : "outline"}
                    className={hasCustomSite ? "bg-cyan-bright text-background" : ""}
                    onClick={() => setHasCustomSite(true)}
                  >
                    Yes, include site
                  </Button>
                  <Button
                    variant={!hasCustomSite ? "default" : "outline"}
                    className={!hasCustomSite ? "bg-cyan-bright text-background" : ""}
                    onClick={() => setHasCustomSite(false)}
                  >
                    No site needed
                  </Button>
                </div>
              </div>

              {/* Automation Workflows */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-foreground font-semibold">Automation Workflows</Label>
                  <Badge className="bg-cyan-bright text-background">{automationCount}</Badge>
                </div>
                <Slider
                  value={[automationCount]}
                  onValueChange={(value) => setAutomationCount(value[0])}
                  min={0}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <p className="text-sm text-cyan-soft">
                  n8n workflows with AI integration (~{automationCount * 5} hours saved/month)
                </p>
              </div>

              {/* Support Level */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-foreground font-semibold">Support Level</Label>
                  <Badge className="bg-cyan-bright text-background">
                    {supportLevels[supportLevel]}
                  </Badge>
                </div>
                <Slider
                  value={[supportLevel]}
                  onValueChange={(value) => setSupportLevel(value[0])}
                  min={0}
                  max={2}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-cyan-soft">
                  <span>Email</span>
                  <span>Priority</span>
                  <span>Dedicated</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card className="border-cyan-bright bg-ocean-surface/50 backdrop-blur-sm shadow-lg shadow-cyan-bright/20">
            <CardHeader>
              <CardTitle className="text-2xl">Estimated Investment</CardTitle>
              <CardDescription className="text-cyan-soft">
                Based on your configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Monthly Cost */}
              <div className="text-center p-6 bg-gradient-cyber rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="h-8 w-8 text-cyan-bright" />
                  <div className="text-5xl font-bold text-foreground">
                    ${monthlyValue}
                  </div>
                </div>
                <p className="text-cyan-soft">per month</p>
              </div>

              {/* Value Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-ocean-surface/50 rounded-lg">
                  <Clock className="h-6 w-6 text-cyan-bright" />
                  <div>
                    <div className="font-semibold text-foreground">{hoursSaved} Hours Saved</div>
                    <div className="text-sm text-cyan-soft">Every month through automation</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-ocean-surface/50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-cyan-bright" />
                  <div>
                    <div className="font-semibold text-foreground">${annualValue} Annual</div>
                    <div className="text-sm text-cyan-soft">Full year investment</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-ocean-surface/50 rounded-lg">
                  <Zap className="h-6 w-6 text-cyan-bright" />
                  <div>
                    <div className="font-semibold text-foreground">Predictable Costs</div>
                    <div className="text-sm text-cyan-soft">No surprise bills or hidden fees</div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-3 pt-4">
                <Button 
                  className="w-full bg-cyan-bright hover:bg-cyan-bright/90 text-background font-semibold"
                  size="lg"
                  onClick={handleScheduleConsultation}
                >
                  Schedule a Consultation
                </Button>
                <p className="text-xs text-center text-cyan-soft">
                  Discuss your specific needs and get a custom quote
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Break-even explanation */}
        <Card className="max-w-4xl mx-auto mt-12 border-ocean-surface bg-ocean-surface/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-cyan-bright mb-3">Why Retainers Make Sense</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-cyan-soft">
              <div>
                <strong className="text-foreground">Predictable Budgeting</strong>
                <p>Know exactly what you'll pay each month. No project overruns.</p>
              </div>
              <div>
                <strong className="text-foreground">Priority Access</strong>
                <p>Your requests go to the front of the line. Fast turnaround guaranteed.</p>
              </div>
              <div>
                <strong className="text-foreground">Scalable Partnership</strong>
                <p>Start small, grow as needed. Cancel anytime with 30 days notice.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RetainerCalculator;
