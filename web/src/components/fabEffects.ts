const LIFETIME_MS = 3600

/** Сколько чашек пара и куда их сносит: смещение по горизонтали и задержка. */
const PUFFS = [
  { dx: -22, delay: 0 },
  { dx: 14, delay: 120 },
  { dx: -6, delay: 260 },
  { dx: 26, delay: 380 },
  { dx: -30, delay: 520 },
]

function place(className: string, x: number, y: number, vars: Record<string, string> = {}) {
  const el = document.createElement('span')
  el.className = className
  el.style.setProperty('--x', `${x}px`)
  el.style.setProperty('--y', `${y}px`)
  for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v)
  document.body.append(el)
  // Убираем по таймеру: animationend не придёт, если анимацию отключили.
  setTimeout(() => el.remove(), LIFETIME_MS)
}

/** Эффект при нажатии на «Выпил»: волны по экрану или пар от кнопки. Свечение живёт в самой кнопке. */
export function fabEffect(kind: string, x: number, y: number) {
  if (kind === 'ripple') {
    place('screen-ripple', x, y)
    place('screen-ripple second', x, y)
  }
  if (kind === 'steam') {
    for (const puff of PUFFS) place('steam', x, y, { '--dx': `${puff.dx}px`, animationDelay: `${puff.delay}ms` })
  }
}
