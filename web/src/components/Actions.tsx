import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Icon } from './Icon'

/** Как выглядят кнопки в деталях: пара таблеток, круглые значки или одна главная и меню. */
export type ActionStyle = 'pair' | 'round' | 'menu'

function Pair() {
  return (
    <div className="actions pair">
      <motion.button className="glass-btn primary" whileTap={{ scale: 0.96 }}>
        <Icon name="again" />
        Ещё чашку
      </motion.button>
      <motion.button className="glass-btn" whileTap={{ scale: 0.96 }}>
        <Icon name="edit" />
        Изменить
      </motion.button>
    </div>
  )
}

function Round() {
  const items = [
    { icon: 'again', label: 'Ещё раз' },
    { icon: 'edit', label: 'Изменить' },
    { icon: 'share', label: 'Поделиться' },
  ]
  return (
    <div className="actions round">
      {items.map((item) => (
        <motion.button key={item.icon} className="round-btn" whileTap={{ scale: 0.92 }}>
          <span className="round-icon">
            <Icon name={item.icon} />
          </span>
          {item.label}
        </motion.button>
      ))}
    </div>
  )
}

function Menu() {
  const [open, setOpen] = useState(false)
  return (
    <div className="actions-menu">
      <div className="actions menu">
        <motion.button className="glass-btn primary wide" whileTap={{ scale: 0.97 }}>
          <Icon name="again" />
          Выпить ещё раз
        </motion.button>
        <motion.button className="round-icon solo" aria-label="Ещё действия" aria-expanded={open} whileTap={{ scale: 0.92 }} onClick={() => setOpen(!open)}>
          <Icon name="more" />
        </motion.button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.ul className="popover" initial={{ opacity: 0, y: -6, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -6, height: 0 }}>
            <li>
              <button>
                <Icon name="edit" />
                Изменить
              </button>
            </li>
            <li>
              <button>
                <Icon name="share" />
                Поделиться
              </button>
            </li>
            <li>
              <button className="danger">
                <Icon name="trash" />
                Удалить
              </button>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Actions({ style }: { style: ActionStyle }) {
  return style === 'pair' ? <Pair /> : style === 'round' ? <Round /> : <Menu />
}
