import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  country: z.string().optional(),
  subject: z.enum(['general', 'quote-request', 'b2b-partnership', 'other']).optional(),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  howFound: z.enum(['google', 'referral', 'social', 'other']).optional(),
  honeypot: z.string().max(0).optional(),
  formType: z.string().optional(),
})

// Simple in-memory rate limiter
const rateLimit = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW = 10 * 60 * 1000 // 10 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false
  }

  entry.count++
  return true
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      )
    }

    const body = await request.json()
    const data = contactSchema.parse(body)

    // Honeypot check
    if (data.honeypot) {
      // Silently accept to not tip off bots
      return NextResponse.json({ success: true })
    }

    // Send email via Resend
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured')
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    const resend = new Resend(resendApiKey)
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@norgehouse.com'
    const toEmail = process.env.RESEND_TO_EMAIL || 'info@norgehouse.com'

    const subjectLabels: Record<string, string> = {
      general: 'General Inquiry',
      'quote-request': 'Quote Request',
      'b2b-partnership': 'B2B Partnership',
      other: 'Other',
    }

    const emailSubject = `[Norge House] ${subjectLabels[data.subject || 'general']} from ${data.name}`

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: data.email,
      subject: emailSubject,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
        ${data.country ? `<p><strong>Country:</strong> ${data.country}</p>` : ''}
        <p><strong>Subject:</strong> ${subjectLabels[data.subject || 'general']}</p>
        ${data.formType ? `<p><strong>Form Type:</strong> ${data.formType}</p>` : ''}
        ${data.howFound ? `<p><strong>Found via:</strong> ${data.howFound}</p>` : ''}
        <hr/>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br/>')}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 },
      )
    }
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
