import { createHighlighter, type Highlighter } from 'shiki'

let highlighter: Highlighter | null = null

export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: [
        'typescript',
        'tsx',
        'javascript',
        'jsx',
        'bash',
        'sh',
        'json',
        'css',
        'html',
        'markdown',
        'text',
      ],
    })
  }
  return highlighter
}

export async function highlightCode(
  code: string,
  lang: string
): Promise<string> {
  const h = await getHighlighter()
  const supportedLangs = h.getLoadedLanguages()
  const safeLang = supportedLangs.includes(lang as never) ? lang : 'text'
  return h.codeToHtml(code, {
    lang: safeLang,
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
  })
}

export async function processMarkdown(content: string): Promise<string> {
  // Normalize CRLF → LF before processing
  const normalized = content.replace(/\r\n/g, '\n')
  const fenceRegex = /```(\w*)\n([\s\S]*?)```/g
  const matches = [...normalized.matchAll(fenceRegex)]

  if (matches.length === 0) return normalized

  let result = normalized
  for (const match of matches) {
    const [full, lang, code] = match
    try {
      const highlighted = await highlightCode(code.trimEnd(), lang || 'text')
      result = result.replace(full, `\n\n${highlighted}\n\n`)
    } catch {
      // leave original on error
    }
  }
  return result
}
