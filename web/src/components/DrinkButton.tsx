import { motion } from 'motion/react'

export function DrinkButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button className="main-btn" whileTap={{ scale: 0.97 }} onClick={onClick}>
      Выпил
    </motion.button>
  )
}
