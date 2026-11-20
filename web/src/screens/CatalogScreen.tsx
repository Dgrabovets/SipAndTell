import { motion } from 'motion/react'
import { useState, type CSSProperties } from 'react'
import { AboutTea } from '../components/AboutTea'
import { GlassSheet } from '../components/GlassSheet'
import { Score } from '../components/Score'
import { TEA_COLOR, type Cup, type TeaType } from '../data/cups'
import { drinkStore } from '../data/drinkStore'
import { useCups } from '../data/store'

interface Tea {
  key: string
  cup: Cup
  count: number
  rating: number
  /** Чай без справки: добавлен недавно и ждёт проверки. */
  pending: boolean
}

/** Каталог из чаёв, которые уже пили: средняя оценка всех, кто отметил, и сколько раз выпито. */
function teasOf(cups: Cup[]): Tea[] {
  const groups = new Map<string, Cup[]>()
  for (const cup of cups) groups.set(cup.name.toLowerCase(), [...(groups.get(cup.name.toLowerCase()) ?? []), cup])
  return [...groups].map(([key, list]) => {
    const scores = list.flatMap((c) => [c.score, ...c.friends.map((f) => f.score)])
    return { key, cup: list[0], count: list.length, rating: scores.reduce((a, b) => a + b, 0) / scores.length, pending: list[0].about.origin === '' }
  })
}

/** Экран «Каталог»: поиск, фильтр по типу, справка о чае в шторке. */
export function CatalogScreen() {
  const teas = teasOf(useCups())
  const [query, setQuery] = useState('')
  const [type, setType] = useState<TeaType | null>(null)
  const [pickedKey, setPickedKey] = useState<string | null>(null)
  const [shown, setShown] = useState(false)
  const types = [...new Set(teas.map((t) => t.cup.type))]
  const visible = teas.filter((t) => (!type || t.cup.type === type) && t.cup.name.toLowerCase().includes(query.trim().toLowerCase()))
  const picked = teas.find((t) => t.key === pickedKey)

  return (
    <>
      <h1 className="title">Каталог</h1>
      <p className="subtitle">Чаи, которые уже пили</p>

      <input className="text-input catalog-search" type="search" placeholder="Найти чай" aria-label="Найти чай" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="chips-row" role="group" aria-label="Тип чая">
        {types.map((t) => (
          <button key={t} className="chip tinted pick" aria-pressed={type === t} style={{ '--tint': TEA_COLOR[t] } as CSSProperties} onClick={() => setType(type === t ? null : t)}>
            {t}
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="empty">
          <b>Ничего не нашлось</b>
          Попробуй другое слово или сними фильтр.
        </p>
      )}

      <ul className="list cat-list">
        {visible.map((t, i) => (
          <motion.li key={t.key} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 + i * 0.06, type: 'spring', stiffness: 260, damping: 24 }}>
            <motion.button
              className="hero-cup is-row cat-item"
              style={{ '--dot': TEA_COLOR[t.cup.type] } as CSSProperties}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setPickedKey(t.key)
                setShown(true)
              }}
            >
              <span className="hero-name">
                {t.cup.name}
                <small>
                  Выпито: {t.count}
                  {t.pending && ' · на проверке'}
                </small>
              </span>
              <span className="chip tinted" style={{ '--tint': TEA_COLOR[t.cup.type] } as CSSProperties}>
                {t.cup.type}
              </span>
              <Score value={Math.round(t.rating)} size={44} delay={0.2 + i * 0.05} />
            </motion.button>
          </motion.li>
        ))}
      </ul>

      <GlassSheet open={shown && !!picked} label={picked?.cup.name ?? ''} tint={picked && TEA_COLOR[picked.cup.type]} onClose={() => setShown(false)}>
        {picked && (
          <>
            <h2 className="sheet-title">{picked.cup.name}</h2>
            <p className="sheet-sub">
              {picked.cup.type}, средняя оценка {picked.rating.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </p>
            <AboutTea cup={picked.cup} />
            <motion.button
              className="save-btn"
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setShown(false)
                drinkStore.open({ name: picked.cup.name, type: picked.cup.type })
              }}
            >
              Выпить ещё раз
            </motion.button>
          </>
        )}
      </GlassSheet>
    </>
  )
}
