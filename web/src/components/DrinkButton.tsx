import { motion } from 'motion/react'
import { useState } from 'react'
import { Icon } from './Icon'

/** Круглая главная кнопка. Кольцо мягко пульсирует, плюс поворачивается при нажатии. */
export function DrinkButton({ onClick }: { onClick: () => void }) {
  const [presses, setPresses] = useState(0)

  const press = () => {
    setPresses(presses + 1)
    onClick()
  }

  return (
    <motion.button className="main-btn" aria-label="Выпил" whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.06 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }} onClick={press}>
      <motion.span className="btn-icon" animate={{ rotate: presses * 90 }} transition={{ type: 'spring', stiffness: 300, damping: 16 }}>
        <Icon name="plus" />
      </motion.span>
    </motion.button>
  )
}
