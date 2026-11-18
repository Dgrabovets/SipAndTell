import { AnimatePresence, motion, useDragControls } from 'motion/react'
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { Icon } from './Icon'
import { flowRippleInto } from './spawnRipple'

interface Props {
  open: boolean
  label: string
  onClose: () => void
  children: ReactNode
  /** Цвет чая: шторка подкрашивается им, как карточка. */
  tint?: string
  /** Узкая шторка (календарь): на широком экране не растягивается на всю ширину. */
  narrow?: boolean
  /** Откуда в шторку входит рябь от нажатия на карточку: сверху или снизу. */
  rippleFrom?: 'top' | 'bottom'
}

/** Стеклянная шторка снизу, выезжает снизу. Закрывается крестиком, смахиванием за «ручку» или тапом по фону.
 *  Рябь от нажатия на карточку перетекает сюда, когда шторка открывается. */
export function GlassSheet({ open, label, onClose, children, tint, narrow, rippleFrom = 'top' }: Props) {
  const controls = useDragControls()
  const sheet = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && sheet.current) flowRippleInto(sheet.current, rippleFrom)
  }, [open, rippleFrom])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="sheet-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            ref={sheet}
            className={['sheet', tint && 'tinted', narrow && 'narrow'].filter(Boolean).join(' ')}
            role="dialog"
            aria-label={label}
            style={{ '--dot': tint } as CSSProperties}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            drag="y"
            dragControls={controls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => info.offset.y > 120 && onClose()}
          >
            <div className="sheet-grip-area" onPointerDown={(e) => controls.start(e)} />
            <button className="close-btn" aria-label="Закрыть" onClick={onClose}>
              <Icon name="close" />
            </button>
            <div className="sheet-body">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
