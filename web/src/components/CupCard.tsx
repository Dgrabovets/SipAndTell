import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import type { Cup } from '../data/cups'
import { TeaType } from './TeaType'

export function CupCard({ cup }: { cup: Cup }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.li
      className="cup"
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
    >
      <motion.button className="cup-head" aria-expanded={open} whileTap={{ scale: 0.98 }} onClick={() => setOpen(!open)}>
        <span className="cup-main">
          <span className="cup-name">{cup.name}</span>
          <br />
          <TeaType type={cup.type} />
        </span>
        <span className="score">
          {cup.score}
          <small>/10</small>
        </span>
      </motion.button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.dl
            className="cup-more"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <dt>Настроение</dt>
            <dd>{cup.mood}</dd>
            <dt>Обстоятельства</dt>
            <dd>{cup.place}</dd>
            <dt>Отзыв</dt>
            <dd>{cup.review}</dd>
          </motion.dl>
        )}
      </AnimatePresence>
    </motion.li>
  )
}
