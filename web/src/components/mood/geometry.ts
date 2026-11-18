import { animate } from 'motion/react'
import { useEffect, useState } from 'react'
import { AXES } from '../../data/moods'

/** Точка на окружности: вершина i, нулевая сверху, дальше по часовой. Число вершин берётся из AXES. */
export function vertex(i: number, radius: number): [number, number] {
  const angle = ((-90 + (i * 360) / AXES.length) * Math.PI) / 180
  return [radius * Math.cos(angle), radius * Math.sin(angle)]
}

export const pointsOf = (list: [number, number][]) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

/** Рост от 0 до 1 при открытии. */
export function useGrow(delay = 0.25): number {
  const [t, setT] = useState(0)
  useEffect(() => {
    const controls = animate(0, 1, { duration: 1.2, delay, ease: [0.2, 0.8, 0.2, 1], onUpdate: setT })
    return () => controls.stop()
  }, [delay])
  return t
}

/** Положение подписи у вершины: слева, справа или по центру. */
export function anchorOf(i: number): 'start' | 'middle' | 'end' {
  const [x] = vertex(i, 1)
  return Math.abs(x) < 0.2 ? 'middle' : x > 0 ? 'start' : 'end'
}
