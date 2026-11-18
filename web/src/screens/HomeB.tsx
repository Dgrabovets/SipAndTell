import { motion } from 'motion/react'
import { CUPS, TEA_COLOR } from '../data/cups'

/** Вариант B: крупные карточки с цветом чая и большой оценкой. */
export function HomeB() {
  return (
    <>
      <h1 className="title">Недавно выпито</h1>
      <p className="subtitle">Нажми на карточку, чтобы вспомнить отзыв</p>
      <ul className="list" style={{ marginTop: 18 }}>
        {CUPS.map((cup, i) => (
          <motion.li
            key={cup.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 28 }}
          >
            <motion.button
              className="hero-cup"
              style={{ '--dot': TEA_COLOR[cup.type] } as React.CSSProperties}
              whileTap={{ scale: 0.98 }}
            >
              <span className="hero-score">{cup.score}</span>
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
