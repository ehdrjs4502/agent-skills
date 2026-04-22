import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllRulePaths, getRule, getAllSkillMeta } from '@/lib/skills'
import { ImpactBadge } from '@/components/ui/ImpactBadge'
import { TagList } from '@/components/ui/TagList'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'

export async function generateStaticParams() {
  return getAllRulePaths()
}

interface Props {
  params: Promise<{ skillSlug: string; ruleSlug: string }>
}

export default async function RulePage({ params }: Props) {
  const { skillSlug, ruleSlug } = await params
  const rule = getRule(skillSlug, ruleSlug)
  if (!rule) notFound()

  const skills = getAllSkillMeta()
  const skill = skills.find((s) => s.slug === skillSlug)
  const skillName = skill?.name ?? skillSlug

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 md:py-16">
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-gray-700">
          Agent Skills
        </Link>
        <span>/</span>
        <Link href={`/skills/${skillSlug}`} className="hover:text-gray-700">
          {skillName}
        </Link>
        <span>/</span>
        <span className="text-gray-600">{rule.title}</span>
      </nav>

      <div className="mb-8 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <ImpactBadge impact={rule.impact} description={rule.impactDescription} />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-gray-900">
          {rule.title}
        </h1>
        {rule.impactDescription && (
          <p className="text-sm text-gray-500">{rule.impactDescription}</p>
        )}
        <TagList tags={rule.tags} />
      </div>

      <hr className="mb-8 border-gray-100" />

      <MarkdownRenderer content={rule.content} />
    </main>
  )
}
