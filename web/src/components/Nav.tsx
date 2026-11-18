import { motion } from 'motion/react'
import { useState } from 'react'
import { useVariants } from '../variants/useVariants'
import { Icon } from './Icon'

const TABS = [
  { id: 'diary', label: 'Дневник', icon: 'book' },
  { id: 'friends', label: 'Друзья', icon: 'friends' },
  { id: 'catalog', label: 'Каталог', icon: 'grid' },
]

/** Как индикатор переезжает между разделами: плавно, с упругим «желе» или точкой под подписью. */
const SPRINGS = {
  slide: { type: 'spring', stiffness: 420, damping: 32 },
  jelly: { type: 'spring', stiffness: 300, damping: 9, mass: 0.9 },
  dot: { type: 'spring', stiffness: 500, damping: 26 },
} as const

/** Переключатель разделов сверху. */
export function Nav() {
  const { variants } = useVariants()
  const [active, setActive] = useState('diary')
  const style = variants.nav as keyof typeof SPRINGS

  return (
    <nav className={`nav top ${style}`} aria-label="Разделы">
      {TABS.map((tab) => {
        const on = active === tab.id
        return (
          <button key={tab.id} aria-current={on ? 'page' : undefined} onClick={() => setActive(tab.id)}>
            {on && style !== 'dot' && <motion.span className="nav-pill" layoutId="nav-pill" transition={SPRINGS[style]} />}
            <motion.span className="nav-icon" animate={{ y: on && style === 'dot' ? -3 : 0, scale: on && style === 'jelly' ? [1, 1.35, 1] : 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}>
              <Icon name={tab.icon} />
            </motion.span>
            <span>{tab.label}</span>
            {on && style === 'dot' && <motion.i className="nav-dot" layoutId="nav-dot" transition={SPRINGS.dot} />}
          </button>
        )
      })}
    </nav>
  )
}
