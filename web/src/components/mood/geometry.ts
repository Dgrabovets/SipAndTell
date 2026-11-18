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

const WAVE_WAITS_S = 1.4
const WAVE_LASTS_S = 6.5
const WAVE_SWINGS = 3.5

/** Волна по вершинам: после роста бежит 3–4 круга, амплитуда нарастает и затухает, потом всё замирает.
 *  amp от 0 до 1, phase это фаза в радианах. Пока просят меньше движения, волны нет. */
export function useSettlingWave(): { amp: number; phase: number } {
  const [wave, setWave] = useState({ amp: 0, phase: 0 })
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const start = performance.now() + WAVE_WAITS_S * 1000
    let id = 0
    const tick = (now: number) => {
      const p = (now - start) / (WAVE_LASTS_S * 1000)
      if (p >= 1) return setWave({ amp: 0, phase: 0 })
      setWave({ amp: p < 0 ? 0 : Math.sin(Math.PI * p), phase: p * WAVE_SWINGS * 2 * Math.PI })
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [])
  return wave
}

/** Замкнутая плавная кривая через точки (Катмулл-Ром, переведённый в кубические Безье). */
export function smoothPath(p: [number, number][]): string {
  const n = p.length
  const at = (i: number) => p[(i + n) % n]
  let d = `M${at(0)[0].toFixed(1)} ${at(0)[1].toFixed(1)}`
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d + 'Z'
}
