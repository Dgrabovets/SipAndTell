import type { CSSProperties } from 'react'
import { TEA_COLOR, type Cup } from '../data/cups'
import { moodColor, moodWord } from '../data/moods'

/** Тип чая, настроение и день: таблетками, одной строкой или минимумом. */
export function Chips({ cup, variant }: { cup: Cup; variant: string }) {
  if (variant === 'text') {
    return (
      <span className="chips-text">
        {cup.type} · {moodWord(cup.mood)} · {cup.day}
      </span>
    )
  }

  if (variant === 'minimal') {
    return (
      <span className="chips-min">
        <span className="tea-dot" style={{ '--dot': TEA_COLOR[cup.type] } as CSSProperties} aria-hidden />
        {cup.type}
        <span className="mood-word" style={{ color: moodColor(cup.mood) }}>
          {moodWord(cup.mood)}
        </span>
      </span>
    )
  }

  return (
    <span className="chips">
      <span className="chip">{cup.type}</span>
      <span className="chip">{moodWord(cup.mood)}</span>
      <span className="chip">{cup.day}</span>
    </span>
  )
}
