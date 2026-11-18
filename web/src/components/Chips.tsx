import type { CSSProperties } from 'react'
import { TEA_COLOR, type Cup } from '../data/cups'
import { describeMood, moodColor } from '../data/moods'

/** Таблетки: тип чая в своём цвете, настроение формулировкой в цвете настроения, день без цвета. */
export function Chips({ cup }: { cup: Cup }) {
  return (
    <span className="chips">
      <span className="chip tinted" style={{ '--tint': TEA_COLOR[cup.type] } as CSSProperties}>
        {cup.type}
      </span>
      <span className="chip tinted mood" style={{ '--tint': moodColor(cup.mood) } as CSSProperties}>
        {describeMood(cup.mood).title}
      </span>
      <span className="chip">{cup.day}</span>
    </span>
  )
}
