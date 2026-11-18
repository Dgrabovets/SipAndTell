import { motion } from 'motion/react'
import { useState } from 'react'
import { useVariants } from '../variants/useVariants'
import { Icon } from './Icon'

/** Круглая главная кнопка. Плюс поворачивается при нажатии, а как кнопка «живая», выбирается в панели «Вид». */
export function DrinkButton({ onClick }: { onClick: () => void }) {
  const { variants } = useVariants()
  const [presses, setPresses] = useState(0)

  const press = () => {
    setPresses(presses + 1)
    onClick()
  }

  return (
    <motion.button className="main-btn" data-fx={variants.fab} aria-label="Выпил" whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.06 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }} onClick={press}>
      <motion.span className="btn-icon" animate={{ rotate: presses * 90 }} transition={{ type: 'spring', stiffness: 300, damping: 16 }}>
        <Icon name="plus" />
      </motion.span>
      {variants.fab === 'label' && <span>Выпил</span>}
    </motion.button>
  )
}
