import { animate } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
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

/** Как двигаются вершины: бегущей волной, прыжками, вразнобой, всем телом вместе, проседанием, дрожью,
 *  одним вдохом наружу (pulse), провисанием верхних вершин (droop) или поворотом фигуры (turn). */
export type WaveKind = 'travel' | 'bounce' | 'sway' | 'breath' | 'sag' | 'jitter' | 'pulse' | 'droop' | 'turn'

export interface WaveProfile {
  kind: WaveKind
  /** Сколько раз качнётся. */
  swings: number
  /** Сколько длится всё движение, секунды. */
  seconds: number
  /** Размах как доля радиуса (для поворота доля шага между вершинами). */
  amp: number
}

/** Характер движения для каждого настроения, порядок как в AXES. Всё затухает и замирает на значениях,
 *  вершины не выходят за радар: бодрость один вдох наружу, радость прыжки, любопытство поворот, уют дыхание,
 *  усталость провисание сверху, грусть оседание, раздражение дёрганье, тревога мелкая дрожь. */
export const WAVE_BY_MOOD: WaveProfile[] = [
  { kind: 'pulse', swings: 3, seconds: 3.5, amp: 0.09 },
  { kind: 'bounce', swings: 4, seconds: 5, amp: 0.07 },
  { kind: 'turn', swings: 2, seconds: 7, amp: 0.2 },
  { kind: 'breath', swings: 2.5, seconds: 9, amp: 0.04 },
  { kind: 'droop', swings: 1.5, seconds: 9, amp: 0.1 },
  { kind: 'sag', swings: 1, seconds: 8, amp: 0.08 },
  { kind: 'jitter', swings: 8, seconds: 3.5, amp: 0.06 },
  { kind: 'jitter', swings: 14, seconds: 6.5, amp: 0.025 },
]

/** Отклонение вершины i от значения, от -1 до 1, для фазы phase. */
export function waveAt(kind: WaveKind, phase: number, i: number): number {
  const along = phase + (i * Math.PI) / 4
  switch (kind) {
    case 'travel':
      return Math.sin(along)
    case 'bounce':
      return Math.abs(Math.sin(along / 2)) * 2 - 1
    case 'sway':
      return (Math.sin(along) + 0.6 * Math.sin(phase / 2 + i * 1.3)) / 1.6
    case 'breath':
      return Math.sin(phase)
    case 'sag':
      return -(1 - Math.cos(phase)) / 2
    case 'pulse':
      return (1 - Math.cos(phase)) / 2
    case 'droop':
      return (-(1 - Math.cos(phase)) / 2) * ((1 + Math.cos((2 * Math.PI * i) / AXES.length)) / 2)
    case 'turn':
      return Math.sin(phase)
    case 'jitter':
      return (Math.sin(phase + i * 2.4) + 0.5 * Math.sin(phase * 2.3 + i * 1.7)) / 1.5
  }
}

/** Волна по вершинам: после роста бежит заданное число раз, амплитуда нарастает и затухает, потом всё замирает.
 *  amp от 0 до 1, phase это фаза в радианах. Пока просят меньше движения, волны нет. */
export function useSettlingWave(profile: WaveProfile): { amp: number; phase: number } {
  const [wave, setWave] = useState({ amp: 0, phase: 0 })
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const start = performance.now() + WAVE_WAITS_S * 1000
    let id = 0
    const tick = (now: number) => {
      const p = (now - start) / (profile.seconds * 1000)
      if (p >= 1) return setWave({ amp: 0, phase: 0 })
      setWave({ amp: p < 0 ? 0 : Math.sin(Math.PI * p), phase: p * profile.swings * 2 * Math.PI })
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [profile])
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

/** Плавный переход чисел к новым значениям: при смене target они не прыгают, а перетекают за 0.8 секунды. */
export function useMorph(target: number[]): number[] {
  const [current, setCurrent] = useState(target)
  const latest = useRef(target)
  const key = target.join(',')

  useEffect(() => {
    const from = latest.current
    const to = key.split(',').map(Number)
    const controls = animate(0, 1, {
      duration: 0.8,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: (p) => {
        const next = to.map((v, i) => (from[i] ?? 0) + (v - (from[i] ?? 0)) * p)
        latest.current = next
        setCurrent(next)
      },
    })
    return () => controls.stop()
  }, [key])

  return current
}
