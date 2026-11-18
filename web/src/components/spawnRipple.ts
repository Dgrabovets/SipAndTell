import type { PointerEvent } from 'react'

const LIFETIME_MS = 2200

/** Рябь от касания: два кольца. Убираем по таймеру: animationend не придёт, если анимацию отключили. */
export function spawnRipple(e: PointerEvent<HTMLElement>) {
  const card = e.currentTarget
  const box = card.getBoundingClientRect()
  for (const cls of ['ripple', 'ripple second']) {
    const ring = document.createElement('span')
    ring.className = cls
    ring.style.setProperty('--x', `${e.clientX - box.left}px`)
    ring.style.setProperty('--y', `${e.clientY - box.top}px`)
    card.append(ring)
    setTimeout(() => ring.remove(), LIFETIME_MS)
  }
}
