import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, TrendingUp, Calculator, Zap } from 'lucide-react'

const BASE_PRICE = 300
const HOSTING_COST = 350
const WORKFLOW_COST = 150
const AI_COST = 250
const SECURITY_COST = 125

const SUPPORT_MULTIPLIERS = {
  basic: { value: 1.0, label: 'Basic Support', description: 'Email support, 48hr response' },
  standard: {
    value: 1.3,
    label: 'Standard Support',
    description: 'Priority support, 24hr response',
  },
  premium: { value: 1.6, label: 'Premium Support', description: 'Dedicated support, 4hr response' },
}

const INFRA_MULTIPLIERS = {
  small: { value: 1.0, label: 'Small Scale', description: 'Up to 10k users/month' },
  medium: { value: 1.5, label: 'Medium Scale', description: '10k-100k users/month' },
  large: { value: 2.0, label: 'Large Scale', description: '100k+ users/month' },
}

interface RetainerTier {
  name: string
  color: string
  maxPrice: number
}

const TIERS: RetainerTier[] = [
  { name: 'Starter', color: 'bg-blue-500', maxPrice: 800 },
  { name: 'Standard', color: 'bg-purple-500', maxPrice: 2500 },
  { name: 'Elite', color: 'bg-amber-500', maxPrice: Infinity },
]

const RetainerCalculator: React.FC = () => {
  const [hasWebsite, setHasWebsite] = useState(true)
  const [workflowCount, setWorkflowCount] = useState([3])
  const [aiIntegrations, setAiIntegrations] = useState([1])
  const [supportLevel, setSupportLevel] = useState<'basic' | 'standard' | 'premium'>('standard')
  const [hasSecurityBeacon, setHasSecurityBeacon] = useState(false)
  const [infrastructureScale, setInfrastructureScale] = useState<'small' | 'medium' | 'large'>(
    'small',
  )

  const [monthlyRetainer, setMonthlyRetainer] = useState(0)
  const [currentTier, setCurrentTier] = useState<RetainerTier>(TIERS[0])
  const [hoursSaved, setHoursSaved] = useState(0)
  const [roiValue, setRoiValue] = useState(0)

  useEffect(() => {
    let baseTotal = BASE_PRICE
    if (hasWebsite) {
      baseTotal += HOSTING_COST
    }

    const workflowTotal = workflowCount[0] * WORKFLOW_COST
    const aiTotal = aiIntegrations[0] * AI_COST
    const securityTotal = hasSecurityBeacon ? SECURITY_COST : 0
    const subtotal = baseTotal + workflowTotal + aiTotal + securityTotal

    const supportMultiplier = SUPPORT_MULTIPLIERS[supportLevel].value
    const infraMultiplier = INFRA_MULTIPLIERS[infrastructureScale].value

    const total = Math.round(subtotal * supportMultiplier * infraMultiplier)
    setMonthlyRetainer(total)

    const tier = TIERS.find((t) => total <= t.maxPrice) || TIERS[TIERS.length - 1]
    setCurrentTier(tier)

    const savedHours = workflowCount[0] * 15
    setHoursSaved(savedHours)

    const laborSavings = savedHours * 50
    const roi = laborSavings - total
    setRoiValue(roi)
  }, [
    hasWebsite,
    workflowCount,
    aiIntegrations,
    supportLevel,
    hasSecurityBeacon,
    infrastructureScale,
  ])

  const netEfficiency = ((roiValue / monthlyRetainer) * 100).toFixed(0)
  const annualRetainer = monthlyRetainer * 12
  const annualROI = roiValue * 12

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl md:text-5xl font-bold flex items-center justify-center gap-3">
          <Calculator className="w-10 h-10 text-cyan-bright" />
          <span className="bg-gradient-cyber bg-clip-text text-transparent">
            Estimate Your Retainer Value
          </span>
        </h2>
        <p className="text-lg text-cyan-soft">
          Configure your needs to see pricing, tier classification, and ROI calculations
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="p-6 space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-2xl font-semibold text-cyan-bright">Configuration</h3>
            <p className="text-sm text-cyan-soft mt-1">
              Adjust settings to match your requirements
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-cyan-soft">
                Website Hosting & Management
              </label>
              <button
                onClick={() => setHasWebsite(!hasWebsite)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  hasWebsite ? 'bg-cyan-bright' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    hasWebsite ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-cyan-soft/80">
              {hasWebsite
                ? '+$350/mo - Full website hosting and management'
                : 'No website hosting needed'}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-cyan-soft">Automated Workflows</label>
              <Badge variant="secondary" className="text-sm font-semibold">
                {workflowCount[0]} workflows
              </Badge>
            </div>
            <Slider
              value={workflowCount}
              onValueChange={setWorkflowCount}
              min={0}
              max={10}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-cyan-soft/80">
              +${workflowCount[0] * WORKFLOW_COST}/mo - Each workflow saves ~15hrs/month
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-cyan-soft">AI Integrations</label>
              <Badge variant="secondary" className="text-sm font-semibold">
                {aiIntegrations[0]} integrations
              </Badge>
            </div>
            <Slider
              value={aiIntegrations}
              onValueChange={setAiIntegrations}
              min={0}
              max={5}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-cyan-soft/80">
              +${aiIntegrations[0] * AI_COST}/mo - AI-powered automation and intelligence
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-cyan-soft">Security Beacon</label>
              <button
                onClick={() => setHasSecurityBeacon(!hasSecurityBeacon)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  hasSecurityBeacon ? 'bg-cyan-bright' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    hasSecurityBeacon ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-cyan-soft/80">
              {hasSecurityBeacon ? '+$125/mo - Advanced security monitoring' : 'No security beacon'}
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-cyan-soft">Support Level</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(SUPPORT_MULTIPLIERS).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSupportLevel(key as 'basic' | 'standard' | 'premium')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    supportLevel === key
                      ? 'border-cyan-bright bg-cyan-bright/10 text-cyan-bright'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-cyan-bright/50'
                  }`}
                >
                  <div className="text-sm font-semibold">{config.label.split(' ')[0]}</div>
                  <div className="text-xs text-gray-500 mt-1">{config.value}x</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-cyan-soft/80">
              {SUPPORT_MULTIPLIERS[supportLevel].description}
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-cyan-soft">Infrastructure Scale</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(INFRA_MULTIPLIERS).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setInfrastructureScale(key as 'small' | 'medium' | 'large')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    infrastructureScale === key
                      ? 'border-cyan-bright bg-cyan-bright/10 text-cyan-bright'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-cyan-bright/50'
                  }`}
                >
                  <div className="text-sm font-semibold">{config.label.split(' ')[0]}</div>
                  <div className="text-xs text-gray-500 mt-1">{config.value}x</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-cyan-soft/80">
              {INFRA_MULTIPLIERS[infrastructureScale].description}
            </p>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-cyan-bright/5 to-purple-500/5 border-2 border-cyan-bright/30">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-cyan-bright">Monthly Retainer</h3>
                <Badge className={`${currentTier.color} text-white px-3 py-1 text-sm font-bold`}>
                  {currentTier.name}
                </Badge>
              </div>
              <div className="text-5xl font-bold text-cyan-bright">
                ${monthlyRetainer.toLocaleString()}
                <span className="text-lg text-cyan-soft font-normal">/month</span>
              </div>
              <div className="text-sm text-cyan-soft">
                Annual: ${annualRetainer.toLocaleString()}/year
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-cyan-bright">ROI Analysis</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-cyan-soft uppercase tracking-wide">Hours Saved/Month</p>
                <p className="text-2xl font-bold text-cyan-bright">{hoursSaved} hrs</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-cyan-soft uppercase tracking-wide">
                  Labor Value @ $50/hr
                </p>
                <p className="text-2xl font-bold text-cyan-bright">
                  ${(hoursSaved * 50).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-900">Net Monthly Efficiency</span>
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-700">
                ${roiValue.toLocaleString()}
                {roiValue > 0 && (
                  <span className="text-sm text-green-600 ml-2">({netEfficiency}% ROI)</span>
                )}
              </div>
              <p className="text-xs text-green-700 mt-2">
                Annual net efficiency: ${annualROI.toLocaleString()}/year
              </p>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <CheckCircle2 className="w-5 h-5 text-cyan-bright" />
              <h3 className="text-lg font-semibold text-cyan-bright">Your Configuration</h3>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-cyan-soft">Base Platform Fee</span>
                <span className="font-semibold text-cyan-bright">${BASE_PRICE}</span>
              </div>
              {hasWebsite && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-cyan-soft">Website Hosting</span>
                  <span className="font-semibold text-cyan-bright">${HOSTING_COST}</span>
                </div>
              )}
              {workflowCount[0] > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-cyan-soft">
                    {workflowCount[0]} Workflow{workflowCount[0] !== 1 ? 's' : ''}
                  </span>
                  <span className="font-semibold text-cyan-bright">
                    ${workflowCount[0] * WORKFLOW_COST}
                  </span>
                </div>
              )}
              {aiIntegrations[0] > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-cyan-soft">
                    {aiIntegrations[0]} AI Integration{aiIntegrations[0] !== 1 ? 's' : ''}
                  </span>
                  <span className="font-semibold text-cyan-bright">
                    ${aiIntegrations[0] * AI_COST}
                  </span>
                </div>
              )}
              {hasSecurityBeacon && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-cyan-soft">Security Beacon</span>
                  <span className="font-semibold text-cyan-bright">${SECURITY_COST}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-cyan-soft">Support Level</span>
                <span className="font-semibold text-cyan-bright">
                  {SUPPORT_MULTIPLIERS[supportLevel].label}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-cyan-soft">Infrastructure Scale</span>
                <span className="font-semibold text-cyan-bright">
                  {INFRA_MULTIPLIERS[infrastructureScale].label}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default RetainerCalculator
