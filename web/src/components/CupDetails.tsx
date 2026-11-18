import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import type { Cup, Daytime, Place } from '../data/cups'
import { useVariants } from '../variants/useVariants'
import { AboutTea } from './AboutTea'
import { Actions } from './Actions'
import { Friends } from './Friends'
import { Icon } from './Icon'
import { MoodBlock } from './mood/MoodBlock'
import { Smooth } from './Smooth'

const PLACE: Record<Place, string> = { home: 'Дома', work: 'На работе', friends: 'С друзьями', road: 'В дороге' }
const TIME: Record<Daytime, string> = { morning: 'Утро', day: 'День', evening: 'Вечер' }

const REVIEW_PREVIEW = 90
const SWIPE_PX = 60

const TABS = [
  { label: 'Моё чаепитие', icon: 'book' },
  { label: 'О чае', icon: 'spark' },
]

/** Первая вкладка: настроение радаром, обстоятельства значками, короткий отзыв, друзья, действия. */
function MyCup({ cup }: { cup: Cup }) {
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
      <Actions />
    </div>
  )
}

/** Переключатель вкладок. Вид выбирается в панели «Вид»: плашка, подчёркивание или точки со свайпом. */
function TabBar({ style, tab, onTab }: { style: string; tab: number; onTab: (i: number) => void }) {
  if (style === 'pager') {
    return (
      <div className="tabs" data-style="pager" role="tablist">
        <span className="pager-dots">
          {TABS.map((t, i) => (
            <button key={t.label} role="tab" aria-selected={tab === i} aria-label={t.label} onClick={() => onTab(i)}>
              {tab === i && <motion.i layoutId="pager-dot" transition={{ type: 'spring', stiffness: 500, damping: 30 }} />}
            </button>
          ))}
        </span>
        <b>{TABS[tab].label}</b>
        <small>листай вбок</small>
      </div>
    )
  }

  return (
    <div className="tabs" data-style={style} role="tablist">
      {TABS.map((t, i) => (
        <button key={t.label} role="tab" aria-selected={tab === i} onClick={() => onTab(i)}>
          {tab === i && <motion.span className="tab-mark" layoutId={`tab-mark-${style}`} transition={{ type: 'spring', stiffness: 460, damping: 34 }} />}
          <Icon name={t.icon} />
          {t.label}
        </button>
      ))}
    </div>
  )
}

/** Детали чаепития в двух вкладках: «Моё чаепитие» и «О чае» (справка от ИИ). Содержимое сдвигается по направлению
 *  вкладки, высота меняется плавно. В режимах «подчёркивание» и «точки» вкладки ещё листаются свайпом. */
export function CupDetails({ cup }: { cup: Cup }) {
  const { variants } = useVariants()
  const [[tab, dir], setTab] = useState([0, 1])
  const go = (next: number) => next !== tab && setTab([next, next > tab ? 1 : -1])
  const swipe = variants.tabs !== 'segment'

  return (
    <>
      <TabBar style={variants.tabs} tab={tab} onTab={go} />
      <Smooth>
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={`${cup.id}-${tab}`}
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
            drag={swipe ? 'x' : false}
            dragSnapToOrigin
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_PX) go(1)
              if (info.offset.x > SWIPE_PX) go(0)
            }}
          >
            {tab === 0 ? <MyCup cup={cup} /> : <AboutTea cup={cup} />}
          </motion.div>
        </AnimatePresence>
      </Smooth>
    </>
  )
}
