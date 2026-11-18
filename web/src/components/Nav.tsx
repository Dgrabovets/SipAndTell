import { motion } from 'motion/react'
import { useState } from 'react'
import { useVariants } from '../variants/useVariants'
import { Icon } from './Icon'

const TABS = [
  { id: 'diary', label: 'Дневник', icon: 'book' },
  { id: 'friends', label: 'Друзья', icon: 'friends' },
  { id: 'catalog', label: 'Каталог', icon: 'grid' },
]

/** Переключатель разделов сверху или снизу. Скользящая подсветка показывает активный раздел. */
export function Nav() {
  const { variants } = useVariants()
  const [active, setActive] = useState('diary')
  if (variants.nav === 'none') return null

  return (
    <nav className={`nav ${variants.nav}`} aria-label="Разделы">
      {TABS.map((tab) => (
        <button key={tab.id} aria-current={active === tab.id ? 'page' : undefined} onClick={() => setActive(tab.id)}>
          {active === tab.id && <motion.span className="nav-pill" layoutId={`nav-pill-${variants.nav}`} transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
          <Icon name={tab.icon} />
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
