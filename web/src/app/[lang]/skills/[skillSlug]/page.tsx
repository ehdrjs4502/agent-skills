import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllSkillMeta, getSkillWithRules, SUPPORTED_LANGS, type Lang } from '@/lib/skills'
import { SkillRulesView } from '@/components/SkillRulesView'

export function generateStaticParams() {
  return SUPPORTED_LANGS.flatMap((lang) =>
    getAllSkillMeta(lang).map((s) => ({ lang, skillSlug: s.slug }))
  )
}

interface Props {
  params: Promise<{ lang: Lang; skillSlug: string }>
}

export default async function SkillPage({ params }: Props) {
  const { lang, skillSlug } = await params
  if (!SUPPORTED_LANGS.includes(lang)) notFound()

  const skill = getSkillWithRules(skillSlug, lang)
  if (!skill) notFound()

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-16">
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs text-gray-400">
        <Link href={`/${lang}`} className="hover:text-gray-700">
          Agent Skills
        </Link>
        <span>/</span>
        <span className="text-gray-600">{skill.name}</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900">
          {skill.name}
        </h1>
        {skill.description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
            {skill.description}
          </p>
        )}
        <div className="mt-3 flex gap-3 text-xs text-gray-400">
          {skill.author && <span>{skill.author}</span>}
          {skill.version && <span>v{skill.version}</span>}
        </div>
      </div>

      <SkillRulesView skill={skill} rules={skill.rules} lang={lang} />
    </main>
  )
}
