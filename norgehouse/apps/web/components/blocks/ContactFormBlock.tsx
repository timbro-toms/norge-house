'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  country: z.string().optional(),
  subject: z.enum(['general', 'quote-request', 'b2b-partnership', 'other']).optional(),
  message: z.string().min(20),
  howFound: z.enum(['google', 'referral', 'social', 'other']).optional(),
  honeypot: z.string().max(0).optional(),
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactFormBlockProps {
  block: {
    heading?: string
    formType?: 'general' | 'b2b' | 'quote'
    successMessage?: string
  }
}

export function ContactFormBlock({ block }: ContactFormBlockProps) {
  const t = useTranslations('contact')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    if (data.honeypot) return

    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, formType: block.formType }),
      })

      if (!res.ok) throw new Error('Failed to send')

      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <div>
      {block.heading && (
        <h2 className="text-2xl font-heading font-bold mb-6">{block.heading}</h2>
      )}

      {status === 'success' ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-green-800">
          {block.successMessage || t('success')}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Honeypot */}
          <input type="text" {...register('honeypot')} className="hidden" tabIndex={-1} autoComplete="off" />

          <div>
            <label className="block text-sm font-semibold mb-1">{t('name')} *</label>
            <input
              {...register('name')}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{t('validation.nameRequired')}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">{t('email')} *</label>
            <input
              type="email"
              {...register('email')}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{t('validation.emailInvalid')}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-1">{t('phone')}</label>
              <input
                type="tel"
                {...register('phone')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">{t('country')}</label>
              <input
                {...register('country')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">{t('subject')}</label>
            <select
              {...register('subject')}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
            >
              <option value="general">{t('subjects.general')}</option>
              <option value="quote-request">{t('subjects.quoteRequest')}</option>
              <option value="b2b-partnership">{t('subjects.b2bPartnership')}</option>
              <option value="other">{t('subjects.other')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">{t('message')} *</label>
            <textarea
              {...register('message')}
              rows={5}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none resize-vertical"
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{t('validation.messageTooShort')}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">{t('howFound')}</label>
            <select
              {...register('howFound')}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
            >
              <option value="">--</option>
              <option value="google">{t('howFoundOptions.google')}</option>
              <option value="referral">{t('howFoundOptions.referral')}</option>
              <option value="social">{t('howFoundOptions.social')}</option>
              <option value="other">{t('howFoundOptions.other')}</option>
            </select>
          </div>

          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
              {t('error')}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full bg-brand-primary text-brand-dark font-semibold py-3 rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
          >
            {status === 'sending' ? t('sending') : t('submit')}
          </button>
        </form>
      )}
    </div>
  )
}
