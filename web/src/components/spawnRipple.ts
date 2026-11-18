import type { PointerEvent } from 'react'

/** Рябь от касания: два кольца, элемент сам убирается после анимации. */
export function spawnRipple(e: PointerEvent<HTMLElement>) {
  const card = e.currentTarget
  const box = card.getBoundingClientRect()
  for (const cls of ['ripple', 'ripple second']) {
    const ring = document.createElement('span')
    ring.className = cls
    ring.style.setProperty('--x', `${e.clientX - box.left}px`)
    ring.style.setProperty('--y', `${e.clientY - box.top}px`)
    ring.addEventListener('animationend', () => ring.remove(), { once: true })
    card.append(ring)
  }
}
