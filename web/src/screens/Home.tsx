import { motion } from 'motion/react'
import { useState } from 'react'
import { CalendarButton, MonthSheet } from '../components/Calendar'
import { CupCard } from '../components/CupCard'
import { CupDetails } from '../components/CupDetails'
import { GlassSheet } from '../components/GlassSheet'
import { Header } from '../components/Header'
import { Nav } from '../components/Nav'
import { Score } from '../components/Score'
import { SwipeRow } from '../components/SwipeRow'
import { TEA_COLOR, CUPS, type Cup } from '../data/cups'
import { dayGroup } from '../data/days'

const ORDER = new Map(CUPS.map((c, i) => [c.id, i]))

/** Карточки по группам: «Сегодня», «Вчера», «На этой неделе» и так далее, порядок как в списке. */
function grouped(cups: Cup[]): [string, Cup[]][] {
  const groups = new Map<string, Cup[]>()
  for (const cup of cups) {
    const label = dayGroup(cup.date)
    groups.set(label, [...(groups.get(label) ?? []), cup])
  }
  return [...groups]
}

/** Главная: навигация, сводка недели, календарь и карточки чаепитий. Детали открываются шторкой. */
export function Home() {
  const [openId, setOpenId] = useState<number | null>(null)
  const [shown, setShown] = useState(false)
  const [month, setMonth] = useState(false)
  // Чашка остаётся в состоянии, пока шторка уезжает, иначе содержимое пропало бы раньше неё.
  const opened = CUPS.find((c) => c.id === openId)
  const open = (id: number) => {
    setOpenId(id)
    setShown(true)
  }

  return (
    <>
      <Nav />
      <Header action={<CalendarButton onClick={() => setMonth(true)} />} />

      {grouped(CUPS).map(([label, cups]) => (
        <section key={label}>
          <h2 className="day-label">{label}</h2>
          <ul className="list">
            {cups.map((cup) => {
              const i = ORDER.get(cup.id) ?? 0
              return (
                <motion.li key={cup.id} initial={{ opacity: 0, x: -70 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + i * 0.08, type: 'spring', stiffness: 260, damping: 24 }}>
                  <SwipeRow>
                    <CupCard cup={cup} index={i} onOpen={() => open(cup.id)} />
                  </SwipeRow>
                </motion.li>
              )
            })}
          </ul>
        </section>
      ))}

      <MonthSheet open={month} onClose={() => setMonth(false)} onOpenCup={open} />

      <GlassSheet open={shown && !!opened} label={opened?.name ?? ''} tint={opened && TEA_COLOR[opened.type]} onClose={() => setShown(false)}>
        {opened && (
          <>
            <div className="sheet-head">
              <div>
                <h2 className="sheet-title">{opened.name}</h2>
                <p className="sheet-sub">{opened.type}</p>
              </div>
              <Score value={opened.score} shape="arc" size={68} delay={0.2} />
            </div>
            <CupDetails cup={opened} />
          </>
        )}
      </GlassSheet>
    </>
  )
}
