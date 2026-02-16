import nodemailer from 'nodemailer'

interface ContactFormData {
  name: string
  email: string
  company?: string
  subject: string
  message: string
}

export async function sendContactEmail(data: ContactFormData) {
  const transporter = nodemailer.createTransport({
    host: process.env.VITE_SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.VITE_SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.VITE_SMTP_USER || 'your-email@gmail.com',
      pass: process.env.VITE_SMTP_PASS || 'your-email-password',
    },
  })

  const mailOptions = {
    from: process.env.VITE_SMTP_USER || 'your-email@gmail.com',
    to: 'zion@royalsocietymanagementgroup.com',
    subject: `New Contact Form Submission: ${data.subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
    `,
  }

  await transporter.sendMail(mailOptions)
}
