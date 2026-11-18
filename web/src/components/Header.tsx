import { motion } from 'motion/react'
import { CUPS } from '../data/cups'

function stats() {
  const average = CUPS.reduce((sum, c) => sum + c.score, 0) / CUPS.length
  const counts = new Map<string, number>()
  for (const c of CUPS) counts.set(c.type, (counts.get(c.type) ?? 0) + 1)
  const favourite = [...counts].sort((a, b) => b[1] - a[1])[0][0]
  return { count: CUPS.length, average: average.toLocaleString('ru-RU', { maximumFractionDigits: 1 }), favourite }
}

/** Шапка главной: приветствие и сводка недели. */
export function Header() {
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
