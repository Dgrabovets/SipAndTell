import type { CSSProperties } from 'react'
import { TEA_COLOR, type Cup } from '../data/cups'
import { describeMood, moodColor } from '../data/moods'
import { useVariants } from '../variants/useVariants'
import { Icon } from './Icon'

/** Таблетки: тип чая в своём цвете, настроение формулировкой в цвете настроения, день без цвета.
 *  Набор зависит от варианта: полный, короткий (без дня) или с иконками места и времени. */
export function Chips({ cup }: { cup: Cup }) {
  const { variants } = useVariants()
  const set = variants.chips

  return (
    <span className="chips">
      <span className="chip tinted" style={{ '--tint': TEA_COLOR[cup.type] } as CSSProperties}>
        {cup.type}
      </span>
      <span className="chip tinted mood" style={{ '--tint': moodColor(cup.mood) } as CSSProperties}>
        {describeMood(cup.mood).title}
      </span>
      {set !== 'short' && <span className="chip">{cup.day}</span>}
      {set === 'rich' && (
        <span className="chip icons" aria-hidden>
          <Icon name={cup.place} />
          <Icon name={cup.time} />
        </span>
      )}
    </span>
  )
}
