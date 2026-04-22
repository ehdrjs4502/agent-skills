import type { ImpactLevel } from '@/types'
import { IMPACT_COLORS } from '@/lib/constants'

interface Props {
  impact: ImpactLevel
  description?: string
  size?: 'sm' | 'md'
}

export function ImpactBadge({ impact, description, size = 'md' }: Props) {
  const colors = IMPACT_COLORS[impact]
  const textSize = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${textSize} ${colors}`}
      title={description}
    >
      {impact}
    </span>
  )
}
