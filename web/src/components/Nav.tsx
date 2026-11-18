import { motion } from 'motion/react'
import { useState } from 'react'
import { Icon } from './Icon'

const TABS = [
  { id: 'diary', label: 'Дневник', icon: 'book' },
  { id: 'friends', label: 'Друзья', icon: 'friends' },
  { id: 'catalog', label: 'Каталог', icon: 'grid' },
]

/** Переключатель разделов сверху: активный раздел приподнимается, под ним переезжает точка. */
export function Nav() {
  const [active, setActive] = useState('diary')

  return (
    <nav className="nav top" aria-label="Разделы">
      {TABS.map((tab) => {
        const on = active === tab.id
        return (
          <button key={tab.id} aria-current={on ? 'page' : undefined} onClick={() => setActive(tab.id)}>
            <motion.span className="nav-icon" animate={{ y: on ? -3 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}>
              <Icon name={tab.icon} />
            </motion.span>
            <span>{tab.label}</span>
            {on && <motion.i className="nav-dot" layoutId="nav-dot" transition={{ type: 'spring', stiffness: 500, damping: 26 }} />}
          </button>
        )
      })}
    </nav>
  )
}
