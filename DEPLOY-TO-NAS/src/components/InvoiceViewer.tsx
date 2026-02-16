import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FileText, Download, Eye, DollarSign, AlertCircle, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { StripePaymentForm } from '@/components/StripePaymentForm'
import doloniaLogo from '@/assets/dolonia-logo.png'

type Invoice = {
  id: string
  invoice_number: string
  client_name: string
  client_email: string
  client_address?: string
  amount: number
  total_amount: number
  tax_amount?: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  due_date: string
  paid_date?: string
  notes?: string
  created_at: string
}

type LineItem = {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

export default function InvoiceViewer() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [lineItems, setLineItems] = useState<LineItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [pdfPreviewHTML, setPdfPreviewHTML] = useState<string>('')

  useEffect(() => {
    loadInvoices()

    // Set up real-time subscription to invoices table
    const channel = supabase
      .channel('invoices')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices',
        },
        (payload) => {
          // Reload invoices when there are changes
          loadInvoices()
        },
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  async function loadInvoices() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      console.log('Loading invoices for user:', user.id, 'email:', user.email)

      // Load invoices by user_id
      const { data: userInvoices, error: err1 } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (err1) {
        console.error('Error loading by user_id:', err1)
        throw err1
      }

      console.log('Invoices by user_id:', userInvoices?.length || 0)

      // Also load invoices by client_email
      const { data: emailInvoices, error: err2 } = await supabase
        .from('invoices')
        .select('*')
        .eq('client_email', user.email)
        .order('created_at', { ascending: false })

      if (err2) {
        console.error('Error loading by client_email:', err2)
        throw err2
      }

      console.log('Invoices by client_email:', emailInvoices?.length || 0)

      // Combine both lists and remove duplicates
      const allInvoices = [...(userInvoices || []), ...(emailInvoices || [])]

      // Remove duplicates by ID
      const uniqueInvoices = Array.from(new Map(allInvoices.map((inv) => [inv.id, inv])).values())

      console.log('Total unique invoices:', uniqueInvoices.length)
      setInvoices(uniqueInvoices as Invoice[])
    } catch (error) {
      console.error('Error loading invoices:', error)
      toast.error('Failed to load invoices')
    } finally {
      setLoading(false)
    }
  }

  async function loadLineItems(invoiceId: string, invoice: Invoice) {
    try {
      const { data, error } = await supabase
        .from('invoice_line_items')
        .select('*')
        .eq('invoice_id', invoiceId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setLineItems(data as LineItem[])

      // Generate PDF preview HTML
      const previewHTML = generateInvoiceHTML(invoice, data as LineItem[])
      setPdfPreviewHTML(previewHTML)
    } catch (error) {
      console.error('Error loading line items:', error)
      toast.error('Failed to load invoice details')
    }
  }

  function viewInvoice(invoice: Invoice) {
    setSelectedInvoice(invoice)
    loadLineItems(invoice.id, invoice)
    setIsDialogOpen(true)
    setShowPaymentForm(false) // Reset payment form when opening invoice
  }

  async function handlePaymentSuccess() {
    if (!selectedInvoice) return

    try {
      // Update invoice status to paid
      const { error } = await supabase
        .from('invoices')
        .update({
          status: 'paid',
          paid_date: new Date().toISOString(),
        })
        .eq('id', selectedInvoice.id)

      if (error) throw error

      toast.success('Payment successful! Invoice marked as paid.')
      setShowPaymentForm(false)
      setIsDialogOpen(false)
      loadInvoices() // Reload to show updated status
    } catch (error) {
      console.error('Error updating invoice:', error)
      toast.error('Payment processed but failed to update invoice status')
    }
  }

  function handlePaymentError(error: string) {
    toast.error(`Payment failed: ${error}`)
  }

  async function downloadInvoicePDF(invoice: Invoice) {
    try {
      // Load line items for this invoice
      const { data, error } = await supabase
        .from('invoice_line_items')
        .select('*')
        .eq('invoice_id', invoice.id)
        .order('created_at', { ascending: true })

      if (error) throw error

      const items = (data || []) as LineItem[]

      // Generate HTML for PDF
      const invoiceHTML = generateInvoiceHTML(invoice, items)

      // Create a temporary container
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = invoiceHTML
      tempDiv.style.position = 'absolute'
      tempDiv.style.left = '-9999px'
      tempDiv.style.width = '800px'
      document.body.appendChild(tempDiv)

      // Convert HTML to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      })

      // Create PDF from canvas
      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const pdf = new jsPDF('p', 'mm', 'a4')

      let heightLeft = imgHeight
      let position = 0

      const imgData = canvas.toDataURL('image/png')

      while (heightLeft >= 0) {
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= 297 // A4 height in mm
        position = heightLeft - imgHeight
      }

      pdf.save(`${invoice.invoice_number}.pdf`)

      // Clean up
      document.body.removeChild(tempDiv)

      toast.success('Invoice PDF downloaded successfully!')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to generate PDF')
    }
  }

  function generateInvoiceHTML(invoice: Invoice, items: LineItem[]) {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice ${invoice.invoice_number}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: white;
          }
          .invoice-container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            position: relative;
          }
          .letterhead {
            background: linear-gradient(135deg, #1a4d6d 0%, #0f3347 100%);
            padding: 30px 50px;
            color: white;
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-height: 120px;
          }
          .letterhead-left { 
            flex: 1;
            max-width: calc(100% - 160px);
            min-width: 0;
          }
          .letterhead-title {
            font-size: 24px;
            font-weight: 900;
            letter-spacing: 1px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            margin-bottom: 5px;
            line-height: 0.9;
            word-spacing: 2px;
            white-space: pre-line;
          }
          .letterhead-subtitle {
            font-size: 12px;
            font-weight: 300;
            letter-spacing: 1px;
            margin-top: 5px;
            opacity: 0.9;
          }
          .letterhead-contact {
            font-size: 11px;
            opacity: 0.85;
            margin-top: 10px;
          }
          .letterhead-logo {
            width: 120px;
            height: auto;
          }
          .content {
            padding: 40px 50px;
            position: relative;
          }
          .watermark {
            position: absolute;
            pointer-events: none;
            user-select: none;
            z-index: 0;
          }
          .watermark-top-left {
            top: 10%;
            left: 5%;
            opacity: 0.06;
            width: 250px;
          }
          .watermark-center {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0.08;
            width: 600px;
          }
          .watermark-bottom-right {
            bottom: 5%;
            right: 5%;
            opacity: 0.06;
            width: 250px;
          }
          .content-inner {
            position: relative;
            z-index: 1;
          }
          .invoice-header {
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 2px solid #e5e7eb;
          }
          .invoice-title {
            font-size: 24px;
            font-weight: 900;
            color: #1a4d6d;
            margin-bottom: 10px;
            letter-spacing: 1px;
          }
          .invoice-details {
            font-size: 12px;
            line-height: 1.8;
            color: #333;
          }
          .invoice-details strong {
            color: #1a4d6d;
          }
          .info-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
          }
          .info-block h3 {
            font-size: 10px;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 8px;
            font-weight: 600;
          }
          .info-block p {
            margin: 4px 0;
            color: #333;
            font-size: 14px;
          }
          .info-block p strong {
            font-weight: bold;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
          }
          thead {
            background: #1a4d6d;
            color: white;
          }
          th {
            padding: 12px;
            text-align: left;
            font-size: 12px;
            text-transform: uppercase;
            font-weight: 600;
          }
          th:last-child, td:last-child { text-align: right; }
          td {
            padding: 12px;
            border-bottom: 1px solid #eee;
            color: #333;
          }
          .totals {
            margin-left: auto;
            width: 300px;
            margin-top: 20px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 12px;
            color: #333;
          }
          .total-row.final {
            background: #1a4d6d;
            color: white;
            font-weight: bold;
            font-size: 18px;
            margin-top: 10px;
          }
          .notes {
            margin-top: 40px;
            padding: 20px;
            background: #f9f9f9;
            border-left: 4px solid #1a4d6d;
          }
          .notes h3 {
            color: #1a4d6d;
            margin-bottom: 10px;
            font-size: 14px;
          }
          .notes p {
            white-space: pre-line;
            line-height: 1.6;
            color: #333;
          }
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <!-- Letterhead -->
          <div class="letterhead">
            <div class="letterhead-left">
              <div class="letterhead-title">DOLONIA<br>DATA TECH</div>
              <div class="letterhead-subtitle">Dolonia.cloud</div>
              <div class="letterhead-contact">contact@dolonia.com | www.dolonia.com</div>
            </div>
            <img src="${doloniaLogo}" alt="Dolonia Logo" class="letterhead-logo" />
          </div>

          <!-- Content -->
          <div class="content">
            <!-- Watermarks -->
            <img src="${doloniaLogo}" alt="Watermark" class="watermark watermark-top-left" />
            <img src="${doloniaLogo}" alt="Watermark" class="watermark watermark-center" />
            <img src="${doloniaLogo}" alt="Watermark" class="watermark watermark-bottom-right" />

            <div class="content-inner">
              <!-- Invoice Header -->
              <div class="invoice-header">
                <div class="invoice-title">INVOICE</div>
                <div class="invoice-details">
                  <div><strong>Invoice #:</strong> ${invoice.invoice_number}</div>
                  <div><strong>Date Issued:</strong> ${new Date(invoice.created_at).toLocaleDateString()}</div>
                  <div><strong>Due Date:</strong> ${new Date(invoice.due_date).toLocaleDateString()}</div>
                </div>
              </div>

              <!-- Bill To / From -->
              <div class="info-section">
                <div class="info-block">
                  <h3>Bill To:</h3>
                  <p><strong>${invoice.client_name}</strong></p>
                  <p>${invoice.client_email}</p>
                  ${invoice.client_address ? `<p style="white-space: pre-line;">${invoice.client_address}</p>` : ''}
                </div>
                <div class="info-block">
                  <h3>From:</h3>
                  <p><strong>DOLONIA DATA TECH</strong></p>
                  <p>contact@dolonia.com</p>
                  <p>www.dolonia.com</p>
                </div>
              </div>

              <!-- Line Items Table -->
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${items
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.description}</td>
                      <td>${item.quantity}</td>
                      <td>$${item.rate.toFixed(2)}</td>
                      <td>$${item.amount.toFixed(2)}</td>
                    </tr>
                  `,
                    )
                    .join('')}
                </tbody>
              </table>

              <!-- Totals -->
              <div class="totals">
                <div class="total-row">
                  <span>Subtotal:</span>
                  <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="total-row final">
                  <span>Total Due:</span>
                  <span>$${invoice.total_amount.toFixed(2)}</span>
                </div>
              </div>

              <!-- Notes -->
              ${
                invoice.notes
                  ? `
                <div class="notes">
                  <h3>Notes</h3>
                  <p>${invoice.notes}</p>
                </div>
              `
                  : ''
              }
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }

  function getStatusBadge(status: string) {
    const variants: Record<
      string,
      { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }
    > = {
      paid: { variant: 'default', label: 'Paid' },
      sent: { variant: 'secondary', label: 'Sent' },
      overdue: { variant: 'destructive', label: 'Overdue' },
      draft: { variant: 'outline', label: 'Draft' },
      cancelled: { variant: 'outline', label: 'Cancelled' },
    }

    const config = variants[status] || { variant: 'outline' as const, label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <Card className="bg-ocean-surface/60" style={{ borderColor: 'rgba(26, 77, 109, 0.1)' }}>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Loading invoices...</p>
        </CardContent>
      </Card>
    )
  }

  const totalOutstanding = invoices
    .filter((inv) => inv.status !== 'paid' && inv.status !== 'cancelled')
    .reduce((sum, inv) => sum + inv.total_amount, 0)

  const overdueCount = invoices.filter(
    (inv) =>
      inv.status === 'overdue' || (inv.status === 'sent' && new Date(inv.due_date) < new Date()),
  ).length

  return (
    <>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-ocean-surface/60" style={{ borderColor: 'rgba(26, 77, 109, 0.1)' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Total Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{invoices.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-ocean-surface/60" style={{ borderColor: 'rgba(26, 77, 109, 0.1)' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Outstanding Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${totalOutstanding.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-ocean-surface/60" style={{ borderColor: 'rgba(26, 77, 109, 0.1)' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Overdue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{overdueCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Invoices List */}
        <Card className="bg-ocean-surface/60" style={{ borderColor: 'rgba(26, 77, 109, 0.1)' }}>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Your Invoices
            </CardTitle>
            <CardDescription>View and download your invoices</CardDescription>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No invoices yet</p>
                <p className="text-sm mt-2">Your invoices will appear here once they are created</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow style={{ borderColor: 'rgba(26, 77, 109, 0.1)' }}>
                      <TableHead style={{ color: '#1a4d6d' }}>Invoice #</TableHead>
                      <TableHead style={{ color: '#1a4d6d' }}>Date</TableHead>
                      <TableHead style={{ color: '#1a4d6d' }}>Due Date</TableHead>
                      <TableHead style={{ color: '#1a4d6d' }}>Amount</TableHead>
                      <TableHead style={{ color: '#1a4d6d' }}>Status</TableHead>
                      <TableHead style={{ color: '#1a4d6d' }} className="text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id} style={{ borderColor: 'rgba(26, 77, 109, 0.1)' }}>
                        <TableCell className="font-medium text-foreground">
                          {invoice.invoice_number}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(invoice.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(invoice.due_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-semibold text-foreground">
                          ${invoice.total_amount.toFixed(2)}
                        </TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewInvoice(invoice)}
                            style={{ color: '#1a4d6d' }}
                            className="hover:opacity-70"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadInvoicePDF(invoice)}
                            style={{ color: '#1a4d6d' }}
                            className="hover:opacity-70"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedInvoice(invoice)
                                loadLineItems(invoice.id, invoice)
                                setIsDialogOpen(true)
                                setShowPaymentForm(true)
                              }}
                              className="hover:opacity-70"
                              style={{ color: '#16a34a' }}
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Invoice Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="bg-ocean-deep max-w-4xl max-h-[90vh] overflow-y-auto"
          style={{ borderColor: 'rgba(26, 77, 109, 0.2)' }}
        >
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Invoice {selectedInvoice?.invoice_number}
            </DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-6">
              {/* PDF Preview */}
              <div
                className="bg-white rounded-lg shadow-lg overflow-hidden"
                style={{
                  maxHeight: '600px',
                  overflowY: 'auto',
                }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: pdfPreviewHTML }}
                  style={{
                    transform: 'scale(0.95)',
                    transformOrigin: 'top center',
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => downloadInvoicePDF(selectedInvoice)}
                  style={{ borderColor: 'rgba(26, 77, 109, 0.2)', color: '#1a4d6d' }}
                  className="hover:bg-ocean-surface/40"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                {selectedInvoice.status !== 'paid' &&
                  selectedInvoice.status !== 'cancelled' &&
                  !showPaymentForm && (
                    <Button
                      onClick={() => setShowPaymentForm(true)}
                      style={{ backgroundColor: '#16a34a' }}
                      className="hover:opacity-90"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Now
                    </Button>
                  )}
              </div>

              {/* Stripe Payment Form */}
              {showPaymentForm &&
                selectedInvoice.status !== 'paid' &&
                selectedInvoice.status !== 'cancelled' && (
                  <div
                    className="mt-6 pt-6"
                    style={{ borderTopWidth: '1px', borderTopColor: 'rgba(26, 77, 109, 0.2)' }}
                  >
                    <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a4d6d' }}>
                      Payment Details
                    </h3>
                    <StripePaymentForm
                      amount={selectedInvoice.total_amount}
                      currency="usd"
                      description={`Invoice #${selectedInvoice.invoice_number}`}
                      metadata={{
                        invoiceId: selectedInvoice.id,
                        invoiceNumber: selectedInvoice.invoice_number,
                        clientEmail: selectedInvoice.client_email,
                      }}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                    <Button
                      variant="outline"
                      onClick={() => setShowPaymentForm(false)}
                      className="w-full mt-4"
                      style={{ borderColor: 'rgba(26, 77, 109, 0.2)' }}
                    >
                      Cancel Payment
                    </Button>
                  </div>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
