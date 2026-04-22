export type ImpactLevel =
  | 'CRITICAL'
  | 'HIGH'
  | 'MEDIUM-HIGH'
  | 'MEDIUM'
  | 'LOW-MEDIUM'
  | 'LOW'

export interface Rule {
  slug: string
  title: string
  impact: ImpactLevel
  impactDescription: string
  tags: string[]
  content: string
}

export interface SkillMeta {
  slug: string
  name: string
  description: string
  author: string
  version: string
  ruleCount: number
  impactCounts: Partial<Record<ImpactLevel, number>>
}

export interface Skill extends SkillMeta {
  rules: Rule[]
}
