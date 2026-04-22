'use client'

import { useState, useMemo } from 'react'
import type { Rule, ImpactLevel, SkillMeta } from '@/types'
import type { Lang } from '@/lib/skills'
import { IMPACT_ORDER } from '@/lib/constants'
import { RuleCard } from './RuleCard'
import { ImpactFilter } from './ImpactFilter'

interface Props {
  skill: SkillMeta
  rules: Rule[]
  lang: Lang
}

export function SkillRulesView({ skill, rules, lang }: Props) {
  const available = useMemo(
    () => IMPACT_ORDER.filter((l) => (skill.impactCounts[l] ?? 0) > 0),
    [skill.impactCounts]
  )

  const [selected, setSelected] = useState<ImpactLevel[]>(available)

  const filtered = useMemo(
    () =>
      selected.length === 0
        ? rules
        : rules.filter((r) => selected.includes(r.impact)),
    [rules, selected]
  )

  if (rules.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 p-12 text-center">
        <p className="text-sm text-gray-400">
          This skill has no individual rule files.
        </p>
        <p className="mt-1 text-xs text-gray-300">
          See the SKILL.md file for guidelines.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 md:flex-row md:gap-8">
      <aside className="w-full md:w-48 md:shrink-0">
        <ImpactFilter
          counts={skill.impactCounts}
          selected={selected}
          onChange={setSelected}
        />
      </aside>

      <div className="flex-1">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            {filtered.length === rules.length
              ? `${rules.length} rules`
              : `${filtered.length} of ${rules.length} rules`}
          </p>
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-200 p-8 text-center text-xs text-gray-400">
            No rules match the selected filters.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
            {filtered.map((rule) => (
              <RuleCard key={rule.slug} rule={rule} skillSlug={skill.slug} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
