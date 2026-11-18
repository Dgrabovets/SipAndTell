import { AnimatePresence, motion } from 'motion/react'
import { useState, type CSSProperties, type PointerEvent } from 'react'
import { CountUp } from '../components/CountUp'
import { CupDetails } from '../components/CupDetails'
import { GlassSheet } from '../components/GlassSheet'
import { spawnRipple } from '../components/spawnRipple'
import { CUPS, TEA_COLOR, type Cup } from '../data/cups'

/** Как открывается карточка: на месте, отдельным экраном или шторкой. */
export type OpenMode = 'inline' | 'screen' | 'sheet'

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

function CupFace({ cup, index }: { cup: Cup; index: number }) {
  return (
    <>
      <span className="hero-score">
        <CountUp to={cup.score} delay={0.3 + index * 0.08} />
      </span>
      <span className="hero-name">{cup.name}</span>
      <span className="chips">
        <span className="chip">{cup.type}</span>
        <span className="chip">{cup.mood}</span>
        <span className="chip">{cup.day}</span>
      </span>
    </>
  )
}

/** Вариант B: крупные стеклянные карточки с цветом чая и большой оценкой. */
export function HomeB({ mode }: { mode: OpenMode }) {
  const [openId, setOpenId] = useState<number | null>(null)
  const opened = CUPS.find((c) => c.id === openId)
  const toggle = (id: number) => setOpenId(openId === id ? null : id)

  return (
    <>
      <motion.h1 className="title" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        Недавно выпито
      </motion.h1>
      <motion.p className="subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        Нажми на карточку, чтобы вспомнить отзыв
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
              layout={mode === 'inline'}
              layoutId={mode === 'screen' && openId !== cup.id ? `cup-${cup.id}` : undefined}
              style={{ '--dot': TEA_COLOR[cup.type], visibility: mode === 'screen' && openId === cup.id ? 'hidden' : 'visible' } as CSSProperties}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              onPointerMove={moveLight}
              onPointerDown={spawnRipple}
              onPointerLeave={resetLight}
              onClick={() => toggle(cup.id)}
            >
              <CupFace cup={cup} index={i} />
              <AnimatePresence initial={false}>
                {mode === 'inline' && openId === cup.id && (
                  <motion.span
                    className="inline-details"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45 }}
                  >
                    <CupDetails cup={cup} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.li>
        ))}
      </ul>

      {mode === 'screen' && (
        <AnimatePresence>
          {opened && (
            <>
              <motion.div className="sheet-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpenId(null)} />
              <motion.div
                className="hero-cup detail-screen"
                layoutId={`cup-${opened.id}`}
                style={{ '--dot': TEA_COLOR[opened.type] } as CSSProperties}
                transition={{ type: 'spring', stiffness: 220, damping: 28 }}
              >
                <CupFace cup={opened} index={0} />
                <CupDetails cup={opened} />
                <button className="text-btn" onClick={() => setOpenId(null)}>
                  Назад
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}

      <GlassSheet open={mode === 'sheet' && !!opened} label={opened?.name ?? ''} onClose={() => setOpenId(null)}>
        {opened && (
          <>
            <h2>{opened.name}</h2>
            <CupDetails cup={opened} />
          </>
        )}
      </GlassSheet>
    </>
  )
}
