import { useEffect, useState, type CSSProperties } from 'react'
import { GlassSheet } from './GlassSheet'

/** Сколько живёт пар: дольше самой длинной анимации, после этого слой убирается. */
const STEAM_MS = 6500

/** Облачка пара: положение по ширине карточки, размер и задержка, чтобы весь низ дышал неровно. */
const PUFFS = Array.from({ length: 11 }, (_, i) => ({
  left: 4 + i * 9.2,
  size: 90 + ((i * 37) % 50),
  delay: (i * 230) % 1500,
  /** В конце клубы расходятся от середины: левые влево, правые вправо. */
  drift: Math.round((4 + i * 9.2 - 50) * 1.4),
}))

/** Пар живёт отдельным слоем поверх всего: играет один раз при открытии и не зависит от шторки.
 *  Закрыли карточку или нажали куда-то, пар всё равно доходит до конца и не уезжает вниз вместе с ней. */
function Steam({ trigger }: { trigger: boolean }) {
  const [burst, setBurst] = useState(0)
  const [was, setWas] = useState(trigger)

  // Новый залп при каждом открытии: состояние меняется прямо при рендере, без лишнего прохода эффекта.
  if (trigger !== was) {
    setWas(trigger)
    if (trigger) setBurst((b) => b + 1)
  }

  useEffect(() => {
    if (burst === 0) return
    const timer = setTimeout(() => setBurst(0), STEAM_MS)
    return () => clearTimeout(timer)
  }, [burst])

  if (burst === 0) return null
  return (
    <div className="steam-layer" key={burst} aria-hidden>
      {PUFFS.map((p, i) => (
        <span key={i} style={{ left: `${p.left}%`, width: p.size, height: p.size, animationDelay: `${p.delay}ms`, '--dx': `${p.drift}px` } as CSSProperties} />
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
    <>
      <Steam trigger={open} />
      <GlassSheet open={open} label="Выпил" onClose={onClose}>
        <h2 className="sheet-title">Что ты пил?</h2>
        <p className="sheet-sub">Здесь будет форма: чай, оценка, настроение, обстоятельства, отзыв.</p>
      </GlassSheet>
    </>
  )
}
