import Link from 'next/link'
import type { SkillMeta } from '@/types'
import { IMPACT_ORDER, IMPACT_DOT } from '@/lib/constants'

interface Props {
  skill: SkillMeta
}

export function SkillCard({ skill }: Props) {
  const dots = IMPACT_ORDER.filter((level) => (skill.impactCounts[level] ?? 0) > 0)

  return (
    <Link
      href={`/skills/${skill.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-900 group-hover:text-black">
          {skill.name}
        </h2>
        {skill.ruleCount > 0 && (
          <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
            {skill.ruleCount} rules
          </span>
        )}
      </div>

      {skill.description && (
        <p className="line-clamp-3 text-xs leading-relaxed text-gray-500">
          {skill.description}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between">
        {dots.length > 0 ? (
          <div className="flex items-center gap-1" title="Impact distribution">
            {dots.map((level) => (
              <span
                key={level}
                className={`h-2 w-2 rounded-full ${IMPACT_DOT[level]}`}
                title={`${level}: ${skill.impactCounts[level]}`}
              />
            ))}
          </div>
        ) : (
          <span className="text-xs text-gray-400">No rules</span>
        )}
        {skill.author && (
          <span className="text-xs text-gray-400">{skill.author}</span>
        )}
      </div>
    </Link>
  )
}
