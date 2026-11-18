import { motion } from 'motion/react'
import { CUPS } from '../data/cups'
import { useVariants } from '../variants/useVariants'

function stats() {
  const average = CUPS.reduce((sum, c) => sum + c.score, 0) / CUPS.length
  const counts = new Map<string, number>()
  for (const c of CUPS) counts.set(c.type, (counts.get(c.type) ?? 0) + 1)
  const favourite = [...counts].sort((a, b) => b[1] - a[1])[0][0]
  return { count: CUPS.length, average: average.toLocaleString('ru-RU', { maximumFractionDigits: 1 }), favourite }
}

/** Шапка главной: заголовок, сводка недели или компактная строка. */
export function Header() {
  const { variants } = useVariants()

  if (variants.header === 'summary') {
    const s = stats()
    return (
      <>
        <motion.h1 className="title" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          Привет, чаёвник
        </motion.h1>
        <p className="subtitle">Твоя неделя в чае</p>
        <div className="stats">
          {[
            [String(s.count), 'чаепитий'],
            [s.average, 'средняя оценка'],
            [s.favourite, 'любимый тип'],
          ].map(([value, label], i) => (
            <motion.div key={label} className="stat" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
              <b>{value}</b>
              <span>{label}</span>
            </motion.div>
          ))}
        </div>
      </>
    )
  }

  if (variants.header === 'compact') {
    return (
      <div className="head-compact">
        <div>
          <motion.h1 className="title small" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Дневник
          </motion.h1>
          <p className="subtitle">{CUPS.length} чаепитий за неделю</p>
        </div>
        <span className="avatar big" aria-hidden>
          Д
        </span>
      </div>
    )
  }

  return (
    <>
      <motion.h1 className="title" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        Недавно выпито
      </motion.h1>
      <motion.p className="subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        Нажми на карточку, чтобы вспомнить чаепитие
      </motion.p>
    </>
  )
}
