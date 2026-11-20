import { motion } from 'motion/react'
import { useState } from 'react'
import { CalendarButton, MonthSheet } from '../components/Calendar'
import { CupCard } from '../components/CupCard'
import { CupDetails } from '../components/CupDetails'
import { GlassSheet } from '../components/GlassSheet'
import { Header } from '../components/Header'
import { SoundToggle } from '../components/SoundToggle'
import { Nav, type Tab } from '../components/Nav'
import { Score } from '../components/Score'
import { SwipeRow } from '../components/SwipeRow'
import { TEA_COLOR, type Cup } from '../data/cups'
import { drinkStore } from '../data/drinkStore'
import { cupStore, useCups } from '../data/store'
import { haptics } from '../feedback'
import { dayGroup } from '../data/days'
import { CatalogScreen } from './CatalogScreen'
import { FriendsScreen } from './FriendsScreen'
import { StatsScreen } from './StatsScreen'

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
  const cups = useCups()
  const order = new Map(cups.map((c, i) => [c.id, i]))
  const [toDelete, setToDelete] = useState<Cup | null>(null)
  const [tab, setTab] = useState<Tab>('diary')
  const [openId, setOpenId] = useState<number | null>(null)
  const [shown, setShown] = useState(false)
  const [month, setMonth] = useState(false)
  const [from, setFrom] = useState<'top' | 'bottom'>('top')
  // Чашка остаётся в состоянии, пока шторка уезжает, иначе содержимое пропало бы раньше неё.
  const opened = cups.find((c) => c.id === openId)
  /** Из календаря рябь входит в детали снизу, с главной сверху. */
  const open = (id: number, edge: 'top' | 'bottom' = 'top') => {
    setFrom(edge)
    setOpenId(id)
    setShown(true)
  }

  return (
    <>
      <Nav active={tab} onChange={setTab} />
      {tab === 'friends' && <FriendsScreen />}
      {tab === 'catalog' && <CatalogScreen />}
      {tab === 'stats' && <StatsScreen />}
      {tab === 'diary' && (
        <>
          <Header
            action={
              <div className="head-actions">
                <SoundToggle />
                <CalendarButton onClick={() => setMonth(true)} />
              </div>
            }
          />
          {cups.length === 0 && (
            <p className="empty">
              <b>Дневник пока пуст</b>
              Нажми плюс внизу, сфотографируй чай или расскажи о нём голосом.
            </p>
          )}
        </>
      )}

      {tab === 'diary' && grouped(cups).map(([label, group]) => (
        <section key={label}>
          <h2 className="day-label">{label}</h2>
          <ul className="list">
            {group.map((cup) => {
              const i = order.get(cup.id) ?? 0
              return (
                <motion.li key={cup.id} initial={{ opacity: 0, x: -70 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + i * 0.08, type: 'spring', stiffness: 260, damping: 24 }}>
                  <SwipeRow onEdit={() => drinkStore.edit(cup)} onDelete={() => setToDelete(cup)}>
                    <CupCard cup={cup} index={i} onOpen={() => open(cup.id)} />
                  </SwipeRow>
                </motion.li>
              )
            })}
          </ul>
        </section>
      ))}

      <MonthSheet open={month} onClose={() => setMonth(false)} onOpenCup={(id) => open(id, 'bottom')} />

      <GlassSheet open={!!toDelete} label="Удалить чаепитие" narrow onClose={() => setToDelete(null)}>
        <h2 className="sheet-title">Удалить чаепитие?</h2>
        <p className="sheet-sub">{toDelete?.name}. Вернуть его будет нельзя.</p>
        <div className="confirm-row">
          <button className="glass-btn" onClick={() => setToDelete(null)}>
            Оставить
          </button>
          <button
            className="glass-btn danger"
            onClick={() => {
              if (toDelete) cupStore.remove(toDelete.id)
              haptics.warning()
              setToDelete(null)
              setShown(false)
            }}
          >
            Удалить
          </button>
        </div>
      </GlassSheet>

      <GlassSheet open={shown && !!opened} label={opened?.name ?? ''} tint={opened && TEA_COLOR[opened.type]} rippleFrom={from} onClose={() => setShown(false)}>
        {opened && (
          <>
            <div className="sheet-head">
              <div>
                <h2 className="sheet-title">{opened.name}</h2>
                <p className="sheet-sub">{opened.type}</p>
              </div>
              <Score value={opened.score} shape="arc" size={68} delay={0.2} />
            </div>
            <CupDetails
              cup={opened}
              actions={{
                onAgain: () => {
                  setShown(false)
                  drinkStore.open({ name: opened.name, type: opened.type })
                },
                onEdit: () => {
                  setShown(false)
                  drinkStore.edit(opened)
                },
                onDelete: () => setToDelete(opened),
              }}
            />
          </>
        )}
      </GlassSheet>
    </>
  )
}
