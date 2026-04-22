import { getAllSkillMeta } from '@/lib/skills'
import { SkillCard } from '@/components/SkillCard'

export default function HomePage() {
  const skills = getAllSkillMeta()

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-12">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Agent Skills
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {skills.length} skills &middot;{' '}
          {skills.reduce((s, sk) => s + sk.ruleCount, 0)} rules
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <SkillCard key={skill.slug} skill={skill} />
        ))}
      </div>
    </main>
  )
}
