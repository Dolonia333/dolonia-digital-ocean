import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import Layout from '@/components/Layout'
import SEO from '@/components/SEO'
import { HeadphonesIcon, ArrowLeft } from 'lucide-react'

export default function TicketSubmission() {
  const navigate = useNavigate()
  const [ticketTitle, setTicketTitle] = useState('')
  const [ticketDescription, setTicketDescription] = useState('')
  const [ticketCategory, setTicketCategory] = useState('general')
  const [ticketPriority, setTicketPriority] = useState('medium')
  const [submittingTicket, setSubmittingTicket] = useState(false)

  async function submitTicket() {
    if (!ticketTitle.trim() || !ticketDescription.trim()) {
      toast.error('Please provide both a title and description')
      return
    }

    setSubmittingTicket(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        toast.error('You must be logged in to submit a ticket')
        navigate('/account')
        return
      }

      const { error } = await supabase.from('tickets').insert({
        title: ticketTitle,
        description: ticketDescription,
        category: ticketCategory,
        priority: ticketPriority,
        created_by: user.id,
        status: 'open',
      })

      if (error) throw error

      toast.success('Support ticket submitted successfully')
      setTicketTitle('')
      setTicketDescription('')
      setTicketCategory('general')
      setTicketPriority('medium')

      // Redirect back to account page after a short delay
      setTimeout(() => {
        navigate('/account')
      }, 1500)
    } catch (error) {
      console.error('Error submitting ticket:', error)
      toast.error('Failed to submit ticket: ' + (error as Error).message)
    } finally {
      setSubmittingTicket(false)
    }
  }

  return (
    <Layout>
      <SEO
        title="Submit Support Ticket - Dolonia Digital Ocean"
        description="Submit a support ticket and get help from our team"
      />

      <div className="min-h-screen bg-gradient-to-br from-ocean-deep via-ocean-deep to-ocean-surface py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/account')}
            className="mb-6 text-cyan-bright hover:text-cyan-bright/80 hover:bg-cyan-bright/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          {/* Main Card */}
          <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-16 h-16 bg-cyan-bright/10 rounded-full flex items-center justify-center mb-4">
                <HeadphonesIcon className="h-8 w-8 text-cyan-bright" />
              </div>
              <CardTitle className="text-3xl font-bold text-cyan-bright">
                Submit Support Ticket
              </CardTitle>
              <CardDescription className="text-lg">
                Get help from our team - we're here to assist you
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <label
                  htmlFor="ticketTitle"
                  className="block text-sm font-medium mb-2 text-foreground"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  id="ticketTitle"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  placeholder="Brief description of your issue"
                  className="bg-ocean-deep border-cyan-bright/20 text-foreground h-12 text-base"
                />
              </div>

              <div>
                <label
                  htmlFor="ticketDescription"
                  className="block text-sm font-medium mb-2 text-foreground"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="ticketDescription"
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  placeholder="Provide details about your request or issue..."
                  rows={8}
                  className="bg-ocean-deep border-cyan-bright/20 text-foreground text-base"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Please provide as much detail as possible to help us assist you better.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="ticketCategory"
                    className="block text-sm font-medium mb-2 text-foreground"
                  >
                    Category
                  </label>
                  <select
                    id="ticketCategory"
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full rounded-md bg-ocean-deep border border-cyan-bright/20 px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-bright/50"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="ticketPriority"
                    className="block text-sm font-medium mb-2 text-foreground"
                  >
                    Priority
                  </label>
                  <select
                    id="ticketPriority"
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value)}
                    className="w-full rounded-md bg-ocean-deep border border-cyan-bright/20 px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-bright/50"
                  >
                    <option value="low">Low - General question</option>
                    <option value="medium">Medium - Need assistance</option>
                    <option value="high">High - Urgent matter</option>
                    <option value="urgent">Urgent - Critical issue</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <Button
                  onClick={submitTicket}
                  disabled={submittingTicket || !ticketTitle.trim() || !ticketDescription.trim()}
                  className="flex-1 bg-cyan-bright text-ocean-deep hover:bg-cyan-bright/90 h-12 text-base font-semibold"
                >
                  {submittingTicket ? 'Submitting...' : 'Submit Ticket'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/account')}
                  disabled={submittingTicket}
                  className="border-cyan-bright/20 text-foreground hover:bg-cyan-bright/5 h-12 px-8"
                >
                  Cancel
                </Button>
              </div>

              <div className="mt-6 p-4 bg-cyan-bright/5 border border-cyan-bright/10 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Tip:</strong> You'll receive a response from our team within 24 hours.
                  You can track your ticket status in your dashboard.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
