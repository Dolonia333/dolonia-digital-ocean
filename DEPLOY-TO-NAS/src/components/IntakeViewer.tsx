import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FileText, Download, Eye, AlertCircle, Clipboard } from 'lucide-react'
import { toast } from 'sonner'

type IntakeForm = {
  id: string
  full_name: string
  company_name?: string
  email: string
  phone?: string
  preferred_contact?: string
  division: string
  service_category: string
  service_focus?: string[]
  budget_range?: string
  custom_budget?: string
  timeline?: string
  referral_source?: string
  tech_details?: Record<string, unknown>
  media_details?: Record<string, unknown>
  business_details?: Record<string, unknown>
  created_at: string
  updated_at?: string
  status?: string
  notes?: string
}

export default function IntakeViewer() {
  const [intake, setIntake] = useState<IntakeForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    loadIntakeForm()

    // Set up real-time subscription to intake_forms table
    const channel = supabase
      .channel('intake_forms')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'intake_forms',
        },
        (payload) => {
          // Reload intake form when there are changes
          loadIntakeForm()
        },
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  async function loadIntakeForm() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('intake_forms')
        .select('*')
        .eq('email', user.email)
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) throw error

      if (data && data.length > 0) {
        setIntake(data[0] as IntakeForm)
      }
    } catch (error) {
      console.error('Error loading intake form:', error)
      toast.error('Failed to load intake form')
    } finally {
      setLoading(false)
    }
  }

  async function downloadIntakePDF(intakeForm: IntakeForm) {
    try {
      const intakeHTML = generateIntakeHTML(intakeForm)

      // Create a blob from the HTML
      const blob = new Blob([intakeHTML], { type: 'text/html' })
      const url = URL.createObjectURL(blob)

      // Open in new window for printing to PDF
      const printWindow = window.open(url, '_blank')
      if (printWindow) {
        printWindow.focus()
        setTimeout(() => {
          printWindow.print()
          URL.revokeObjectURL(url)
        }, 250)
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to generate PDF')
    }
  }

  function getDivisionLabel(division: string): string {
    const labels: Record<string, string> = {
      dolonia_data_tech: 'Dolonia Data Tech',
      royal_society: 'Royal Society Management',
      '1921_holding': '1921 Holding Co.',
    }
    return labels[division] || division
  }

  function formatBudget(budget: string | undefined, custom?: string): string {
    if (budget === 'custom') {
      return `$${custom || '0'}`
    }
    return budget?.replace(/_/g, ' - ') || 'Not specified'
  }

  function generateIntakeHTML(form: IntakeForm) {
    const createdDate = new Date(form.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const serviceFocus = Array.isArray(form.service_focus)
      ? form.service_focus.join(', ')
      : 'Not specified'

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Intake Form - ${form.full_name}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f5f5f5; }
          .intake-container { max-width: 900px; margin: 0 auto; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }

          .letterhead {
            background: linear-gradient(135deg, #1a4d6d 0%, #0f3347 100%);
            padding: 40px 50px;
            color: white;
          }

          .letterhead h1 {
            font-size: 36px;
            font-weight: 900;
            letter-spacing: 2px;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
          }

          .letterhead .subtitle {
            font-size: 12px;
            font-weight: 300;
            letter-spacing: 1px;
            opacity: 0.9;
          }

          .letterhead .website {
            font-size: 12px;
            margin-top: 5px;
            opacity: 0.8;
          }

          .content { padding: 40px 50px; }

          .form-title {
            font-size: 28px;
            font-weight: 900;
            color: #1a4d6d;
            margin-bottom: 10px;
          }

          .form-number {
            font-size: 12px;
            color: #666;
            margin-bottom: 30px;
          }

          .section { margin-bottom: 30px; }

          .section-title {
            font-size: 14px;
            font-weight: 700;
            color: #1a4d6d;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding-bottom: 10px;
            border-bottom: 2px solid #1a4d6d;
            margin-bottom: 15px;
          }

          .field {
            display: grid;
            grid-template-columns: 200px 1fr;
            gap: 20px;
            margin-bottom: 12px;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
          }

          .field-label {
            font-weight: 600;
            color: #333;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .field-value {
            color: #555;
            font-size: 13px;
          }

          .footer-section {
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #1a4d6d;
            text-align: center;
            color: #666;
            font-size: 11px;
          }

          .stamp {
            display: inline-block;
            border: 3px solid #1a4d6d;
            padding: 15px 30px;
            transform: rotate(-5deg);
            margin: 20px 0;
            font-size: 20px;
            font-weight: 900;
            color: #1a4d6d;
            letter-spacing: 3px;
          }

          @media print {
            body { background: white; }
            .intake-container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="intake-container">
          <!-- Letterhead -->
          <div class="letterhead">
            <h1>DOLONIA DATA TECH</h1>
            <div class="subtitle">Project Intake Form</div>
            <div class="website">Dolonia.cloud</div>
          </div>

          <!-- Content -->
          <div class="content">
            <h2 class="form-title">Project Intake Form</h2>
            <div class="form-number">Submitted: ${createdDate}</div>

            <!-- Contact Information -->
            <div class="section">
              <div class="section-title">Contact Information</div>
              <div class="field">
                <div class="field-label">Full Name</div>
                <div class="field-value">${form.full_name}</div>
              </div>
              <div class="field">
                <div class="field-label">Company</div>
                <div class="field-value">${form.company_name || 'Not provided'}</div>
              </div>
              <div class="field">
                <div class="field-label">Email</div>
                <div class="field-value">${form.email}</div>
              </div>
              <div class="field">
                <div class="field-label">Phone</div>
                <div class="field-value">${form.phone || 'Not provided'}</div>
              </div>
              <div class="field">
                <div class="field-label">Preferred Contact</div>
                <div class="field-value">${form.preferred_contact ? form.preferred_contact.toUpperCase() : 'Not specified'}</div>
              </div>
            </div>

            <!-- Project Details -->
            <div class="section">
              <div class="section-title">Project Details</div>
              <div class="field">
                <div class="field-label">Division</div>
                <div class="field-value">${getDivisionLabel(form.division)}</div>
              </div>
              <div class="field">
                <div class="field-label">Service Category</div>
                <div class="field-value">${form.service_category}</div>
              </div>
              <div class="field">
                <div class="field-label">Service Focus</div>
                <div class="field-value">${serviceFocus}</div>
              </div>
              <div class="field">
                <div class="field-label">Budget Range</div>
                <div class="field-value">${formatBudget(form.budget_range, form.custom_budget)}</div>
              </div>
              <div class="field">
                <div class="field-label">Timeline</div>
                <div class="field-value">${form.timeline || 'Not specified'}</div>
              </div>
              <div class="field">
                <div class="field-label">Referral Source</div>
                <div class="field-value">${form.referral_source || 'Not specified'}</div>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer-section">
              <div class="stamp">RECEIVED</div>
              <p>This intake form has been received and will be reviewed by our team.</p>
              <p>We will contact you within 24 hours with next steps.</p>
              <p style="margin-top: 20px; font-size: 10px; color: #999;">
                Generated on ${new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }

  if (loading) {
    return (
      <Card className="bg-ocean-surface/60 border-cyan-bright/10">
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Loading intake form...</p>
        </CardContent>
      </Card>
    )
  }

  if (!intake) {
    return (
      <Card className="bg-ocean-surface/60 border-cyan-bright/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: '#1a4d6d' }}>
            <Clipboard className="h-5 w-5" />
            Project Intake Form
          </CardTitle>
          <CardDescription>Your submitted project information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <p>No intake form found. Please submit one to get started.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-lg shadow-cyan-bright/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: '#1a4d6d' }}>
            <Clipboard className="h-5 w-5" />
            Project Intake Form
          </CardTitle>
          <CardDescription>Your submitted project information</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Status Bar */}
          <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-ocean-deep/40 to-ocean-deep/20 border border-cyan-bright/20">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-foreground">Review Status</p>
              <Badge
                className={
                  intake.status === 'new'
                    ? 'bg-orange-400/20 text-orange-400 border-orange-400/50'
                    : intake.status === 'reviewing'
                      ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/50'
                      : 'bg-green-400/20 text-green-400 border-green-400/50'
                }
              >
                {intake.status === 'new'
                  ? '⏳ Awaiting Review'
                  : intake.status === 'reviewing'
                    ? '👀 Being Reviewed'
                    : '✅ Reviewed'}
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-ocean-deep/60 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  intake.status === 'new'
                    ? 'w-1/3 bg-orange-400'
                    : intake.status === 'reviewing'
                      ? 'w-2/3 bg-yellow-400'
                      : 'w-full bg-green-400'
                }`}
              />
            </div>

            {/* Admin Notes */}
            {intake.notes && (
              <div className="mt-4 p-3 bg-ocean-deep/80 rounded border border-cyan-bright/10">
                <p className="text-xs text-muted-foreground mb-1">📝 Admin Response:</p>
                <p className="text-sm text-foreground">{intake.notes}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Summary Display */}
            <div className="bg-ocean-deep/20 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Contact Name</p>
                  <p className="font-semibold text-foreground">{intake.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-semibold text-foreground">
                    {intake.company_name || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Division</p>
                  <p className="font-semibold text-foreground" style={{ color: '#1a4d6d' }}>
                    {getDivisionLabel(intake.division)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-semibold text-foreground">
                    {formatBudget(intake.budget_range, intake.custom_budget)}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="border-t border-cyan-bright/10 pt-4">
              <h4 className="font-semibold text-foreground mb-2" style={{ color: '#1a4d6d' }}>
                Contact Information
              </h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Email:</span> {intake.email}
                </p>
                {intake.phone && (
                  <p>
                    <span className="text-muted-foreground">Phone:</span> {intake.phone}
                  </p>
                )}
                {intake.preferred_contact && (
                  <p>
                    <span className="text-muted-foreground">Preferred Contact:</span>{' '}
                    {intake.preferred_contact.toUpperCase()}
                  </p>
                )}
              </div>
            </div>

            {/* Service Info */}
            <div className="border-t border-cyan-bright/10 pt-4">
              <h4 className="font-semibold text-foreground mb-2" style={{ color: '#1a4d6d' }}>
                Service Details
              </h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Category:</span> {intake.service_category}
                </p>
                {intake.service_focus && Array.isArray(intake.service_focus) && (
                  <p>
                    <span className="text-muted-foreground">Focus:</span>{' '}
                    {intake.service_focus.join(', ')}
                  </p>
                )}
                {intake.timeline && (
                  <p>
                    <span className="text-muted-foreground">Timeline:</span> {intake.timeline}
                  </p>
                )}
              </div>
            </div>

            {/* Submission Date */}
            <div className="border-t border-cyan-bright/10 pt-4">
              <p className="text-xs text-muted-foreground">
                Submitted:{' '}
                {new Date(intake.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t border-cyan-bright/10">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(true)}
                className="flex-1"
                style={{ borderColor: '#1a4d6d', color: '#1a4d6d' }}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Full Form
              </Button>
              <Button
                onClick={() => downloadIntakePDF(intake)}
                className="flex-1 bg-gradient-cyber hover:shadow-glow text-ocean-deep"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-ocean-deep border-cyan-bright/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{ color: '#1a4d6d' }}>
              <FileText className="h-5 w-5" />
              Project Intake Form Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="font-semibold text-foreground mb-3" style={{ color: '#1a4d6d' }}>
                Contact Information
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Full Name:</span> {intake.full_name}
                </p>
                <p>
                  <span className="font-medium">Company:</span>{' '}
                  {intake.company_name || 'Not provided'}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {intake.email}
                </p>
                {intake.phone && (
                  <p>
                    <span className="font-medium">Phone:</span> {intake.phone}
                  </p>
                )}
                {intake.preferred_contact && (
                  <p>
                    <span className="font-medium">Preferred Contact:</span>{' '}
                    {intake.preferred_contact.toUpperCase()}
                  </p>
                )}
              </div>
            </div>

            {/* Division & Services */}
            <div>
              <h3 className="font-semibold text-foreground mb-3" style={{ color: '#1a4d6d' }}>
                Division & Services
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Division:</span> {getDivisionLabel(intake.division)}
                </p>
                <p>
                  <span className="font-medium">Service Category:</span> {intake.service_category}
                </p>
                {intake.service_focus && Array.isArray(intake.service_focus) && (
                  <p>
                    <span className="font-medium">Service Focus:</span>{' '}
                    {intake.service_focus.join(', ')}
                  </p>
                )}
              </div>
            </div>

            {/* Budget & Timeline */}
            <div>
              <h3 className="font-semibold text-foreground mb-3" style={{ color: '#1a4d6d' }}>
                Budget & Timeline
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Budget Range:</span>{' '}
                  {formatBudget(intake.budget_range, intake.custom_budget)}
                </p>
                {intake.timeline && (
                  <p>
                    <span className="font-medium">Timeline:</span> {intake.timeline}
                  </p>
                )}
                {intake.referral_source && (
                  <p>
                    <span className="font-medium">How Did You Find Us:</span>{' '}
                    {intake.referral_source}
                  </p>
                )}
              </div>
            </div>

            {/* Download Button */}
            <Button
              onClick={() => downloadIntakePDF(intake)}
              className="w-full bg-gradient-cyber hover:shadow-glow text-ocean-deep"
            >
              <Download className="h-4 w-4 mr-2" />
              Download as PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
