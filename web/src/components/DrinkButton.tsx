import { motion } from 'motion/react'
import { useState, type MouseEvent } from 'react'
import { useVariants } from '../variants/useVariants'
import { fabEffect } from './fabEffects'
import { Icon } from './Icon'

/** Круглая главная кнопка. При нажатии идёт выбранная анимация: рябь, пар или свечение. */
export function DrinkButton({ onClick }: { onClick: () => void }) {
  const { variants } = useVariants()
  const [presses, setPresses] = useState(0)

  const press = (e: MouseEvent<HTMLButtonElement>) => {
    const box = e.currentTarget.getBoundingClientRect()
    fabEffect(variants.fab, box.left + box.width / 2, box.top + box.height / 2)
    setPresses(presses + 1)
    onClick()
  }

  return (
    <motion.button className={`main-btn ${variants.fab}`} aria-label="Выпил" whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.06 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }} onClick={press}>
      {variants.fab === 'glow' && presses > 0 && <span key={presses} className="halo" />}
      <motion.span className="btn-icon" animate={{ rotate: presses * 90 }} transition={{ type: 'spring', stiffness: 300, damping: 16 }}>
        <Icon name="plus" />
      </motion.span>
    </motion.button>
  )
}
