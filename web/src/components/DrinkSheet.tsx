import { GlassSheet } from './GlassSheet'

/** Облачка пара: положение по ширине карточки, размер и задержка, чтобы весь низ дышал неровно. */
const PUFFS = Array.from({ length: 11 }, (_, i) => ({
  left: 4 + i * 9.2,
  size: 90 + ((i * 37) % 50),
  delay: (i * 230) % 1500,
}))

/** Пар поднимается снизу вверх по всей ширине карточки и растворяется. */
function Steam() {
  return (
    <div className="sheet-steam" aria-hidden>
      {PUFFS.map((p, i) => (
        <span key={i} style={{ left: `${p.left}%`, width: p.size, height: p.size, animationDelay: `${p.delay}ms` }} />
      ))}
    </div>
  )
}

interface Props {
  open: boolean
  onClose: () => void
}

/** Заглушка формы «Выпил»: сама форма рисуется следующим шагом. */
export function DrinkSheet({ open, onClose }: Props) {
  return (
    <GlassSheet open={open} label="Выпил" decor={<Steam />} onClose={onClose}>
      <h2 className="sheet-title">Что ты пил?</h2>
      <p className="sheet-sub">Здесь будет форма: чай, оценка, настроение, обстоятельства, отзыв.</p>
    </GlassSheet>
  )
}
