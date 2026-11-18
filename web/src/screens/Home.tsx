import { motion } from 'motion/react'
import { useState } from 'react'
import { CupCard } from '../components/CupCard'
import { CupDetails } from '../components/CupDetails'
import { GlassSheet } from '../components/GlassSheet'
import { Header } from '../components/Header'
import { Nav } from '../components/Nav'
import { CUPS } from '../data/cups'

/** Главная: навигация, сводка недели и карточки чаепитий. Детали открываются шторкой. */
export function Home() {
  const [openId, setOpenId] = useState<number | null>(null)
  const opened = CUPS.find((c) => c.id === openId)

  return (
    <>
      <Nav />
      <Header />
      <ul className="list" style={{ marginTop: 18 }}>
        {CUPS.map((cup, i) => (
          <motion.li key={cup.id} initial={{ opacity: 0, y: 36, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.12 + i * 0.08, type: 'spring', stiffness: 260, damping: 24 }}>
            <CupCard cup={cup} index={i} onOpen={() => setOpenId(cup.id)} />
          </motion.li>
        ))}
      </ul>

      <GlassSheet open={!!opened} label={opened?.name ?? ''} onClose={() => setOpenId(null)}>
        {opened && (
          <>
            <h2 className="sheet-title">{opened.name}</h2>
            <p className="sheet-sub">
              {opened.type} · {opened.score} из 10
            </p>
            <CupDetails cup={opened} />
          </>
        )}
      </GlassSheet>
    </>
  )
}
