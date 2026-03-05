'use client'

interface MapBlockProps {
  block: {
    heading?: string
    embedUrl: string
    address?: string
    zoom?: number
  }
}

export function MapBlock({ block }: MapBlockProps) {
  return (
    <div>
      {block.heading && (
        <h2 className="text-2xl font-heading font-bold mb-4">{block.heading}</h2>
      )}
      <div className="rounded-lg overflow-hidden">
        <iframe
          src={block.embedUrl}
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={block.heading || 'Map'}
        />
      </div>
      {block.address && (
        <p className="mt-3 text-brand-muted text-sm">{block.address}</p>
      )}
    </div>
  )
}
