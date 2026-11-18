import { motion } from 'motion/react'
import type { CSSProperties, PointerEvent } from 'react'
import { TEA_COLOR, type Cup } from '../data/cups'
import { useVariants } from '../variants/useVariants'
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

/** Карточка чаепития в трёх видах: крупная, строка, плитка. Оценка и чипы тоже выбираются. */
export function CupCard({ cup, index, onOpen }: { cup: Cup; index: number; onOpen: () => void }) {
  const { variants } = useVariants()
  const { card, score, chips } = variants
  const delay = 0.3 + index * 0.08

  const name = <span className="hero-name">{cup.name}</span>
  const scoreEl = <Score value={cup.score} variant={score} delay={delay} />

  return (
    <motion.button
      className={`hero-cup is-${card}`}
      style={{ '--dot': TEA_COLOR[cup.type] } as CSSProperties}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      onPointerMove={moveLight}
      onPointerDown={spawnRipple}
      onPointerLeave={resetLight}
      onClick={onOpen}
    >
      {card === 'row' ? (
        <>
          <span className="cup-main">
            {name}
            <Chips cup={cup} variant={chips} />
          </span>
          <span className="cup-score">{scoreEl}</span>
        </>
      ) : (
        <>
          <span className="cup-score">{scoreEl}</span>
          {name}
          <Chips cup={cup} variant={chips} />
        </>
      )}
    </motion.button>
  )
}
