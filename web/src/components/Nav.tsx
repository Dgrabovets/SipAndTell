import { motion } from 'motion/react'
import { Icon } from './Icon'

export type Tab = 'diary' | 'friends' | 'catalog' | 'stats'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'diary', label: 'Дневник', icon: 'book' },
  { id: 'friends', label: 'Друзья', icon: 'friends' },
  { id: 'catalog', label: 'Каталог', icon: 'grid' },
  { id: 'stats', label: 'Графики', icon: 'chart' },
]

/** Переключатель разделов сверху: активный раздел приподнимается, под ним переезжает точка. */
export function Nav({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  return (
    <nav className="nav top" aria-label="Разделы">
      {TABS.map((tab) => {
        const on = active === tab.id
        return (
          <button key={tab.id} aria-current={on ? 'page' : undefined} onClick={() => onChange(tab.id)}>
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
