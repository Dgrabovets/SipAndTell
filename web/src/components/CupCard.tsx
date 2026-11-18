import { animate, motion, useMotionValue } from 'motion/react'
import type { CSSProperties, PointerEvent } from 'react'
import { TEA_COLOR, type Cup } from '../data/cups'
import { useVariants } from '../variants/useVariants'
import { Chips } from './Chips'
import { Score } from './Score'
import { spawnRipple } from './spawnRipple'

/** Как карточка отвечает на нажатие. */
const PRESS = {
  lift: { whileHover: { y: -3 }, whileTap: { scale: 0.97 } },
  tilt: { whileTap: { scale: 0.98 } },
  squish: { whileHover: { scale: 1.015 }, whileTap: { scale: 0.93, scaleY: 0.88 } },
} as const

const TILT_DEG = 9

/** Карточка чаепития строкой: название и чипы слева, оценка справа. Вид, плотность и отклик выбираются в панели «Вид». */
export function CupCard({ cup, index, onOpen }: { cup: Cup; index: number; onOpen: () => void }) {
  const { variants } = useVariants()
  const press = variants.press as keyof typeof PRESS
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)

  /** Блик на стекле идёт за пальцем, а в режиме «3D-наклон» карточка ещё и поворачивается к нему. */
  const move = (e: PointerEvent<HTMLElement>) => {
    const box = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - box.left
    const y = e.clientY - box.top
    e.currentTarget.style.setProperty('--mx', `${x}px`)
    e.currentTarget.style.setProperty('--my', `${y}px`)
    if (press === 'tilt') {
      tiltY.set((x / box.width - 0.5) * 2 * TILT_DEG)
      tiltX.set(-(y / box.height - 0.5) * 2 * TILT_DEG)
    }
  }

  const leave = (e: PointerEvent<HTMLElement>) => {
    e.currentTarget.style.removeProperty('--mx')
    e.currentTarget.style.removeProperty('--my')
    animate(tiltX, 0, { type: 'spring', stiffness: 200, damping: 18 })
    animate(tiltY, 0, { type: 'spring', stiffness: 200, damping: 18 })
  }

  return (
    <motion.button
      className={`hero-cup is-row surface-${variants.surface} density-${variants.density}`}
      style={{ '--dot': TEA_COLOR[cup.type], rotateX: tiltX, rotateY: tiltY, transformPerspective: 700 } as CSSProperties}
      {...PRESS[press]}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      onPointerMove={move}
      onPointerDown={spawnRipple}
      onPointerLeave={leave}
      onClick={onOpen}
    >
      <span className="cup-main">
        <span className="hero-name">{cup.name}</span>
        <Chips cup={cup} />
      </span>
      <Score value={cup.score} variant={variants.score} delay={0.3 + index * 0.08} />
    </motion.button>
  )
}
