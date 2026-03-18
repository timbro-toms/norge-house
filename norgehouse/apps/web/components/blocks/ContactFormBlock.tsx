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

const inputCls =
  'w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-brand-dark placeholder:text-gray-400 transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:shadow-md outline-none'
const inputErrCls =
  'w-full rounded-xl border-2 border-red-400 bg-white px-4 py-3 text-brand-dark placeholder:text-gray-400 transition-all focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none'
const selectCls =
  inputCls + ' appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22%23666%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20d%3D%22M8%2011L3%206h10z%22%2F%3E%3C%2Fsvg%3E")] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10'

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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10">
      {block.heading && (
        <h2 className="text-2xl font-heading font-bold mb-2">{block.heading}</h2>
      )}
      <p className="text-brand-muted text-sm mb-8">* {t('requiredFields')}</p>

      {status === 'success' ? (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
          <svg className="w-12 h-12 mx-auto mb-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-semibold text-green-800">{block.successMessage || t('success')}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Honeypot */}
          <input type="text" {...register('honeypot')} className="hidden" tabIndex={-1} autoComplete="off" />

          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-2">{t('name')} *</label>
            <input
              {...register('name')}
              className={errors.name ? inputErrCls : inputCls}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1.5">{t('validation.nameRequired')}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-2">{t('email')} *</label>
            <input
              type="email"
              {...register('email')}
              className={errors.email ? inputErrCls : inputCls}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1.5">{t('validation.emailInvalid')}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-2">{t('phone')}</label>
              <input
                type="tel"
                {...register('phone')}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-2">{t('country')}</label>
              <input
                {...register('country')}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-2">{t('subject')}</label>
            <select
              {...register('subject')}
              className={selectCls}
            >
              <option value="general">{t('subjects.general')}</option>
              <option value="quote-request">{t('subjects.quoteRequest')}</option>
              <option value="b2b-partnership">{t('subjects.b2bPartnership')}</option>
              <option value="other">{t('subjects.other')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-2">{t('message')} *</label>
            <textarea
              {...register('message')}
              rows={6}
              className={(errors.message ? inputErrCls : inputCls) + ' resize-vertical'}
            />
            {errors.message && <p className="text-red-500 text-xs mt-1.5">{t('validation.messageTooShort')}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-2">{t('howFound')}</label>
            <select
              {...register('howFound')}
              className={selectCls}
            >
              <option value="">--</option>
              <option value="google">{t('howFoundOptions.google')}</option>
              <option value="referral">{t('howFoundOptions.referral')}</option>
              <option value="social">{t('howFoundOptions.social')}</option>
              <option value="other">{t('howFoundOptions.other')}</option>
            </select>
          </div>

          {status === 'error' && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 text-red-800 text-sm">
              {t('error')}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full bg-brand-primary text-brand-dark font-bold py-4 rounded-xl hover:bg-brand-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 text-lg shadow-md shadow-brand-primary/20"
          >
            {status === 'sending' ? t('sending') : t('submit')}
          </button>
        </form>
      )}
    </div>
  )
}
