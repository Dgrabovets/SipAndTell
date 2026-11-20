import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import type { Cup } from '../data/cups'
import { Icon } from './Icon'

interface Props {
  cup: Cup
  onAgain: () => void
  onEdit: () => void
  onDelete: () => void
}

/** Текст, которым делятся: название, оценка и отзыв. Если в Telegram есть системное меню, оно, иначе копирование. */
async function share(cup: Cup) {
  const text = `Пил ${cup.name}, ${cup.score} из 10. ${cup.review}`.trim()
  try {
    if (navigator.share) await navigator.share({ text })
    else await navigator.clipboard.writeText(text)
  } catch {
    /* закрыли меню или буфер недоступен */
  }
}

/** Главное действие и меню редких. Иконки живут: «ещё раз» крутится при нажатии, «⋯» поворачивается, пункты меню выезжают по очереди. */
export function Actions({ cup, onAgain, onEdit, onDelete }: Props) {
  const [open, setOpen] = useState(false)
  const [turns, setTurns] = useState(0)
  const menu = [
    { icon: 'edit', label: 'Изменить', danger: false, run: onEdit },
    { icon: 'share', label: 'Поделиться', danger: false, run: () => share(cup) },
    { icon: 'trash', label: 'Удалить', danger: true, run: onDelete },
  ]

  return (
    <div className="actions-menu">
      <div className="actions">
        <motion.button
          className="glass-btn primary"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          onClick={() => {
            setTurns(turns + 1)
            onAgain()
          }}
        >
          <motion.span className="btn-icon" animate={{ rotate: turns * 360 }} transition={{ duration: 0.7, ease: [0.3, 1.2, 0.4, 1] }}>
            <Icon name="again" />
          </motion.span>
          Выпить ещё раз
        </motion.button>
        <motion.button className="round-icon solo" aria-label="Ещё действия" aria-expanded={open} whileTap={{ scale: 0.88 }} animate={{ rotate: open ? 90 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }} onClick={() => setOpen(!open)}>
          <Icon name="more" />
        </motion.button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.ul className="popover" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.28 }}>
            {menu.map((item, i) => (
              <motion.li key={item.label} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 + i * 0.07, type: 'spring', stiffness: 380, damping: 26 }}>
                <motion.button className={item.danger ? 'danger' : ''} whileTap={{ scale: 0.97, x: 4 }} onClick={item.run}>
                  <Icon name={item.icon} />
                  {item.label}
                </motion.button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
