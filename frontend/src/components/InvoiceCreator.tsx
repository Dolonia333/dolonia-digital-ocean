import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import { FileText, Plus, Trash2, Download } from 'lucide-react'
import doloniaLogo from '@/assets/dolonia-logo.png'
import BinaryRain from '@/components/BinaryRain'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

type InvoiceItem = {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

type InvoiceCreatorProps = {
  onInvoiceCreated?: () => void
}

// Generate unique ID (compatible with all browsers)
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9)

// Dolonia Services Catalog
const DOLONIA_SERVICES = [
  {
    category: 'Infrastructure & Hosting',
    services: [
      { name: 'Hybrid NAS-Cloud Hosting Setup', rate: 2500 },
      { name: 'Self-Hosting Server Setup (Docker + HTTPS)', rate: 1800 },
      { name: 'Network Design & Installation', rate: 3000 },
      { name: 'Server Provisioning & Deployment', rate: 1500 },
      { name: 'Cloudflare Zero-Trust Configuration', rate: 800 },
      { name: 'Data Backup & Recovery System', rate: 1200 },
      { name: 'VPN & Remote Access Setup', rate: 900 },
      { name: 'NAS Optimization & Expansion', rate: 1000 },
      { name: 'Supabase/Postgres Database Hosting (Monthly)', rate: 500 },
    ],
  },
  {
    category: 'Web Development',
    services: [
      { name: 'Custom Website Design & Development', rate: 5000 },
      { name: 'Full-Stack Application Build', rate: 8000 },
      { name: 'E-commerce Development & Integration', rate: 6500 },
      { name: 'API Creation & Integration', rate: 2500 },
      { name: 'Website Migration to Self-Hosted', rate: 2000 },
      { name: 'Client Portal & Dashboard Development', rate: 4500 },
      { name: 'Automated Forms & Intake Systems', rate: 1800 },
      { name: 'SEO & Analytics Integration', rate: 1200 },
      { name: 'UI/UX Optimization', rate: 2200 },
    ],
  },
  {
    category: 'AI & Automation',
    services: [
      { name: 'AI Assistant & Chatbot Deployment', rate: 3500 },
      { name: 'Workflow Automation (n8n Pipelines)', rate: 2500 },
      { name: 'AI Model Training & Fine-Tuning', rate: 4000 },
      { name: 'Voice Control Integration', rate: 2000 },
      { name: 'Machine Learning Model Deployment', rate: 3800 },
      { name: 'Business Intelligence Dashboard', rate: 3200 },
      { name: 'Web Scraper & Data Collection Bot', rate: 1500 },
      { name: 'AI-Powered Document Generation', rate: 1800 },
      { name: 'Predictive Analytics System', rate: 4500 },
    ],
  },
  {
    category: 'Data Management',
    services: [
      { name: 'Data Collection & Storage Pipeline', rate: 2800 },
      { name: 'Database Architecture Design', rate: 3500 },
      { name: 'Secure Data Archiving System', rate: 2000 },
      { name: 'Data API Creation for Resale', rate: 3000 },
      { name: 'Data Analytics Dashboard', rate: 2500 },
      { name: 'GDPR/HIPAA Compliance Setup', rate: 3500 },
    ],
  },
  {
    category: 'Cybersecurity',
    services: [
      { name: 'Zero-Trust Architecture Deployment', rate: 4000 },
      { name: 'VPN & Proxy Configuration', rate: 1200 },
      { name: 'Network Monitoring & Threat Detection', rate: 2500 },
      { name: 'Penetration Testing & Security Audit', rate: 3500 },
      { name: 'Firewall & Router Hardening', rate: 1500 },
      { name: 'Data Encryption & Privacy Setup', rate: 2000 },
    ],
  },
  {
    category: 'Web3 & Blockchain',
    services: [
      { name: 'Web3 Wallet Integration', rate: 2500 },
      { name: 'Smart Contract Development', rate: 5000 },
      { name: 'NFT Platform Integration', rate: 4000 },
      { name: 'Blockchain Node Hosting', rate: 2000 },
      { name: 'Crypto Payment Integration', rate: 2200 },
    ],
  },
  {
    category: 'Consulting & Advisory',
    services: [
      { name: 'Federal Contract Readiness Consulting', rate: 3000 },
      { name: 'SBA Funding Strategy Development', rate: 2500 },
      { name: 'Business Automation Consulting', rate: 2000 },
      { name: 'IT Management Consulting (Monthly)', rate: 4000 },
      { name: 'Technical Documentation Creation', rate: 1500 },
    ],
  },
  {
    category: 'Maintenance & Support',
    services: [
      { name: 'Monthly Server Maintenance Package', rate: 800 },
      { name: '24/7 Infrastructure Monitoring', rate: 1200 },
      { name: 'Quarterly Security Audit', rate: 2500 },
      { name: 'Client Support Portal Setup', rate: 1800 },
      { name: 'Custom SLA Support Agreement (Monthly)', rate: 1500 },
    ],
  },
  {
    category: 'Custom Services',
    services: [
      { name: 'Custom Service (Specify in Description)', rate: 0 },
      { name: 'Hourly Consulting Rate', rate: 150 },
    ],
  },
]

type NotePresetValue = 'standard' | 'net15' | 'dueOnReceipt' | 'custom'

const DEFAULT_NOTES_TEXT = `Payment Terms
Payment is due within 30 days of invoice date. Please make checks payable to DOLONIA DATA TECH or pay via bank transfer. Late payments may incur a 1.5% monthly interest charge.

Thank you for choosing DOLONIA DATA TECH for your business needs!`

const NOTE_PRESETS: Array<{ value: NotePresetValue; label: string; text: string }> = [
  { value: 'standard', label: 'Net 30 (Default)', text: DEFAULT_NOTES_TEXT },
  {
    value: 'net15',
    label: 'Net 15',
    text: `Payment Terms
Payment is due within 15 days of invoice date. Preferred payment methods include ACH transfer or certified check. Late payments may incur a 2% monthly interest charge.

We appreciate your prompt attention and continued partnership.`,
  },
  {
    value: 'dueOnReceipt',
    label: 'Due on Receipt',
    text: `Payment Terms
Payment is due upon receipt of this invoice. Please submit payment via the secure client portal link provided separately. A late fee of 3% will be applied every 15 days past due.

Thank you for your business with DOLONIA DATA TECH.`,
  },
  { value: 'custom', label: 'Custom', text: '' },
]

const DEFAULT_NOTES_PRESET: NotePresetValue = 'standard'

export default function InvoiceCreator({ onInvoiceCreated }: InvoiceCreatorProps) {
  // State declarations MUST come before any hooks that use them
  const [open, setOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string>('') // Link to user profile
  const [availableClients, setAvailableClients] = useState<
    Array<{ id: string; name: string; email: string }>
  >([])
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientAddress, setClientAddress] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now()}`)
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState('')
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: generateId(), description: '', quantity: 1, rate: 0, amount: 0 },
  ])
  const [notes, setNotes] = useState(DEFAULT_NOTES_TEXT)
  const [notesPreset, setNotesPreset] = useState<NotePresetValue>(DEFAULT_NOTES_PRESET)

  // Load Allura font
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Allura&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => {
      document.head.removeChild(link)
    }
  }, [])

  // Load available clients (profiles + intake forms)
  useEffect(() => {
    async function loadClients() {
      try {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, role')
          .neq('role', 'admin')

        const { data: intakeForms, error: intakeError } = await supabase
          .from('intake_forms')
          .select('id, full_name, email')

        if (profilesError) throw profilesError
        if (intakeError) console.warn('Could not load intake forms:', intakeError)

        const clientList: Array<{ id: string; name: string; email: string }> = []

        // Add profiles as clients
        if (profiles) {
          profiles.forEach((p) => {
            clientList.push({
              id: p.id,
              name: p.name || 'Unnamed User',
              email: p.id, // We'll need to get email from auth metadata separately
            })
          })
        }

        // Add intake form submissions
        if (intakeForms) {
          intakeForms.forEach((form: { id: string; full_name: string; email: string }) => {
            clientList.push({
              id: form.id,
              name: form.full_name,
              email: form.email,
            })
          })
        }

        setAvailableClients(clientList)
      } catch (error) {
        console.error('Error loading clients:', error)
      }
    }

    if (open) {
      loadClients()
    }
  }, [open])

  // Additional state declarations
  const [customNotes, setCustomNotes] = useState('')
  const [signatureName, setSignatureName] = useState('')
  const [creating, setCreating] = useState(false)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [discountReason, setDiscountReason] = useState('')
  const [companyEmail, setCompanyEmail] = useState('contact@dolonia.com')
  const [companyWebsite, setCompanyWebsite] = useState('www.dolonia.com')

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: generateId(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    }
    setItems([...items, newItem])
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === 'quantity' || field === 'rate') {
            updated.amount = updated.quantity * updated.rate
          }
          return updated
        }
        return item
      }),
    )
  }

  const handleNotesPresetChange = (value: NotePresetValue) => {
    setNotesPreset(value)

    if (value === 'custom') {
      setNotes(customNotes)
      return
    }

    const preset = NOTE_PRESETS.find((presetOption) => presetOption.value === value)
    if (preset) {
      setNotes(preset.text)
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const discount = discountAmount
  const afterDiscount = subtotal - discount
  const tax = afterDiscount * 0.0 // Adjust tax rate as needed
  const total = afterDiscount + tax

  const generateInvoiceHTML = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Allura&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 40px 20px;
    }
    .invoice-container {
      max-width: 850px;
      margin: 0 auto;
      background: white;
      padding: 0;
      box-shadow: 0 0 30px rgba(0,0,0,0.15);
      position: relative;
    }
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 120px;
      font-weight: 900;
      color: rgba(14, 165, 233, 0.05);
      letter-spacing: 10px;
      z-index: 0;
      pointer-events: none;
      user-select: none;
    }
    .content {
      position: relative;
      z-index: 1;
      padding: 60px 70px;
    }
    .letterhead {
      background: linear-gradient(135deg, #1a4d6d 0%, #0f3347 100%);
      padding: 40px 70px;
      margin: 0;
      color: white;
      position: relative;
    }
    .logo-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 15px;
    }
    .logo-section-left {
      flex: 1;
      max-width: calc(100% - 160px);
      min-width: 0;
    }
    .logo-section-image {
      width: 120px;
      height: auto;
    }
    .logo {
      font-size: 32px;
      font-weight: 900;
      color: white;
      letter-spacing: 1px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
      line-height: 0.9;
      word-spacing: 2px;
      white-space: pre-line;
    }
    .company-tagline {
      font-size: 14px;
      color: rgba(255,255,255,0.9);
      font-weight: 300;
      letter-spacing: 1px;
    }
    .company-info {
      font-size: 13px;
      color: rgba(255,255,255,0.85);
      line-height: 1.8;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e5e7eb;
      position: relative;
    }
    .header-logo {
      position: absolute;
      top: 0;
      right: 0;
      width: 120px;
      height: auto;
    }
    .invoice-details {
      text-align: left;
    }
    .invoice-title {
      font-size: 32px;
      font-weight: 900;
      color: #1a4d6d;
      margin-bottom: 15px;
      letter-spacing: 1px;
    }
    .invoice-meta {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 8px 15px;
      font-size: 14px;
    }
    .invoice-meta strong {
      color: #1a4d6d;
    }
    .info-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    .info-block h3 {
      font-size: 12px;
      text-transform: uppercase;
      color: #666;
      margin-bottom: 10px;
      font-weight: 600;
    }
    .info-block p {
      margin: 5px 0;
      color: #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    thead {
      background: #1a4d6d;
      color: white;
    }
    th {
      padding: 12px;
      text-align: left;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
    }
    th:last-child, td:last-child {
      text-align: right;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }
    tbody tr:hover {
      background: #f9f9f9;
    }
    .totals {
      margin-left: auto;
      width: 300px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 12px;
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
      font-size: 14px;
      color: #000;
      margin-bottom: 10px;
      text-transform: uppercase;
    }
    .notes p {
      color: #000;
    }
    .signature-section {
      margin-top: 60px;
      display: flex;
      justify-content: flex-end;
    }
    .signature-box {
      text-align: center;
      min-width: 250px;
    }
    .signature-line {
      font-family: 'Allura', cursive;
      font-size: 56px;
      font-weight: 400;
      color: #1a4d6d;
      margin-bottom: 5px;
      padding-bottom: 10px;
      border-bottom: 2px solid #333;
    }
    .signature-name {
      font-size: 11px;
      color: #666;
      text-transform: uppercase;
      margin-top: 5px;
      letter-spacing: 2px;
    }
    .footer {
      margin-top: 60px;
      padding-top: 30px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
    }
    .footer-stamp {
      display: inline-block;
      border: 3px solid #1a4d6d;
      padding: 15px 30px;
      margin-bottom: 20px;
      transform: rotate(-5deg);
    }
    .footer-stamp-text {
      font-size: 20px;
      font-weight: 900;
      color: #1a4d6d;
      letter-spacing: 3px;
    }
    .footer-info {
      font-size: 12px;
      color: #999;
      line-height: 2;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .invoice-container {
        box-shadow: none;
        max-width: 100%;
      }
      .content {
        padding: 40px 50px;
      }
      .letterhead {
        padding: 30px 50px;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="watermark">DOLONIA DATA TECH</div>

    <div class="letterhead">
      <div class="logo-section">
        <div class="logo-section-left">
          <div class="logo">DOLONIA<br>DATA TECH</div>
          <div class="company-tagline">Dolonia.cloud</div>
        </div>
        <img src="${doloniaLogo}" alt="Dolonia Logo" class="logo-section-image" />
      </div>
      <div class="company-info">
        ${companyEmail} | ${companyWebsite}
      </div>
    </div>

    <div class="content">
      <div class="header">
        <div class="invoice-details">
          <div class="invoice-title">INVOICE</div>
          <div class="invoice-meta">
            <strong>Invoice #:</strong> <span>${invoiceNumber}</span>
            <strong>Date Issued:</strong> <span>${new Date(invoiceDate).toLocaleDateString()}</span>
            <strong>Due Date:</strong> <span>${new Date(dueDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>      <div class="info-section">
        <div class="info-block">
          <h3>Bill To:</h3>
          <p><strong>${clientName}</strong></p>
          <p>${clientEmail}</p>
          ${clientAddress ? `<p>${clientAddress.replace(/\n/g, '<br>')}</p>` : ''}
        </div>
        <div class="info-block">
          <h3>From:</h3>
          <p><strong>DOLONIA DATA TECH</strong></p>
          <p>${companyEmail}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align: center;">Quantity</th>
            <th style="text-align: center;">Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (item) => `
            <tr>
              <td>${item.description}</td>
              <td style="text-align: center;">${item.quantity}</td>
              <td style="text-align: center;">$${item.rate.toFixed(2)}</td>
              <td>$${item.amount.toFixed(2)}</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>

      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>$${subtotal.toFixed(2)}</span>
        </div>
        ${
          discount > 0
            ? `
        <div class="total-row" style="color: #ef4444;">
          <span>Discount${discountReason ? `: ${discountReason}` : ''}:</span>
          <span>-$${discount.toFixed(2)}</span>
        </div>
        `
            : ''
        }
        ${
          tax > 0
            ? `
        <div class="total-row">
          <span>Tax:</span>
          <span>$${tax.toFixed(2)}</span>
        </div>
        `
            : ''
        }
        <div class="total-row final">
          <span>Total:</span>
          <span>$${total.toFixed(2)}</span>
        </div>
      </div>

      ${
        notes
          ? `
      <div class="notes">
        <h3>Notes</h3>
        <p>${notes.replace(/\n/g, '<br>')}</p>
      </div>
      `
          : ''
      }

      ${
        signatureName
          ? `
      <div class="signature-section">
        <div class="signature-box">
          <div class="signature-line">${signatureName}</div>
          <div class="signature-name">Authorized Signature</div>
        </div>
      </div>
      `
          : ''
      }

      <div class="footer">
        <div class="footer-stamp">
          <div class="footer-stamp-text">DOLONIA DATA TECH</div>
        </div>
        <div class="footer-info">
          Thank you for your business!<br>
          For questions about this invoice, please contact ${companyEmail}
        </div>
      </div>
    </div>
  </div>
</body>
</html>
    `
  }

  const downloadInvoice = async () => {
    try {
      // Create a temporary container
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = generateInvoiceHTML()
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

      pdf.save(`${invoiceNumber}.pdf`)

      // Clean up
      document.body.removeChild(tempDiv)

      toast.success('Invoice PDF downloaded successfully!')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to generate PDF. Please try again.')
    }
  }

  const createInvoice = async () => {
    // Detailed validation with specific error messages
    if (!clientName) {
      toast.error('Please enter Client Name')
      return
    }

    if (!clientEmail) {
      toast.error('Please enter Client Email')
      return
    }

    if (!dueDate) {
      toast.error('Please select a Due Date')
      return
    }

    if (items.length === 0) {
      toast.error('Please add at least one line item')
      return
    }

    const hasValidItems = items.some((item) => item.description && item.description.trim() !== '')
    if (!hasValidItems) {
      toast.error('Please add descriptions to at least one line item')
      return
    }

    setCreating(true)
    try {
      // Save invoice to database
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          user_id: selectedUserId || null,
          client_name: clientName,
          client_email: clientEmail,
          client_address: clientAddress || null,
          due_date: dueDate,
          amount: subtotal,
          total_amount: total,
          status: 'sent',
          notes: notes,
        })
        .select()
        .single()

      if (invoiceError) throw invoiceError

      // Save line items
      if (invoiceData && items.length > 0) {
        const lineItems = items.map((item) => ({
          invoice_id: invoiceData.id,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount,
        }))

        const { error: lineItemsError } = await supabase
          .from('invoice_line_items')
          .insert(lineItems)

        if (lineItemsError) {
          console.error('Error saving line items:', lineItemsError)
        }
      }

      // Automatically upgrade client to 'client' role if they receive an invoice
      if (clientEmail) {
        try {
          // Find the profile by email
          // @ts-expect-error - profiles table schema
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, role')
            .eq('email', clientEmail)

          if (profileData && Array.isArray(profileData) && profileData.length > 0) {
            const profile = profileData[0] as { id: string; role: string }
            if (
              profile.role !== 'admin' &&
              profile.role !== 'team_member' &&
              profile.role !== 'client'
            ) {
              // Upgrade to client role
              const { error: roleError } = await supabase
                .from('profiles')
                .update({ role: 'client' })
                .eq('id', profile.id)

              if (roleError) {
                console.warn('Could not upgrade client role:', roleError)
              } else {
                console.log('Client automatically upgraded to client role upon invoice creation')
              }
            }
          }
        } catch (e) {
          console.warn('Could not find or upgrade client profile:', e)
          // Don't throw - invoice creation was successful
        }
      }

      // Send notification to client
      if (selectedUserId) {
        const { error: notifError } = await supabase.from('notifications').insert({
          message: `New invoice ${invoiceNumber} for $${total.toFixed(2)} has been sent to you. Due date: ${dueDate}`,
          recipients: [selectedUserId],
          created_by: (await supabase.auth.getUser()).data.user?.id,
        })

        if (notifError) {
          console.error('Error sending notification:', notifError)
        }
      }

      // Download the PDF invoice
      downloadInvoice()

      toast.success('Invoice created and sent successfully!')
      setOpen(false)

      // Reset form
      setSelectedUserId('')
      setClientName('')
      setClientEmail('')
      setClientAddress('')
      setInvoiceNumber(`INV-${Date.now()}`)
      setInvoiceDate(new Date().toISOString().split('T')[0])
      setDueDate('')
      setItems([{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }])
      setNotesPreset(DEFAULT_NOTES_PRESET)
      setCustomNotes('')
      setNotes(DEFAULT_NOTES_TEXT)
      setSignatureName('')
      setDiscountAmount(0)
      setDiscountReason('')

      if (onInvoiceCreated) onInvoiceCreated()
    } catch (error) {
      console.error('Error creating invoice:', error)
      toast.error('Failed to create invoice: ' + (error as Error).message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-cyan-bright text-ocean-deep hover:bg-cyan-bright/90"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Invoice
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-ocean-deep border-cyan-bright/20 max-w-[98vw] sm:max-w-[95vw] w-full sm:w-[90vw] lg:w-[1400px] max-h-[98vh] sm:max-h-[95vh] flex flex-col p-2 sm:p-4 lg:p-6">
          <DialogHeader className="pb-2 sm:pb-4 shrink-0">
            <DialogTitle className="text-foreground flex items-center gap-2 text-sm sm:text-base lg:text-lg">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              Create New Invoice
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 overflow-y-auto flex-1">
            {/* LEFT SIDE - Form */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-6 overflow-y-auto lg:pr-4">
              {/* Company Contact Information */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-cyan-bright font-semibold text-xs sm:text-sm lg:text-base">
                  Your Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                  <div className="space-y-1 sm:space-y-2">
                    <Label className="text-foreground text-xs sm:text-sm">Company Email</Label>
                    <Input
                      type="email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      placeholder="contact@company.com"
                      className="bg-ocean-surface border-cyan-bright/20 text-foreground text-xs sm:text-sm h-8 sm:h-9 lg:h-10"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <Label className="text-foreground text-xs sm:text-sm">Company Website</Label>
                    <Input
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      placeholder="www.company.com"
                      className="bg-ocean-surface border-cyan-bright/20 text-foreground text-xs sm:text-sm h-8 sm:h-9 lg:h-10"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-cyan-bright font-semibold text-xs sm:text-sm lg:text-base">
                  Invoice Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                  <div className="space-y-1 sm:space-y-2">
                    <Label className="text-foreground text-xs sm:text-sm">Invoice Number</Label>
                    <Input
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="bg-ocean-surface border-cyan-bright/20 text-foreground text-xs sm:text-sm h-8 sm:h-9 lg:h-10"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <Label className="text-foreground text-xs sm:text-sm">Invoice Date</Label>
                    <Input
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="bg-ocean-surface border-cyan-bright/20 text-foreground text-xs sm:text-sm h-8 sm:h-9 lg:h-10"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <Label className="text-foreground text-xs sm:text-sm">Due Date *</Label>
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="bg-ocean-surface border-cyan-bright/20 text-foreground text-xs sm:text-sm h-8 sm:h-9 lg:h-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-cyan-bright font-semibold text-xs sm:text-sm lg:text-base">
                  Client Information
                </h3>

                {/* Client Selector */}
                {availableClients.length > 0 && (
                  <div className="space-y-1 sm:space-y-2">
                    <Label className="text-foreground text-xs sm:text-sm">
                      Select Existing Client (Optional)
                    </Label>
                    <Select
                      value={selectedUserId}
                      onValueChange={(value) => {
                        setSelectedUserId(value)
                        const client = availableClients.find((c) => c.id === value)
                        if (client) {
                          setClientName(client.name)
                          setClientEmail(client.email)
                        }
                      }}
                    >
                      <SelectTrigger className="bg-ocean-surface border-cyan-bright/20 text-foreground text-xs sm:text-sm h-8 sm:h-9 lg:h-10">
                        <SelectValue placeholder="Select a client or enter manually below" />
                      </SelectTrigger>
                      <SelectContent className="bg-ocean-deep border-cyan-bright/20">
                        {availableClients.map((client) => (
                          <SelectItem
                            key={client.id}
                            value={client.id}
                            className="text-foreground text-xs sm:text-sm"
                          >
                            {client.name} ({client.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                  <div className="space-y-1 sm:space-y-2">
                    <Label className="text-foreground text-xs sm:text-sm">Client Name *</Label>
                    <Input
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Company or Individual Name"
                      className="bg-ocean-surface border-cyan-bright/20 text-foreground text-xs sm:text-sm h-8 sm:h-9 lg:h-10"
                      required
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <Label className="text-foreground text-xs sm:text-sm">Client Email *</Label>
                    <Input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="client@example.com"
                      className="bg-ocean-surface border-cyan-bright/20 text-foreground text-xs sm:text-sm h-8 sm:h-9 lg:h-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-foreground text-xs sm:text-sm">
                    Client Address (Optional)
                  </Label>
                  <Textarea
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="Street Address, City, State, ZIP"
                    className="bg-ocean-surface border-cyan-bright/20 text-foreground text-xs sm:text-sm"
                    rows={2}
                  />
                </div>
              </div>

              {/* Company Contact Information */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-cyan-bright font-semibold text-sm sm:text-base">
                  Your Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground text-xs sm:text-sm">Company Email</Label>
                    <Input
                      type="email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      placeholder="contact@company.com"
                      className="bg-ocean-surface border-cyan-bright/20 text-foreground text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground text-xs sm:text-sm">Company Website</Label>
                    <Input
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      placeholder="www.company.com"
                      className="bg-ocean-surface border-cyan-bright/20 text-foreground text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-cyan-bright font-semibold text-xs sm:text-sm lg:text-base">
                    Line Items
                  </h3>
                  <Button
                    type="button"
                    onClick={addItem}
                    size="sm"
                    variant="outline"
                    className="border-cyan-bright/40 text-cyan-bright w-full sm:w-auto text-xs h-7 sm:h-8"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Item
                  </Button>
                </div>

                {items.map((item, index) => (
                  <Card key={item.id} className="bg-ocean-surface/50 border-cyan-bright/10">
                    <CardContent className="p-2 sm:p-3 lg:p-4">
                      <div className="space-y-2 sm:space-y-3">
                        {/* Service Selector */}
                        <div className="space-y-1 sm:space-y-2">
                          <Label className="text-xs text-foreground">Select Service</Label>
                          <Select
                            onValueChange={(value) => {
                              const [categoryIndex, serviceIndex] = value.split('-').map(Number)
                              const service = DOLONIA_SERVICES[categoryIndex].services[serviceIndex]
                              setItems(
                                items.map((i) => {
                                  if (i.id === item.id) {
                                    return {
                                      ...i,
                                      description: service.name,
                                      rate: service.rate,
                                      amount: i.quantity * service.rate,
                                    }
                                  }
                                  return i
                                }),
                              )
                            }}
                          >
                            <SelectTrigger className="bg-ocean-deep border-cyan-bright/20 text-foreground text-xs h-8 sm:h-9">
                              <SelectValue placeholder="Choose a service or enter custom..." />
                            </SelectTrigger>
                            <SelectContent className="bg-ocean-deep border-cyan-bright/20">
                              {DOLONIA_SERVICES.map((category, catIdx) => (
                                <div key={catIdx}>
                                  <div className="px-2 py-1.5 text-xs font-semibold text-cyan-bright uppercase">
                                    {category.category}
                                  </div>
                                  {category.services.map((service, svcIdx) => (
                                    <SelectItem
                                      key={`${catIdx}-${svcIdx}`}
                                      value={`${catIdx}-${svcIdx}`}
                                      className="text-foreground hover:bg-cyan-bright/10 text-xs md:text-sm"
                                    >
                                      {service.name} - ${service.rate.toLocaleString()}
                                    </SelectItem>
                                  ))}
                                </div>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Manual Entry Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3">
                          <div className="sm:col-span-5 space-y-1 sm:space-y-2">
                            <Label className="text-xs text-foreground">Description</Label>
                            <Input
                              value={item.description}
                              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                              placeholder="Or enter custom description"
                              className="bg-ocean-deep border-cyan-bright/20 text-foreground text-xs h-8 sm:h-9"
                            />
                          </div>
                          <div className="sm:col-span-2 space-y-1 sm:space-y-2">
                            <Label className="text-xs text-foreground">Qty</Label>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)
                              }
                              min="0"
                              step="0.01"
                              className="bg-ocean-deep border-cyan-bright/20 text-foreground text-xs h-8 sm:h-9"
                            />
                          </div>
                          <div className="sm:col-span-2 space-y-1 sm:space-y-2">
                            <Label className="text-xs text-foreground">Rate</Label>
                            <Input
                              type="number"
                              value={item.rate}
                              onChange={(e) =>
                                updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)
                              }
                              min="0"
                              step="0.01"
                              className="bg-ocean-deep border-cyan-bright/20 text-foreground text-xs h-8 sm:h-9"
                            />
                          </div>
                          <div className="sm:col-span-2 space-y-1 sm:space-y-2">
                            <Label className="text-xs text-foreground">Amount</Label>
                            <Input
                              value={`$${item.amount.toFixed(2)}`}
                              disabled
                              className="bg-ocean-deep/50 border-cyan-bright/20 text-foreground text-xs h-8 sm:h-9"
                            />
                          </div>
                          <div className="sm:col-span-1 flex items-end justify-start sm:justify-center pb-1">
                            {items.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                size="sm"
                                variant="ghost"
                                className="text-red-400 hover:text-red-300 hover:bg-red-400/10 w-full sm:w-auto h-7 sm:h-8 text-xs"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span className="ml-1 sm:hidden">Remove</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-full sm:w-64 space-y-1 sm:space-y-2 p-2 sm:p-3 lg:p-4 bg-ocean-surface/50 border border-cyan-bright/10 rounded-lg">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="text-foreground">${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-xs sm:text-sm text-green-400">
                        <span>Discount:</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    {tax > 0 && (
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Tax:</span>
                        <span className="text-foreground">${tax.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base sm:text-lg font-bold pt-2 border-t border-cyan-bright/20">
                      <span className="text-cyan-bright">Total:</span>
                      <span className="text-cyan-bright">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Discount Section */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-cyan-bright font-semibold text-xs sm:text-sm lg:text-base">
                  Discount (Optional)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                  <div className="space-y-1 sm:space-y-2">
                    <Label className="text-foreground text-xs sm:text-sm">
                      Discount Amount ($)
                    </Label>
                    <Input
                      type="number"
                      value={discountAmount || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        setDiscountAmount(value === '' ? 0 : parseFloat(value))
                      }}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="bg-ocean-surface border-cyan-bright/20 text-foreground text-xs sm:text-sm h-8 sm:h-9 lg:h-10"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <Label className="text-foreground text-xs sm:text-sm">Discount Reason</Label>
                    <Input
                      value={discountReason}
                      onChange={(e) => setDiscountReason(e.target.value)}
                      placeholder="e.g., Early payment, Loyalty, Promotion"
                      className="bg-ocean-surface border-cyan-bright/20 text-foreground text-xs sm:text-sm h-8 sm:h-9 lg:h-10"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2 sm:space-y-3">
                <Label className="text-foreground text-xs sm:text-sm">Notes (Optional)</Label>
                <Select
                  value={notesPreset}
                  onValueChange={(value) => handleNotesPresetChange(value as NotePresetValue)}
                >
                  <SelectTrigger className="bg-ocean-surface border-cyan-bright/20 text-foreground text-xs sm:text-sm h-8 sm:h-9 lg:h-10">
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent className="bg-ocean-surface border-cyan-bright/20 text-xs sm:text-sm">
                    {NOTE_PRESETS.map((preset) => (
                      <SelectItem
                        key={preset.value}
                        value={preset.value}
                        className="text-foreground hover:bg-cyan-bright/10 text-xs sm:text-sm"
                      >
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  value={notes}
                  onChange={(e) => {
                    const value = e.target.value
                    setNotes(value)
                    if (notesPreset === 'custom') {
                      setCustomNotes(value)
                    }
                  }}
                  placeholder="Payment terms, thank you message, etc."
                  className={`bg-ocean-surface border-cyan-bright/20 text-foreground text-xs sm:text-sm ${notesPreset !== 'custom' ? 'opacity-90 cursor-not-allowed' : ''}`}
                  rows={2}
                  readOnly={notesPreset !== 'custom'}
                />
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  {notesPreset === 'custom'
                    ? 'Customize payment terms as needed.'
                    : 'Preset notes are read-only. Choose Custom to edit.'}
                </p>
              </div>

              {/* Signature */}
              <div className="space-y-1 sm:space-y-2">
                <Label className="text-foreground text-xs sm:text-sm">Signature Name</Label>
                <Input
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  placeholder="Your name (will appear in cursive)"
                  className="bg-ocean-surface border-cyan-bright/20 text-foreground text-xs sm:text-sm h-8 sm:h-9 lg:h-10"
                />
              </div>
            </div>

            {/* RIGHT SIDE - Live Preview */}
            <div className="overflow-y-auto bg-gray-100 p-2 sm:p-4 lg:p-6 rounded-lg">
              <div
                className="bg-white shadow-xl max-w-[700px] mx-auto relative text-[10px] sm:text-xs lg:text-sm"
                style={{
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                }}
              >
                {/* Binary Rain Watermark - Full Document Background */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0,
                    pointerEvents: 'none',
                    overflow: 'hidden',
                    opacity: 0.15,
                  }}
                >
                  <BinaryRain isActive={true} />
                </div>

                {/* All Content - Relative positioning to ensure it's above watermark */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Letterhead */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #1a4d6d 0%, #0f3347 100%)',
                      padding: '30px 50px',
                      color: 'white',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '10px',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: '36px',
                            fontWeight: 900,
                            letterSpacing: '2px',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                          }}
                        >
                          DOLONIA DATA TECH
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            fontWeight: 300,
                            letterSpacing: '1px',
                            marginTop: '5px',
                            opacity: 0.9,
                          }}
                        >
                          Dolonia.cloud
                        </div>
                      </div>
                      <img
                        src={doloniaLogo}
                        alt="Dolonia Logo"
                        style={{ width: '120px', height: 'auto' }}
                      />
                    </div>
                    <div style={{ fontSize: '11px', opacity: 0.85 }}>
                      {companyEmail} | {companyWebsite}
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    style={{
                      padding: '40px 50px',
                      position: 'relative',
                      overflow: 'hidden',
                      background: 'white',
                    }}
                  >
                    {/* Watermark - Multiple Logos */}
                    {/* Top Left */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '10%',
                        left: '5%',
                        pointerEvents: 'none',
                        userSelect: 'none',
                        zIndex: -1,
                        opacity: 0.06,
                      }}
                    >
                      <img
                        src={doloniaLogo}
                        alt="Watermark"
                        style={{ width: '250px', height: 'auto' }}
                      />
                    </div>
                    {/* Center */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                        userSelect: 'none',
                        zIndex: -1,
                        opacity: 0.08,
                      }}
                    >
                      <img
                        src={doloniaLogo}
                        alt="Watermark"
                        style={{ width: '600px', height: 'auto' }}
                      />
                    </div>
                    {/* Bottom Right */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '5%',
                        right: '5%',
                        pointerEvents: 'none',
                        userSelect: 'none',
                        zIndex: -1,
                        opacity: 0.06,
                      }}
                    >
                      <img
                        src={doloniaLogo}
                        alt="Watermark"
                        style={{ width: '250px', height: 'auto' }}
                      />
                    </div>

                    {/* Header */}
                    <div
                      style={{
                        position: 'relative',
                        zIndex: 1,
                        marginBottom: '30px',
                        paddingBottom: '15px',
                        borderBottom: '2px solid #e5e7eb',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: 900,
                          color: '#1a4d6d',
                          marginBottom: '10px',
                          letterSpacing: '1px',
                        }}
                      >
                        INVOICE
                      </div>
                      <div style={{ fontSize: '12px', lineHeight: '1.8', color: '#333' }}>
                        <div>
                          <strong style={{ color: '#1a4d6d' }}>Invoice #:</strong>{' '}
                          {invoiceNumber || 'INV-000000'}
                        </div>
                        <div>
                          <strong style={{ color: '#1a4d6d' }}>Date Issued:</strong>{' '}
                          {invoiceDate || 'MM/DD/YYYY'}
                        </div>
                        <div>
                          <strong style={{ color: '#1a4d6d' }}>Due Date:</strong>{' '}
                          {dueDate || 'MM/DD/YYYY'}
                        </div>
                      </div>
                    </div>

                    {/* Bill To / From */}
                    <div
                      style={{
                        position: 'relative',
                        zIndex: 1,
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '30px',
                        marginBottom: '30px',
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            color: '#666',
                            marginBottom: '8px',
                            fontWeight: 600,
                          }}
                        >
                          Bill To:
                        </h3>
                        <p style={{ margin: '4px 0', fontWeight: 'bold', color: '#333' }}>
                          {clientName || 'Client Name'}
                        </p>
                        <p style={{ margin: '4px 0', fontSize: '14px', color: '#333' }}>
                          {clientEmail || 'client@example.com'}
                        </p>
                        {clientAddress && (
                          <p
                            style={{
                              margin: '4px 0',
                              fontSize: '14px',
                              whiteSpace: 'pre-line',
                              color: '#333',
                            }}
                          >
                            {clientAddress}
                          </p>
                        )}
                      </div>
                      <div>
                        <h3
                          style={{
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            color: '#666',
                            marginBottom: '8px',
                            fontWeight: 600,
                          }}
                        >
                          From:
                        </h3>
                        <p style={{ margin: '4px 0', fontWeight: 'bold', color: '#333' }}>
                          DOLONIA DATA TECH
                        </p>
                        <p style={{ margin: '4px 0', fontSize: '14px', color: '#333' }}>
                          {companyEmail}
                        </p>
                      </div>
                    </div>

                    {/* Line Items Table */}
                    <div style={{ position: 'relative', zIndex: 1, marginBottom: '20px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#1a4d6d', color: 'white' }}>
                          <tr>
                            <th
                              style={{
                                padding: '10px',
                                textAlign: 'left',
                                fontSize: '10px',
                                textTransform: 'uppercase',
                                fontWeight: 600,
                              }}
                            >
                              Description
                            </th>
                            <th
                              style={{
                                padding: '10px',
                                textAlign: 'center',
                                fontSize: '10px',
                                textTransform: 'uppercase',
                                fontWeight: 600,
                              }}
                            >
                              Qty
                            </th>
                            <th
                              style={{
                                padding: '10px',
                                textAlign: 'center',
                                fontSize: '10px',
                                textTransform: 'uppercase',
                                fontWeight: 600,
                              }}
                            >
                              Rate
                            </th>
                            <th
                              style={{
                                padding: '10px',
                                textAlign: 'right',
                                fontSize: '10px',
                                textTransform: 'uppercase',
                                fontWeight: 600,
                              }}
                            >
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item) =>
                            item.description ? (
                              <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px', fontSize: '14px', color: '#333' }}>
                                  {item.description}
                                </td>
                                <td
                                  style={{
                                    padding: '10px',
                                    textAlign: 'center',
                                    fontSize: '14px',
                                    color: '#333',
                                  }}
                                >
                                  {item.quantity}
                                </td>
                                <td
                                  style={{
                                    padding: '10px',
                                    textAlign: 'center',
                                    fontSize: '14px',
                                    color: '#333',
                                  }}
                                >
                                  ${item.rate.toFixed(2)}
                                </td>
                                <td
                                  style={{
                                    padding: '10px',
                                    textAlign: 'right',
                                    fontSize: '14px',
                                    color: '#333',
                                  }}
                                >
                                  ${item.amount.toFixed(2)}
                                </td>
                              </tr>
                            ) : null,
                          )}
                          {items.every((item) => !item.description) && (
                            <tr>
                              <td
                                colSpan={4}
                                style={{
                                  padding: '20px',
                                  textAlign: 'center',
                                  color: '#999',
                                  fontSize: '14px',
                                }}
                              >
                                No items added yet
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Totals */}
                    <div
                      style={{
                        position: 'relative',
                        zIndex: 1,
                        marginLeft: 'auto',
                        width: '250px',
                        marginBottom: '30px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '6px 10px',
                          fontSize: '14px',
                        }}
                      >
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      {discount > 0 && (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '6px 10px',
                            fontSize: '14px',
                            color: '#ef4444',
                          }}
                        >
                          <span>Discount{discountReason ? `: ${discountReason}` : ''}:</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                      {tax > 0 && (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '6px 10px',
                            fontSize: '14px',
                          }}
                        >
                          <span>Tax:</span>
                          <span>${tax.toFixed(2)}</span>
                        </div>
                      )}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '10px',
                          background: '#1a4d6d',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          marginTop: '8px',
                        }}
                      >
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Notes */}
                    {notes && (
                      <div
                        style={{
                          position: 'relative',
                          zIndex: 1,
                          marginBottom: '40px',
                          padding: '15px',
                          background: '#f9f9f9',
                          borderLeft: '4px solid #1a4d6d',
                        }}
                      >
                        <h3
                          style={{
                            fontSize: '12px',
                            color: '#000',
                            marginBottom: '8px',
                            textTransform: 'uppercase',
                          }}
                        >
                          Notes
                        </h3>
                        <p
                          style={{
                            fontSize: '14px',
                            whiteSpace: 'pre-line',
                            lineHeight: '1.6',
                            color: '#000',
                          }}
                        >
                          {notes}
                        </p>
                      </div>
                    )}

                    {/* Signature */}
                    {signatureName && (
                      <div
                        style={{
                          position: 'relative',
                          zIndex: 1,
                          display: 'flex',
                          justifyContent: 'flex-end',
                          marginTop: '40px',
                          marginBottom: '40px',
                        }}
                      >
                        <div style={{ textAlign: 'center', minWidth: '200px' }}>
                          <div
                            style={{
                              fontFamily: "'Allura', cursive",
                              fontSize: '42px',
                              fontWeight: 400,
                              color: '#1a4d6d',
                              marginBottom: '5px',
                              paddingBottom: '8px',
                              borderBottom: '2px solid #333',
                            }}
                          >
                            {signatureName}
                          </div>
                          <div
                            style={{
                              fontSize: '9px',
                              color: '#666',
                              textTransform: 'uppercase',
                              marginTop: '5px',
                              letterSpacing: '2px',
                            }}
                          >
                            Authorized Signature
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Footer Stamp */}
                    <div
                      style={{
                        position: 'relative',
                        zIndex: 1,
                        marginTop: '40px',
                        paddingTop: '20px',
                        borderTop: '2px solid #e5e7eb',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          display: 'inline-block',
                          border: '3px solid #1a4d6d',
                          padding: '10px 25px',
                          marginBottom: '15px',
                          transform: 'rotate(-5deg)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '16px',
                            fontWeight: 900,
                            color: '#1a4d6d',
                            letterSpacing: '3px',
                          }}
                        >
                          DOLONIA
                        </div>
                      </div>
                      <div style={{ fontSize: '10px', color: '#999', lineHeight: '2' }}>
                        Thank you for your business!
                        <br />
                        For questions about this invoice, please contact contact@dolonia.com
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-3 sm:pt-4 border-t border-cyan-bright/20 mt-3 sm:mt-4 shrink-0">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-cyan-bright/40 w-full sm:w-auto h-8 sm:h-9 lg:h-10 text-xs sm:text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={createInvoice}
              disabled={creating}
              className="bg-cyan-bright text-ocean-deep hover:bg-cyan-bright/90 w-full sm:w-auto h-8 sm:h-9 lg:h-10 text-xs sm:text-sm"
            >
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              {creating ? 'Sending...' : 'Send to User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
