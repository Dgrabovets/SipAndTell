import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import type { Cup, Daytime, Place } from '../data/cups'
import { AboutTea } from './AboutTea'
import { Actions } from './Actions'
import { EffectTab } from './Effects'
import { Friends } from './Friends'
import { Icon } from './Icon'
import { MoodBlock } from './mood/MoodBlock'
import { Smooth } from './Smooth'

const PLACE: Record<Place, string> = { home: 'Дома', work: 'На работе', friends: 'С друзьями', road: 'В дороге' }
const TIME: Record<Daytime, string> = { morning: 'Утро', day: 'День', evening: 'Вечер' }

export interface CupActions {
  onAgain: () => void
  onEdit: () => void
  onDelete: () => void
}

const REVIEW_PREVIEW = 90
const SWIPE_PX = 60

const MINE = { id: 'mine', label: 'Моё чаепитие', icon: 'book' }
const EFFECT = { id: 'effect', label: 'Эффект', icon: 'pulse' }
const ABOUT = { id: 'about', label: 'О чае', icon: 'spark' }

/** Первая вкладка: настроение радаром, обстоятельства значками, короткий отзыв, друзья, действия. */
function MyCup({ cup, actions }: { cup: Cup; actions: CupActions }) {
  const [full, setFull] = useState(false)
  const long = cup.review.length > REVIEW_PREVIEW
  const circumstances = [
    { icon: cup.place, label: PLACE[cup.place] },
    { icon: cup.time, label: TIME[cup.time] },
  ]

  return (
    <div className="details">
      <MoodBlock key={cup.id} mood={cup.mood} />

      <ul className="circ-row" aria-label="Обстоятельства">
        {circumstances.map((item) => (
          <li key={item.label}>
            <Icon name={item.icon} />
            {item.label}
          </li>
        ))}
      </ul>

      <blockquote className="review">
        <p className={full ? '' : 'clamp'}>{cup.review}</p>
        {long && (
          <button className={full ? 'more-chip open' : 'more-chip'} aria-expanded={full} onClick={() => setFull(!full)}>
            {full ? 'Свернуть' : 'Читать целиком'}
            <Icon name="chevron" />
          </button>
        )}
      </blockquote>

      <Friends cup={cup} />
      <Actions cup={cup} onAgain={actions.onAgain} onEdit={actions.onEdit} onDelete={actions.onDelete} />
    </div>
  )
}

/** Переключатель вкладок: текст с подчёркиванием цвета чая, которое переезжает между ними. */
function TabBar({ tabs, tab, onTab }: { tabs: (typeof MINE)[]; tab: number; onTab: (i: number) => void }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t, i) => (
        <button key={t.id} role="tab" aria-selected={tab === i} onClick={() => onTab(i)}>
          {tab === i && <motion.span className="tab-mark" layoutId="tab-mark" transition={{ type: 'spring', stiffness: 460, damping: 34 }} />}
          <Icon name={t.icon} />
          {t.label}
        </button>
      ))}
    </div>
  )
}

/** Детали чаепития во вкладках: «Моё чаепитие», «Эффект» и «О чае» (справка от ИИ).
 *  Содержимое сдвигается по направлению вкладки, высота меняется плавно, вкладки листаются тапом и свайпом вбок. */
export function CupDetails({ cup, actions }: { cup: Cup; actions: CupActions }) {
  const tabs = [MINE, EFFECT, ABOUT]
  const [[picked, dir], setTab] = useState([0, 1])
  const tab = Math.min(picked, tabs.length - 1)
  const go = (next: number) => next !== tab && setTab([next, next > tab ? 1 : -1])

  return (
    <>
      <TabBar tabs={tabs} tab={tab} onTab={go} />
      <Smooth>
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={`${cup.id}-${tabs[tab].id}`}
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: d * 36, opacity: 0 }),
              show: { x: 0, opacity: 1 },
              leave: (d: number) => ({ x: d * -36, opacity: 0 }),
            }}
            initial="enter"
            animate="show"
            exit="leave"
            transition={{ duration: 0.2, ease: 'easeOut' }}
            drag="x"
            dragSnapToOrigin
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_PX) go(Math.min(tab + 1, tabs.length - 1))
              if (info.offset.x > SWIPE_PX) go(Math.max(tab - 1, 0))
            }}
          >
            {tabs[tab].id === 'mine' && <MyCup cup={cup} actions={actions} />}
            {tabs[tab].id === 'effect' && <EffectTab cup={cup} />}
            {tabs[tab].id === 'about' && <AboutTea cup={cup} />}
          </motion.div>
        </AnimatePresence>
      </Smooth>
    </>
  )
}
