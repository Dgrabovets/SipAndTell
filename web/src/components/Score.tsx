import { motion } from 'motion/react'
import { CountUp } from './CountUp'

const RING = 22
const CIRCUMFERENCE = 2 * Math.PI * RING

/** Оценка из десяти: число, кольцо или десять точек. */
export function Score({ value, variant, delay = 0 }: { value: number; variant: string; delay?: number }) {
  const label = `Оценка ${value} из 10`

  if (variant === 'ring') {
    return (
      <span className="score-ring" role="img" aria-label={label}>
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

  if (variant === 'dots') {
    return (
      <span className="score-dots" role="img" aria-label={label}>
        {Array.from({ length: 10 }, (_, i) => (
          <motion.i key={i} className={i < value ? 'on' : ''} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: delay + i * 0.05, type: 'spring', stiffness: 400, damping: 18 }} />
        ))}
      </span>
    )
  }

  return (
    <span className="score-big" role="img" aria-label={label}>
      <CountUp to={value} delay={delay} />
    </span>
  )
}
