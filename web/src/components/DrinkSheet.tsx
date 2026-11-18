import { AnimatePresence, motion } from 'motion/react'

interface Props {
  open: boolean
  onClose: () => void
}

/** Заглушка формы «Выпил»: сама форма рисуется следующим шагом. Шторку можно смахнуть вниз. */
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
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => info.offset.y > 120 && onClose()}
          >
            <div className="sheet-grip" aria-hidden />
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
