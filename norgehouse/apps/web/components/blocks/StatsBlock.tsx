'use client'

import { useEffect, useRef, useState } from 'react'

interface StatsBlockProps {
  block: {
    heading?: string
    stats?: Array<{ value: number; label: string; suffix?: string; prefix?: string }>
  }
}

function AnimatedNumber({ value, prefix, suffix }: { value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 2000
          const startTime = performance.now()

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * value))

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 },
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-heading font-bold text-brand-primary">
      {prefix}{count}{suffix}
    </span>
  )
}

export function StatsBlock({ block }: StatsBlockProps) {
  return (
    <section className="py-16 bg-brand-dark text-white">
      <div className="container-page">
        {block.heading && (
          <h2 className="text-3xl font-heading font-bold text-center mb-12">{block.heading}</h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {block.stats?.map((stat, idx) => (
            <div key={idx} className="text-center">
              <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              <p className="mt-2 text-sm opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
