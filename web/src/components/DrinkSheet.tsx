import { AnimatePresence, motion } from 'motion/react'

interface Props {
  open: boolean
  onClose: () => void
}

/** Заглушка формы «Выпил»: сама форма рисуется следующим шагом. */
export function DrinkSheet({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="sheet-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="sheet"
            role="dialog"
            aria-label="Выпил"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 420, damping: 38 }}
          >
            <h2>Что ты пил?</h2>
            <p>Здесь будет форма: чай, оценка, настроение, обстоятельства, отзыв.</p>
            <button className="text-btn" onClick={onClose}>
              Назад
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
