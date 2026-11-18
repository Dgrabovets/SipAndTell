import { motion } from 'motion/react'
import type { CSSProperties } from 'react'
import { CountUp } from './CountUp'

const RING = 22
const CIRCUMFERENCE = 2 * Math.PI * RING

/** Цвет кольца по оценке: высокая зелёная, средняя янтарная, низкая красная. */
function toneOf(value: number): string {
  return value >= 8 ? 'var(--tea-green)' : value >= 6 ? 'var(--primary)' : '#d0685a'
}

interface Props {
  value: number
  delay?: number
  /** ring, tone (цвет по оценке) или arc (полукруг). */
  variant?: string
  /** Размер в пикселях, по умолчанию 56. */
  size?: number
}

/** Оценка из десяти: число внутри кольца или полукруга. */
export function Score({ value, delay = 0, variant = 'ring', size = 56 }: Props) {
  const label = `Оценка ${value} из 10`
  const style = { '--size': `${size}px`, '--ring-color': variant === 'tone' ? toneOf(value) : 'var(--primary)' } as CSSProperties

  if (variant === 'arc') {
    return (
      <span className="score-ring score-arc" style={style} role="img" aria-label={label}>
        <svg viewBox="-28 -20 56 40" aria-hidden>
          <path className="ring-track" d="M -22 10 A 22 22 0 0 1 22 10" />
          <motion.path className="ring-fill arc" d="M -22 10 A 22 22 0 0 1 22 10" initial={{ pathLength: 0 }} animate={{ pathLength: value / 10 }} transition={{ duration: 1.1, delay, ease: [0.2, 0.8, 0.2, 1] }} />
        </svg>
        <b>
          <CountUp to={value} delay={delay} />
        </b>
      </span>
    )
  }

  return (
    <span className="score-ring" style={style} role="img" aria-label={label}>
      <svg viewBox="-28 -28 56 56" aria-hidden>
        <circle className="ring-track" r={RING} />
        <motion.circle
          className="ring-fill"
          r={RING}
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - value / 10) }}
          transition={{ duration: 1.1, delay, ease: [0.2, 0.8, 0.2, 1] }}
        />
      </svg>
      <b>
        <CountUp to={value} delay={delay} />
      </b>
    </span>
  )
}
