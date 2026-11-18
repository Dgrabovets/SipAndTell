import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { Icon } from './Icon'

const OPEN = -132

/** Карточка, которую можно сдвинуть влево: под ней появляются «Изменить» и «Удалить».
 *  Кнопки проявляются по мере сдвига, чтобы не просвечивать сквозь прозрачное стекло. */
export function SwipeRow({ children }: { children: ReactNode }) {
  const x = useMotionValue(0)
  const reveal = useTransform(x, [-20, -90], [0, 1])
  const dragged = useRef(false)

  return (
    <div className="swipe">
      <motion.div className="swipe-actions" style={{ opacity: reveal }}>
        <button aria-label="Изменить">
          <Icon name="edit" />
        </button>
        <button className="danger" aria-label="Удалить">
          <Icon name="trash" />
        </button>
      </motion.div>
      <motion.div
        drag="x"
        style={{ x }}
        dragConstraints={{ left: OPEN, right: 0 }}
        dragElastic={0.12}
        onDragStart={() => (dragged.current = true)}
        onDragEnd={(_, info) => {
          animate(x, info.offset.x < -60 ? OPEN : 0, { type: 'spring', stiffness: 400, damping: 34 })
          setTimeout(() => (dragged.current = false), 60)
        }}
        onClickCapture={(e) => dragged.current && e.stopPropagation()}
      >
        {children}
      </motion.div>
    </div>
  )
}
