import { motion } from 'motion/react'
import type { CSSProperties } from 'react'
import { YOU_COLOR, type Cup } from '../data/cups'
import { useVariants } from '../variants/useVariants'

const oneDecimal = (n: number) => n.toLocaleString('ru-RU', { maximumFractionDigits: 1 })

interface Mark {
  name: string
  score: number
  color: string
  /** Сдвиг в пикселях, чтобы метки с одной оценкой не лежали друг на друге. */
  shift: number
  /** Для варианта с подписями: с какой стороны шкалы имя и на каком ярусе. */
  side: 'up' | 'down'
  tier: 0 | 1
}

/** Метки на шкале: ты и каждый друг своим цветом. Метки с одной оценкой раздвигаются. */
function marksOf(cup: Cup, step: number): Mark[] {
  const all = [{ name: 'Ты', score: cup.score, color: YOU_COLOR }, ...cup.friends].sort((a, b) => a.score - b.score)
  return all.map((m, i) => {
    const same = all.filter((o) => o.score === m.score)
    const rank = same.indexOf(m)
    return { ...m, shift: (rank - (same.length - 1) / 2) * step, side: i % 2 ? 'down' : 'up', tier: (Math.floor(i / 2) % 2) as 0 | 1 }
  })
}

/** Одна шкала от 0 до 10 с метками. Имена показываются легендой, буквами в точках или подписями у точек. */
function Scale({ cup, mode }: { cup: Cup; mode: 'legend' | 'initials' | 'stagger' }) {
  const marks = marksOf(cup, mode === 'initials' ? 24 : 14)

  return (
    <div className="scale" data-mode={mode}>
      <div className="scale-line" />
      {marks.map((m, i) => (
        <motion.span
          key={m.name}
          className="scale-mark"
          data-side={m.side}
          data-tier={m.tier}
          style={{ '--c': m.color, marginLeft: m.shift } as CSSProperties}
          initial={{ left: '0%' }}
          animate={{ left: `${m.score * 10}%` }}
          transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.25 + i * 0.1 }}
        >
          <i>{mode === 'initials' ? m.name[0] : ''}</i>
          {mode === 'stagger' && (
            <em>
              {m.name} {m.score}
            </em>
          )}
        </motion.span>
      ))}
      <div className="scale-ticks" aria-hidden>
        <span>0</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  )
}

/** Сравнение с друзьями: шкала с метками и список с оценками, у каждого друга свой цвет. */
export function Friends({ cup }: { cup: Cup }) {
  const { variants } = useVariants()
  const mode = variants.friends as 'legend' | 'initials' | 'stagger'
  const average = cup.friends.reduce((sum, f) => sum + f.score, 0) / cup.friends.length
  const diff = cup.score - average
  const note = Math.abs(diff) < 0.5 ? 'Оценки почти совпали' : diff > 0 ? `Ты щедрее друзей на ${oneDecimal(diff)}` : `Друзья щедрее тебя на ${oneDecimal(-diff)}`

  return (
    <section className="friends" aria-label="Оценки друзей">
      <Scale cup={cup} mode={mode} />
      <p className="mood-caption">{note}</p>
      {mode !== 'stagger' && (
        <ul className="legend">
          {[{ name: 'Ты', score: cup.score, color: YOU_COLOR }, ...cup.friends].map((m) => (
            <li key={m.name} style={{ '--c': m.color } as CSSProperties}>
              <i>{mode === 'initials' ? m.name[0] : ''}</i>
              <span>{m.name}</span>
              <b>{m.score}</b>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
