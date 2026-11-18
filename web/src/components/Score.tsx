import { motion } from 'motion/react'
import { CountUp } from './CountUp'

const RING = 22
const CIRCUMFERENCE = 2 * Math.PI * RING

/** Оценка из десяти: кольцо с числом внутри. */
export function Score({ value, delay = 0 }: { value: number; delay?: number }) {
  return (
    <span className="score-ring" role="img" aria-label={`Оценка ${value} из 10`}>
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
