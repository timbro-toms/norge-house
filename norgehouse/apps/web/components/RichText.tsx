import React from 'react'

/**
 * Renders Payload CMS Lexical rich text content.
 * Handles common node types: paragraph, heading, list, listitem, link, text.
 */

interface LexicalNode {
  type: string
  tag?: string
  format?: number | string
  text?: string
  children?: LexicalNode[]
  url?: string
  newTab?: boolean
  listType?: string
  value?: number
  version?: number
  indent?: number
  direction?: string
  fields?: { url?: string; newTab?: boolean; linkType?: string }
}

interface LexicalContent {
  root: {
    type: string
    children: LexicalNode[]
  }
}

function isLexicalContent(value: unknown): value is LexicalContent {
  return (
    typeof value === 'object' &&
    value !== null &&
    'root' in value &&
    typeof (value as LexicalContent).root === 'object' &&
    Array.isArray((value as LexicalContent).root.children)
  )
}

// Text format bitmask values from Lexical
const IS_BOLD = 1
const IS_ITALIC = 2
const IS_STRIKETHROUGH = 4
const IS_UNDERLINE = 8
const IS_CODE = 16
const IS_SUBSCRIPT = 32
const IS_SUPERSCRIPT = 64

function renderTextFormatting(text: string, format: number): React.ReactNode {
  let node: React.ReactNode = text

  if (format & IS_BOLD) node = <strong>{node}</strong>
  if (format & IS_ITALIC) node = <em>{node}</em>
  if (format & IS_STRIKETHROUGH) node = <s>{node}</s>
  if (format & IS_UNDERLINE) node = <u>{node}</u>
  if (format & IS_CODE) node = <code>{node}</code>
  if (format & IS_SUBSCRIPT) node = <sub>{node}</sub>
  if (format & IS_SUPERSCRIPT) node = <sup>{node}</sup>

  return node
}

function renderNode(node: LexicalNode, index: number): React.ReactNode {
  if (node.type === 'text') {
    const format = typeof node.format === 'number' ? node.format : 0
    return <React.Fragment key={index}>{renderTextFormatting(node.text || '', format)}</React.Fragment>
  }

  if (node.type === 'linebreak') {
    return <br key={index} />
  }

  const children = node.children?.map((child, i) => renderNode(child, i))

  switch (node.type) {
    case 'paragraph':
      return <p key={index}>{children}</p>

    case 'heading': {
      const Tag = (node.tag || 'h2') as keyof JSX.IntrinsicElements
      return <Tag key={index}>{children}</Tag>
    }

    case 'list': {
      if (node.listType === 'number') {
        return <ol key={index}>{children}</ol>
      }
      return <ul key={index}>{children}</ul>
    }

    case 'listitem':
      return <li key={index}>{children}</li>

    case 'link': {
      const url = node.fields?.url || node.url || '#'
      const newTab = node.fields?.newTab || node.newTab
      return (
        <a
          key={index}
          href={url}
          {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      )
    }

    case 'autolink': {
      const url = node.fields?.url || node.url || '#'
      return (
        <a key={index} href={url} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      )
    }

    case 'quote':
      return <blockquote key={index}>{children}</blockquote>

    case 'horizontalrule':
      return <hr key={index} />

    case 'upload': {
      // Handle image uploads embedded in rich text
      return null
    }

    default:
      // Fallback: render children if any
      if (children && children.length > 0) {
        return <React.Fragment key={index}>{children}</React.Fragment>
      }
      return null
  }
}

interface RichTextProps {
  content: unknown
  className?: string
}

export function RichText({ content, className = 'prose max-w-none' }: RichTextProps) {
  if (!content) return null

  if (typeof content === 'string') {
    return (
      <div className={className}>
        <p>{content}</p>
      </div>
    )
  }

  if (!isLexicalContent(content)) {
    return null
  }

  const nodes = content.root.children

  // Check if content is empty (only empty paragraphs)
  const hasContent = nodes.some(
    (node) =>
      node.type !== 'paragraph' ||
      (node.children && node.children.length > 0 && node.children.some((c) => c.text?.trim())),
  )

  if (!hasContent) return null

  return <div className={className}>{nodes.map((node, i) => renderNode(node, i))}</div>
}
