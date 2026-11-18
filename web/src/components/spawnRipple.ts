import type { PointerEvent } from 'react'

const LIFETIME_MS = 3400

/** Рябь от касания: мягкие кольца расходятся по всему экрану и идут дальше по открывшейся шторке.
 *  Убираем по таймеру: animationend не придёт, если анимацию отключили. */
export function spawnRipple(e: PointerEvent<HTMLElement>) {
  for (const cls of ['ripple', 'ripple second']) {
    const ring = document.createElement('span')
    ring.className = cls
    ring.style.setProperty('--x', `${e.clientX}px`)
    ring.style.setProperty('--y', `${e.clientY}px`)
    document.body.append(ring)
    setTimeout(() => ring.remove(), LIFETIME_MS)
  }
}
