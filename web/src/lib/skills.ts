import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import type { Rule, Skill, SkillMeta, ImpactLevel } from '@/types'
import { IMPACT_ORDER } from './constants'

const SKILLS_DIR = path.join(process.cwd(), '..', 'skills')

export const SUPPORTED_LANGS = ['en', 'ko'] as const
export type Lang = (typeof SUPPORTED_LANGS)[number]

function getSkillSlugs(): string[] {
  return fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
}

function parseRuleFile(filePath: string, slug: string): Rule {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const impact = (data.impact as ImpactLevel) ?? 'MEDIUM'
  return {
    slug,
    title: data.title ?? slug,
    impact: IMPACT_ORDER.includes(impact) ? impact : 'MEDIUM',
    impactDescription: data.impactDescription ?? '',
    tags: data.tags
      ? String(data.tags)
          .split(',')
          .map((t: string) => t.trim())
          .filter(Boolean)
      : [],
    content: content.trim(),
  }
}

function getRulesForSkill(skillSlug: string, lang: Lang): Rule[] {
  const rulesDir = path.join(SKILLS_DIR, skillSlug, lang, 'rules')
  if (!fs.existsSync(rulesDir)) return []

  return fs
    .readdirSync(rulesDir)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((f) => parseRuleFile(path.join(rulesDir, f), f.replace(/\.md$/, '')))
    .sort(
      (a, b) => IMPACT_ORDER.indexOf(a.impact) - IMPACT_ORDER.indexOf(b.impact)
    )
}

function getSkillMeta(skillSlug: string, lang: Lang): SkillMeta {
  const skillMdPath = path.join(SKILLS_DIR, skillSlug, lang, 'SKILL.md')
  let name = skillSlug
  let description = ''
  let author = ''
  let version = ''

  if (fs.existsSync(skillMdPath)) {
    const { data } = matter(fs.readFileSync(skillMdPath, 'utf-8'))
    name = data.name ?? skillSlug
    description = data.description ?? ''
    author = data.metadata?.author ?? ''
    version = data.metadata?.version ?? ''
  }

  const rules = getRulesForSkill(skillSlug, lang)
  const impactCounts: Partial<Record<ImpactLevel, number>> = {}
  for (const rule of rules) {
    impactCounts[rule.impact] = (impactCounts[rule.impact] ?? 0) + 1
  }

  return {
    slug: skillSlug,
    name,
    description,
    author,
    version,
    ruleCount: rules.length,
    impactCounts,
  }
}

function getSkillSlugsWithLang(lang: Lang): string[] {
  return getSkillSlugs().filter((slug) =>
    fs.existsSync(path.join(SKILLS_DIR, slug, lang))
  )
}

export function getAllSkillMeta(lang: Lang): SkillMeta[] {
  return getSkillSlugsWithLang(lang).map((slug) => getSkillMeta(slug, lang))
}

export function getSkillWithRules(skillSlug: string, lang: Lang): Skill {
  const meta = getSkillMeta(skillSlug, lang)
  const rules = getRulesForSkill(skillSlug, lang)
  return { ...meta, rules }
}

export function getRule(
  skillSlug: string,
  ruleSlug: string,
  lang: Lang
): Rule | null {
  const rulesDir = path.join(SKILLS_DIR, skillSlug, lang, 'rules')
  const filePath = path.join(rulesDir, `${ruleSlug}.md`)
  if (!fs.existsSync(filePath)) return null
  return parseRuleFile(filePath, ruleSlug)
}

export function getAllRulePaths(
  lang: Lang
): { skillSlug: string; ruleSlug: string }[] {
  const paths: { skillSlug: string; ruleSlug: string }[] = []
  for (const slug of getSkillSlugsWithLang(lang)) {
    const rules = getRulesForSkill(slug, lang)
    for (const rule of rules) {
      paths.push({ skillSlug: slug, ruleSlug: rule.slug })
    }
  }
  return paths
}
