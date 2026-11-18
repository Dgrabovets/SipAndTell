import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'

interface Props {
  open: boolean
  label: string
  onClose: () => void
  children: ReactNode
}

/** Стеклянная шторка снизу. Смахивание вниз закрывает, кнопка «Назад» делает то же без жеста. */
export function GlassSheet({ open, label, onClose, children }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="sheet-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="sheet"
            role="dialog"
            aria-label={label}
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
            {children}
            <button className="text-btn" onClick={onClose}>
              Назад
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
