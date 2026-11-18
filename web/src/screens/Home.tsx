import { motion } from 'motion/react'
import { useState } from 'react'
import { CupCard } from '../components/CupCard'
import { CupDetails } from '../components/CupDetails'
import { GlassSheet } from '../components/GlassSheet'
import { Header } from '../components/Header'
import { Nav } from '../components/Nav'
import { Score } from '../components/Score'
import { SwipeRow } from '../components/SwipeRow'
import { CUPS, type Cup } from '../data/cups'
import { useVariants } from '../variants/useVariants'

/** Как карточка появляется в списке: всплывает, выезжает слева, проявляется или стоит сразу. */
const SHOWN = { opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }
const ENTER = {
  rise: { opacity: 0, y: 36, scale: 0.94, x: 0, filter: 'blur(0px)' },
  slide: { opacity: 0, x: -70, y: 0, scale: 1, filter: 'blur(0px)' },
  blur: { opacity: 0, y: 0, x: 0, scale: 0.96, filter: 'blur(12px)' },
  none: SHOWN,
} as const

/** Карточки по дням: «Сегодня», «Вчера» и так далее, порядок как в списке. */
function byDay(cups: Cup[]): [string, Cup[]][] {
  const days = new Map<string, Cup[]>()
  for (const cup of cups) days.set(cup.day, [...(days.get(cup.day) ?? []), cup])
  return [...days]
}

const ORDER = new Map(CUPS.map((c, i) => [c.id, i]))

/** Главная: навигация, сводка недели и карточки чаепитий. Детали открываются шторкой. */
export function Home() {
  const { variants } = useVariants()
  const [openId, setOpenId] = useState<number | null>(null)
  const opened = CUPS.find((c) => c.id === openId)
  const enter = ENTER[variants.enter as keyof typeof ENTER]
  const groups: [string, Cup[]][] = variants.list === 'days' ? byDay(CUPS) : [['', CUPS]]

  return (
    <>
      <Nav />
      <Header />
      {groups.map(([day, cups]) => (
        <section key={day || 'all'}>
          {day && <h2 className="day-label">{day}</h2>}
          <ul className="list" style={{ marginTop: day ? 0 : 18 }}>
            {cups.map((cup) => {
              const i = ORDER.get(cup.id) ?? 0
              const card = <CupCard cup={cup} index={i} onOpen={() => setOpenId(cup.id)} />
              return (
                <motion.li key={cup.id} initial={enter} animate={SHOWN} transition={{ delay: 0.12 + i * 0.08, type: 'spring', stiffness: 260, damping: 24 }}>
                  {variants.gesture === 'swipe' ? <SwipeRow>{card}</SwipeRow> : card}
                </motion.li>
              )
            })}
          </ul>
        </section>
      ))}

      <GlassSheet open={!!opened} label={opened?.name ?? ''} onClose={() => setOpenId(null)}>
        {opened && (
          <>
            {variants.head === 'ring' ? (
              <div className="sheet-head">
                <div>
                  <h2 className="sheet-title">{opened.name}</h2>
                  <p className="sheet-sub">{opened.type}</p>
                </div>
                <Score value={opened.score} variant={variants.score} size={84} delay={0.2} />
              </div>
            ) : (
              <>
                <h2 className="sheet-title">{opened.name}</h2>
                <p className="sheet-sub">
                  {opened.type} · {opened.score} из 10
                </p>
              </>
            )}
            <CupDetails cup={opened} />
          </>
        )}
      </GlassSheet>
    </>
  )
}
