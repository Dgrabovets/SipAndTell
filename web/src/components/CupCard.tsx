import { motion } from 'motion/react'
import type { CSSProperties, PointerEvent } from 'react'
import { TEA_COLOR, type Cup } from '../data/cups'
import { Chips } from './Chips'
import { Score } from './Score'
import { spawnRipple } from './spawnRipple'

/** Блик на стекле идёт за пальцем или курсором. */
function moveLight(e: PointerEvent<HTMLElement>) {
  const box = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - box.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - box.top}px`)
}

function resetLight(e: PointerEvent<HTMLElement>) {
  e.currentTarget.style.removeProperty('--mx')
  e.currentTarget.style.removeProperty('--my')
}

/** Карточка чаепития строкой: название и чипы слева, оценка кольцом справа. */
export function CupCard({ cup, index, onOpen }: { cup: Cup; index: number; onOpen: () => void }) {
  return (
    <motion.button
      className="hero-cup is-row"
      style={{ '--dot': TEA_COLOR[cup.type] } as CSSProperties}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      onPointerMove={moveLight}
      onPointerDown={spawnRipple}
      onPointerLeave={resetLight}
      onClick={onOpen}
    >
      <span className="cup-main">
        <span className="hero-name">{cup.name}</span>
        <Chips cup={cup} />
      </span>
      <Score value={cup.score} delay={0.3 + index * 0.08} />
    </motion.button>
  )
}
