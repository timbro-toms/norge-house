'use client'

interface FeatureGridBlockProps {
  block: {
    heading?: string
    subheading?: string
    columns?: '2' | '3' | '4'
    items?: Array<{ icon?: string; title: string; body?: string }>
  }
}

export function FeatureGridBlock({ block }: FeatureGridBlockProps) {
  const colClass = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-2 lg:grid-cols-3',
    '4': 'md:grid-cols-2 lg:grid-cols-4',
  }[block.columns || '3']

  return (
    <section className="py-16 bg-brand-light">
      <div className="container-page">
        {block.heading && (
          <h2 className="text-3xl font-heading font-bold text-center mb-4">{block.heading}</h2>
        )}
        {block.subheading && (
          <p className="text-brand-muted text-center mb-12 max-w-2xl mx-auto">{block.subheading}</p>
        )}
        <div className={`grid grid-cols-1 ${colClass} gap-8`}>
          {block.items?.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-center">
              {item.icon && (
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-brand-primary/10 rounded-full text-brand-primary text-2xl">
                  {item.icon}
                </div>
              )}
              <h3 className="font-heading font-bold text-lg mb-2">{item.title}</h3>
              {item.body && <p className="text-brand-muted text-sm">{item.body}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
