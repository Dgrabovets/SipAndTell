import { motion } from 'motion/react'
import type { CSSProperties } from 'react'
import { YOU_COLOR, type Cup } from '../data/cups'

const oneDecimal = (n: number) => n.toLocaleString('ru-RU', { maximumFractionDigits: 1 })

/** Метки на шкале: ты и каждый друг своим цветом. Метки с одной оценкой раздвигаются, чтобы не лежать друг на друге. */
function marksOf(cup: Cup) {
  const all = [{ name: 'Ты', score: cup.score, color: YOU_COLOR }, ...cup.friends].sort((a, b) => a.score - b.score)
  return all.map((m) => {
    const same = all.filter((o) => o.score === m.score)
    return { ...m, shift: (same.indexOf(m) - (same.length - 1) / 2) * 14 }
  })
}

/** Сравнение с друзьями: одна шкала от 0 до 10 с цветными метками, ниже небольшая легенда. */
export function Friends({ cup }: { cup: Cup }) {
  const average = cup.friends.reduce((sum, f) => sum + f.score, 0) / (cup.friends.length || 1)
  const diff = cup.score - average
  const note = cup.friends.length === 0 ? 'Друзья пока не оценили этот чай' : Math.abs(diff) < 0.5 ? 'Оценки почти совпали' : diff > 0 ? `Ты щедрее друзей на ${oneDecimal(diff)}` : `Друзья щедрее тебя на ${oneDecimal(-diff)}`

  return (
    <section className="friends" aria-label="Оценки друзей">
      <div className="scale">
        <div className="scale-line" />
        {marksOf(cup).map((m, i) => (
          <motion.span
            key={m.name}
            className="scale-mark"
            style={{ '--c': m.color, marginLeft: m.shift } as CSSProperties}
            initial={{ left: '0%' }}
            animate={{ left: `${m.score * 10}%` }}
            transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.25 + i * 0.1 }}
          >
            <i />
          </motion.span>
        ))}
        <div className="scale-ticks" aria-hidden>
          <span>0</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>
      <p className="mood-caption">{note}</p>
      <ul className="legend">
        {[{ name: 'Ты', score: cup.score, color: YOU_COLOR }, ...cup.friends].map((m) => (
          <li key={m.name} style={{ '--c': m.color } as CSSProperties}>
            <i />
            <span>{m.name}</span>
            <b>{m.score}</b>
          </li>
        ))}
      </ul>
    </section>
  )
}
