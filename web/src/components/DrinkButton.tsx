import { motion } from 'motion/react'
import { useVariants } from '../variants/useVariants'
import { Icon } from './Icon'

/** Главная кнопка: во всю ширину, круглая или островок. */
export function DrinkButton({ onClick }: { onClick: () => void }) {
  const { variants } = useVariants()
  const kind = variants.drink

  return (
    <motion.button className={`main-btn ${kind}`} aria-label="Выпил" whileTap={{ scale: 0.94 }} whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 500, damping: 24 }} onClick={onClick}>
      {kind !== 'wide' && <Icon name="plus" />}
      {kind !== 'fab' && 'Выпил'}
    </motion.button>
  )
}
