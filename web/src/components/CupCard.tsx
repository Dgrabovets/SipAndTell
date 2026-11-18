import { motion } from 'motion/react'
import type { CSSProperties, PointerEvent } from 'react'
import { TEA_COLOR, type Cup } from '../data/cups'
import { Score } from './Score'
import { spawnRipple } from './spawnRipple'

/** Карточка чаепития строкой: название, тип чая по центру между названием и оценкой, оценка справа.
 *  Окрашена в цвет чая, на нажатие сжимается, блик идёт за пальцем. */
export function CupCard({ cup, index, onOpen }: { cup: Cup; index: number; onOpen: () => void }) {
  const move = (e: PointerEvent<HTMLElement>) => {
    const box = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - box.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - box.top}px`)
  }

  const leave = (e: PointerEvent<HTMLElement>) => {
    e.currentTarget.style.removeProperty('--mx')
    e.currentTarget.style.removeProperty('--my')
  }

  return (
    <motion.button
      className="hero-cup is-row"
      style={{ '--dot': TEA_COLOR[cup.type] } as CSSProperties}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.93, scaleY: 0.88 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      onPointerMove={move}
      onPointerDown={spawnRipple}
      onPointerLeave={leave}
      onClick={onOpen}
    >
      <span className="hero-name">{cup.name}</span>
      <span className="chip tinted" style={{ '--tint': TEA_COLOR[cup.type] } as CSSProperties}>
        {cup.type}
      </span>
      <Score value={cup.score} size={44} delay={0.3 + index * 0.08} />
    </motion.button>
  )
}
