import {
  htmlToBlocks,
  type DeserializerRule,
  type HtmlParser,
  type PortableTextBlock,
} from '@portabletext/block-tools'
import type { ArraySchemaType } from 'sanity'
import { marked } from 'marked'
import { parse as parseYaml } from 'yaml'

export type MarkdownFrontmatter = {
  title?: string
  description?: string
  slug?: string
  publishedAt?: string
}

export type MarkdownImportResult = {
  blocks: PortableTextBlock[]
  frontmatter: MarkdownFrontmatter
  warnings: string[]
}

type ParsedMarkdown = {
  body: string
  frontmatter: Record<string, unknown>
}

const FRONTMATTER_PATTERN = /^---[\t ]*\r?\n([\s\S]*?)\r?\n---[\t ]*(?:\r?\n|$)/

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function splitFrontmatter(markdown: string): ParsedMarkdown {
  const source = markdown.replace(/^\uFEFF/, '')
  const match = FRONTMATTER_PATTERN.exec(source)

  if (!match) return { body: source, frontmatter: {} }

  let parsed: unknown

  try {
    parsed = parseYaml(match[1])
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown YAML error'
    throw new Error(`The Markdown frontmatter is not valid YAML: ${message}`)
  }

  if (parsed !== null && parsed !== undefined && !isRecord(parsed)) {
    throw new Error('The Markdown frontmatter must be a YAML object.')
  }

  return {
    body: source.slice(match[0].length),
    frontmatter: parsed ?? {},
  }
}

function readString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed || undefined
}

function readSlug(value: unknown): string | undefined {
  if (isRecord(value)) return readString(value.current)
  return readString(value)
}

function readPublishedAt(value: unknown): string | undefined {
  if (value instanceof Date) return value.toISOString()
  if (typeof value !== 'string' && typeof value !== 'number') return undefined

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

function normalizeFrontmatter(
  values: Record<string, unknown>,
): MarkdownFrontmatter {
  return {
    title: readString(values.title),
    description: readString(
      values.description ?? values.excerpt ?? values.summary,
    ),
    slug: readSlug(values.slug),
    publishedAt: readPublishedAt(
      values.publishedAt ?? values.published_at ?? values.date,
    ),
  }
}

function opensInNewTab(href: string): boolean {
  return !(
    href.startsWith('/') ||
    href.startsWith('#') ||
    href.startsWith('./') ||
    href.startsWith('../')
  )
}

function applyLinkDefaults(blocks: PortableTextBlock[]): PortableTextBlock[] {
  return blocks.map((block) => {
    if (block._type !== 'block' || !Array.isArray(block.markDefs)) return block

    return {
      ...block,
      markDefs: block.markDefs.map((mark) => {
        if (
          mark._type !== 'link' ||
          typeof mark.href !== 'string' ||
          typeof mark.openInNewTab === 'boolean'
        ) {
          return mark
        }

        return { ...mark, openInNewTab: opensInNewTab(mark.href) }
      }),
    }
  })
}

function prepareHtml(
  html: string,
  parseHtml: HtmlParser,
): { html: string; imageCount: number } {
  const document = parseHtml(html)
  const images = Array.from(document.querySelectorAll('img'))

  // Markdown cannot provide the Sanity asset reference required by the existing
  // image block. Keep an editable marker in the correct position instead of
  // silently dropping the image or storing a remote hotlink.
  for (const image of images) {
    const marker = document.createElement('em')
    const alt = image.getAttribute('alt')?.trim()
    const source = image.getAttribute('src')?.trim()
    const label = alt ? `Image to upload: ${alt}` : 'Image to upload'
    marker.textContent = source ? `[${label} — ${source}]` : `[${label}]`
    image.replaceWith(marker)
  }

  return { html: document.body.innerHTML, imageCount: images.length }
}

const fencedCodeRule: DeserializerRule = {
  deserialize(node, _next, createBlock) {
    if (node.nodeType !== 1 || node.nodeName.toLowerCase() !== 'pre')
      return undefined

    const element = node as Element
    const codeElement = element.querySelector('code')
    const className = codeElement?.getAttribute('class') ?? ''
    const language =
      codeElement?.getAttribute('data-language') ??
      /(?:^|\s)language-([^\s]+)/.exec(className)?.[1]
    const code = (
      codeElement?.textContent ??
      element.textContent ??
      ''
    ).replace(/\n$/, '')

    return createBlock({
      _type: 'code',
      code,
      ...(language ? { language } : {}),
    })
  },
}

export function markdownToPortableText(
  markdown: string,
  schemaType: ArraySchemaType,
  parseHtml: HtmlParser = (html) =>
    new DOMParser().parseFromString(html, 'text/html'),
): MarkdownImportResult {
  const { body, frontmatter: rawFrontmatter } = splitFrontmatter(markdown)
  const html = marked.parse(body, { async: false, gfm: true }) as string
  const prepared = prepareHtml(html, parseHtml)
  const warnings: string[] = []

  if (prepared.imageCount > 0) {
    warnings.push(
      `${prepared.imageCount} Markdown image${prepared.imageCount === 1 ? ' was' : 's were'} kept as an “Image to upload” marker. Add the image with Sanity’s image block, then remove the marker.`,
    )
  }

  if (/<table[\s>]/i.test(prepared.html)) {
    warnings.push(
      'Markdown tables are imported as plain text because this Body schema has no table block.',
    )
  }

  const blocks = htmlToBlocks(prepared.html, schemaType, {
    parseHtml,
    rules: [fencedCodeRule],
    unstable_whitespaceOnPasteMode: 'normalize',
  })

  return {
    blocks: applyLinkDefaults(blocks),
    frontmatter: normalizeFrontmatter(rawFrontmatter),
    warnings,
  }
}
