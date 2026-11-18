import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Icon } from './Icon'

const MENU = [
  { icon: 'edit', label: 'Изменить', danger: false },
  { icon: 'share', label: 'Поделиться', danger: false },
  { icon: 'trash', label: 'Удалить', danger: true },
]

/** Главное действие и меню редких. Иконки живут: «ещё раз» крутится при нажатии, «⋯» поворачивается, пункты меню выезжают по очереди. */
export function Actions() {
  const [open, setOpen] = useState(false)
  const [turns, setTurns] = useState(0)

  return (
    <div className="actions-menu">
      <div className="actions">
        <motion.button className="glass-btn primary" whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 500, damping: 22 }} onClick={() => setTurns(turns + 1)}>
          <motion.span className="btn-icon" animate={{ rotate: turns * 360 }} transition={{ duration: 0.7, ease: [0.3, 1.2, 0.4, 1] }}>
            <Icon name="again" />
          </motion.span>
          Выпить ещё раз
        </motion.button>
        <motion.button className="round-icon solo" aria-label="Ещё действия" aria-expanded={open} whileTap={{ scale: 0.88 }} animate={{ rotate: open ? 90 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }} onClick={() => setOpen(!open)}>
          <Icon name="more" />
        </motion.button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.ul className="popover" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.28 }}>
            {MENU.map((item, i) => (
              <motion.li key={item.label} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 + i * 0.07, type: 'spring', stiffness: 380, damping: 26 }}>
                <motion.button className={item.danger ? 'danger' : ''} whileTap={{ scale: 0.97, x: 4 }}>
                  <Icon name={item.icon} />
                  {item.label}
                </motion.button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
