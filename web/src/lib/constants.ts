import type { ImpactLevel } from '@/types'

export const IMPACT_ORDER: ImpactLevel[] = [
  'CRITICAL',
  'HIGH',
  'MEDIUM-HIGH',
  'MEDIUM',
  'LOW-MEDIUM',
  'LOW',
]

export const IMPACT_COLORS: Record<ImpactLevel, string> = {
  CRITICAL: 'bg-red-100 text-red-800 border-red-200',
  HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
  'MEDIUM-HIGH': 'bg-amber-100 text-amber-800 border-amber-200',
  MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'LOW-MEDIUM': 'bg-lime-100 text-lime-800 border-lime-200',
  LOW: 'bg-green-100 text-green-800 border-green-200',
}

export const IMPACT_DOT: Record<ImpactLevel, string> = {
  CRITICAL: 'bg-red-500',
  HIGH: 'bg-orange-500',
  'MEDIUM-HIGH': 'bg-amber-500',
  MEDIUM: 'bg-yellow-500',
  'LOW-MEDIUM': 'bg-lime-500',
  LOW: 'bg-green-500',
}
