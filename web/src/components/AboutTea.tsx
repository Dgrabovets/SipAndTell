import { useEffect, useState, type CSSProperties } from 'react'
import { TEA_COLOR, type Cup } from '../data/cups'
import { Icon } from './Icon'

const THINKING_MS = 700

/** Вкладка «О чае»: справка от ИИ о чае из чаепития. Пока ответ тестовый, перед ним короткая заглушка загрузки. */
export function AboutTea({ cup }: { cup: Cup }) {
  const [loading, setLoading] = useState(true)
  const { origin, brew, notes, text, effect, caffeine } = cup.about

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), THINKING_MS)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="details about" style={{ '--tint': TEA_COLOR[cup.type] } as CSSProperties}>
      <p className="ai-badge">
        <Icon name="spark" />
        Справка от ИИ
      </p>
      {loading ? (
        <div className="about-skeleton" aria-busy="true" aria-label="ИИ собирает справку">
          <i />
          <i />
          <i />
          <i />
        </div>
      ) : (
        <>
          <section>
            <h3>Откуда</h3>
            <p>{origin}</p>
          </section>
          <section>
            <h3>Вкус</h3>
            <ul className="about-notes">
              {notes.map((n) => (
                <li key={n} className="chip tinted">
                  {n}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3>Эффект</h3>
            <p className="caffeine">
              Кофеин: <b>{caffeine}</b>
            </p>
            <p>{effect}</p>
          </section>
          <section>
            <h3>Как заваривать</h3>
            <p>{brew}</p>
          </section>
          <section>
            <h3>О чае</h3>
            <p>{text}</p>
          </section>
          <small className="ai-note">Тестовый текст. Настоящий ответ ИИ появится вместе с сервером, он может ошибаться.</small>
        </>
      )}
    </div>
  )
}
