import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { processMarkdown } from '@/lib/markdown'

interface Props {
  content: string
}

export async function MarkdownRenderer({ content }: Props) {
  const processed = await processMarkdown(content)

  return (
    <div className="prose prose-sm prose-gray max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {processed}
      </ReactMarkdown>
    </div>
  )
}
