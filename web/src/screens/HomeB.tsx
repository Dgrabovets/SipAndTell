import { motion } from 'motion/react'
import type { PointerEvent } from 'react'
import { CountUp } from '../components/CountUp'
import { CUPS, TEA_COLOR } from '../data/cups'

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

/** Вариант B: крупные стеклянные карточки с цветом чая и большой оценкой. */
export function HomeB() {
  return (
    <>
      <motion.h1 className="title" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        Недавно выпито
      </motion.h1>
      <motion.p className="subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        Нажми на карточку, чтобы вспомнить отзыв
      </motion.p>
      <ul className="list" style={{ marginTop: 18 }}>
        {CUPS.map((cup, i) => (
          <motion.li
            key={cup.id}
            initial={{ opacity: 0, y: 36, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.12 + i * 0.08, type: 'spring', stiffness: 260, damping: 24 }}
          >
            <motion.button
              className="hero-cup"
              style={{ '--dot': TEA_COLOR[cup.type] } as React.CSSProperties}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              onPointerMove={moveLight}
              onPointerLeave={resetLight}
            >
              <span className="hero-score">
                <CountUp to={cup.score} delay={0.3 + i * 0.08} />
              </span>
              <span className="hero-name">{cup.name}</span>
              <span className="chips">
                <span className="chip">{cup.type}</span>
                <span className="chip">{cup.mood}</span>
                <span className="chip">{cup.day}</span>
              </span>
            </motion.button>
          </motion.li>
        ))}
      </ul>
    </>
  )
}
