'use client'

import { useState } from 'react'

interface AccordionBlockProps {
  block: {
    heading?: string
    items?: Array<{ question: string; answer: unknown }>
  }
}

export function AccordionBlock({ block }: AccordionBlockProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16">
      <div className="container-page max-w-3xl mx-auto">
        {block.heading && (
          <h2 className="text-3xl font-heading font-bold text-center mb-10">{block.heading}</h2>
        )}
        <div className="space-y-3">
          {block.items?.map((item, idx) => {
            const isOpen = openIndex === idx
            return (
              <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-heading font-semibold hover:bg-brand-light/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <svg
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-brand-muted">
                    {typeof item.answer === 'string' ? (
                      <p>{item.answer}</p>
                    ) : (
                      <p>Answer content from CMS.</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
