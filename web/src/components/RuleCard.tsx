import Link from 'next/link'
import type { Rule } from '@/types'
import type { Lang } from '@/lib/skills'
import { ImpactBadge } from './ui/ImpactBadge'
import { TagList } from './ui/TagList'

interface Props {
  rule: Rule
  skillSlug: string
  lang: Lang
}

function getExcerpt(content: string, maxLen = 120): string {
  const plain = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*/g, '')
    .replace(/\n+/g, ' ')
    .trim()
  return plain.length > maxLen ? plain.slice(0, maxLen) + '…' : plain
}

export function RuleCard({ rule, skillSlug, lang }: Props) {
  return (
    <Link
      href={`/${lang}/skills/${skillSlug}/rules/${rule.slug}`}
      className="group flex flex-col gap-2.5 rounded-lg border border-gray-200 bg-white p-4 transition hover:border-gray-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-black">
          {rule.title}
        </h3>
        <ImpactBadge impact={rule.impact} description={rule.impactDescription} size="sm" />
      </div>

      {rule.impactDescription && (
        <p className="text-xs text-gray-500">{rule.impactDescription}</p>
      )}

      {!rule.impactDescription && (
        <p className="text-xs text-gray-400">{getExcerpt(rule.content)}</p>
      )}

      <TagList tags={rule.tags} />
    </Link>
  )
}
