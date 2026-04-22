'use client'

import type { ImpactLevel } from '@/types'
import { IMPACT_ORDER, IMPACT_COLORS, IMPACT_DOT } from '@/lib/constants'

interface Props {
  counts: Partial<Record<ImpactLevel, number>>
  selected: ImpactLevel[]
  onChange: (selected: ImpactLevel[]) => void
}

export function ImpactFilter({ counts, selected, onChange }: Props) {
  const available = IMPACT_ORDER.filter((level) => (counts[level] ?? 0) > 0)

  function toggle(level: ImpactLevel) {
    if (selected.includes(level)) {
      onChange(selected.filter((l) => l !== level))
    } else {
      onChange([...selected, level])
    }
  }

  function selectAll() {
    onChange(available)
  }

  function clearAll() {
    onChange([])
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Impact
        </span>
        <div className="flex gap-2 text-xs text-gray-400">
          <button onClick={selectAll} className="hover:text-gray-700">
            All
          </button>
          <span>/</span>
          <button onClick={clearAll} className="hover:text-gray-700">
            None
          </button>
        </div>
      </div>

      <div className="flex flex-row flex-wrap gap-2 md:flex-col md:gap-1">
        {available.map((level) => {
          const isSelected = selected.includes(level)
          const colors = IMPACT_COLORS[level]
          return (
            <button
              key={level}
              onClick={() => toggle(level)}
              className={`flex items-center justify-between rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                isSelected
                  ? colors
                  : 'border-gray-100 bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${IMPACT_DOT[level]}`} />
                {level}
              </div>
              <span className="tabular-nums">{counts[level]}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
