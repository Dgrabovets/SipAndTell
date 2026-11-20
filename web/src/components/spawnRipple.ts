import type { PointerEvent } from 'react'

const LIFETIME_MS = 3600
const SHEET_DELAY_MS = 380

/** Где по горизонтали нажали на карточку: от этой точки волна войдёт в шторку. */
let pressX: number | null = null

function ring(host: HTMLElement, x: number, y: number, reach: number, delay: number, second: boolean) {
  const el = document.createElement('span')
  el.className = second ? 'ripple second' : 'ripple'
  el.style.setProperty('--x', `${x}px`)
  el.style.setProperty('--y', `${y}px`)
  el.style.setProperty('--to', String(reach))
  el.style.animationDelay = `${delay + (second ? 450 : 0)}ms`
  host.append(el)
  // Убираем по таймеру: animationend не придёт, если анимацию отключили.
  setTimeout(() => el.remove(), LIFETIME_MS + delay)
}

/** Рябь на карточке: два кольца от точки касания, карточка обрезает их по краю. */
export function spawnRipple(e: PointerEvent<HTMLElement>) {
  const box = e.currentTarget.getBoundingClientRect()
  pressX = e.clientX
  ring(e.currentTarget, e.clientX - box.left, e.clientY - box.top, 6, 0, false)
  ring(e.currentTarget, e.clientX - box.left, e.clientY - box.top, 6, 0, true)
}

/** Продолжение ряби в шторке: волна выходит у верхней или нижней кромки в той же точке по горизонтали, как будто перетекла из карточки. */
export function flowRippleInto(sheet: HTMLElement, from: 'top' | 'bottom' = 'top') {
  if (pressX === null) return
  const box = sheet.getBoundingClientRect()
  const x = pressX - box.left
  const y = from === 'top' ? 0 : box.height
  ring(sheet, x, y, 9, SHEET_DELAY_MS, false)
  ring(sheet, x, y, 9, SHEET_DELAY_MS, true)
  pressX = null
}
