import { motion } from 'motion/react'
import { useState, type CSSProperties, type PointerEvent } from 'react'
import { CountUp } from '../components/CountUp'
import { CupDetails } from '../components/CupDetails'
import { GlassSheet } from '../components/GlassSheet'
import type { MoodStyle } from '../components/mood/MoodBlock'
import { spawnRipple } from '../components/spawnRipple'
import { CUPS, TEA_COLOR } from '../data/cups'
import { moodWord } from '../data/moods'

/** Блик на стекле идёт за пальцем или курсором. */
function moveLight(e: PointerEvent<HTMLElement>) {
  const box = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - box.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - box.top}px`)
}

function resetLight(e: PointerEvent<HTMLElement>) {
  e.currentTarget.style.removeProperty('--mx')
  e.currentTarget.style.removeProperty('--my')
}

/** Главная: крупные стеклянные карточки, детали открываются шторкой. */
export function HomeB({ moodStyle }: { moodStyle: MoodStyle }) {
  const [openId, setOpenId] = useState<number | null>(null)
  const opened = CUPS.find((c) => c.id === openId)

  return (
    <>
      <motion.h1 className="title" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        Недавно выпито
      </motion.h1>
      <motion.p className="subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        Нажми на карточку, чтобы вспомнить чаепитие
      </motion.p>
      <ul className="list" style={{ marginTop: 18 }}>
        {CUPS.map((cup, i) => (
          <motion.li
            key={cup.id}
            initial={{ opacity: 0, y: 36, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.12 + i * 0.08, type: 'spring', stiffness: 260, damping: 24 }}
          >
            <motion.button
              className="hero-cup"
              style={{ '--dot': TEA_COLOR[cup.type] } as CSSProperties}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              onPointerMove={moveLight}
              onPointerDown={spawnRipple}
              onPointerLeave={resetLight}
              onClick={() => setOpenId(cup.id)}
            >
              <span className="hero-score">
                <CountUp to={cup.score} delay={0.3 + i * 0.08} />
              </span>
              <span className="hero-name">{cup.name}</span>
              <span className="chips">
                <span className="chip">{cup.type}</span>
                <span className="chip">{moodWord(cup.mood)}</span>
                <span className="chip">{cup.day}</span>
              </span>
            </motion.button>
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
            <CupDetails cup={opened} moodStyle={moodStyle} />
          </>
        )}
      </GlassSheet>
    </>
  )
}
