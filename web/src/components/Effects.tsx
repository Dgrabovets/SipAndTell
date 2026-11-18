import { motion } from 'motion/react'
import { useState, type CSSProperties } from 'react'
import { CUPS, EFFECTS, TEA_COLOR, YOU_COLOR, type Cup } from '../data/cups'
import { useGrow } from './mood/geometry'

const colorOf = (cup: Cup, name: string) => (name === 'Ты' ? YOU_COLOR : (cup.friends.find((f) => f.name === name)?.color ?? 'var(--hint)'))

/** Средняя сила эффекта по всем, кто отметил его для этой чашки. */
const averageOf = (cup: Cup) => EFFECTS.map((_, a) => Object.values(cup.effects).reduce((sum, v) => sum + v[a], 0) / Object.keys(cup.effects).length)

function Legend({ cup }: { cup: Cup }) {
  return (
    <ul className="legend">
      {Object.keys(cup.effects).map((name) => (
        <li key={name} style={{ '--c': colorOf(cup, name) } as CSSProperties}>
          <i />
          <span>{name}</span>
        </li>
      ))}
    </ul>
  )
}

/** Вариант 1, блок во вкладке «Моё чаепитие»: на каждый эффект своя шкала, на ней точки каждого человека его цветом. */
export function EffectDots({ cup }: { cup: Cup }) {
  const people = Object.entries(cup.effects)

  return (
    <section className="effects" aria-label="Как подействовал чай">
      <h3 className="block-title">Как подействовал</h3>
      {EFFECTS.map((label, a) => (
        <div className="effect-row" key={label}>
          <span>{label}</span>
          <div className="effect-lane">
            {people.map(([name, values], i) => {
              const ties = people.filter(([, v]) => v[a] === values[a])
              const dy = (ties.findIndex(([n]) => n === name) - (ties.length - 1) / 2) * 7
              return <motion.i key={name} style={{ '--c': colorOf(cup, name), '--dy': `${dy}px` } as CSSProperties} initial={{ left: '0%' }} animate={{ left: `${values[a] * 100}%` }} transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.2 + a * 0.06 + i * 0.05 }} />
            })}
          </div>
        </div>
      ))}
      <Legend cup={cup} />
    </section>
  )
}

/** Короткие подписи для радара, чтобы они помещались у краёв. */
const SHORT = ['Бодрит', 'Успокаивает', 'Согревает', 'Внимание', 'Сон']
const N = EFFECTS.length
const R = 62

/** Точка оси i из пяти, нулевая сверху, дальше по часовой. */
function pt(i: number, radius: number): [number, number] {
  const angle = ((-90 + (i * 360) / N) * Math.PI) / 180
  return [radius * Math.cos(angle), radius * Math.sin(angle)]
}

const poly = (list: [number, number][]) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

/** Вариант 2, отдельная вкладка «Эффект»: радар из пяти осей, у каждого человека свой многоугольник его цветом. */
export function EffectRadar({ cup }: { cup: Cup }) {
  const grow = useGrow(0.1)

  return (
    <div className="details effect-tab">
      <svg className="mood-svg" viewBox="-130 -92 260 184" role="img" aria-label="Эффект чая у каждого, радар из пяти осей">
        {[1 / 3, 2 / 3, 1].map((k) => (
          <polygon key={k} className="mood-grid" points={poly(EFFECTS.map((_, i) => pt(i, R * k)))} />
        ))}
        {EFFECTS.map((_, i) => (
          <line key={i} className="mood-grid" x1="0" y1="0" x2={pt(i, R)[0]} y2={pt(i, R)[1]} />
        ))}
        {Object.entries(cup.effects).map(([name, values]) => {
          const color = colorOf(cup, name)
          return <polygon key={name} points={poly(values.map((v, i) => pt(i, R * Math.max(v, 0.03) * grow)))} fill={color} fillOpacity="0.14" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
        })}
        {SHORT.map((label, i) => {
          const [x, y] = pt(i, R + 12)
          return (
            <text key={label} className="mood-label" x={x} y={y + 4} textAnchor={Math.abs(x) < 0.5 ? 'middle' : x > 0 ? 'start' : 'end'}>
              {label}
            </text>
          )
        })}
      </svg>
      <Legend cup={cup} />
      <p className="mood-caption">Чей многоугольник шире в какую сторону, тот сильнее почувствовал этот эффект</p>
    </div>
  )
}

/** Вариант 3, блок во вкладке «Моё чаепитие»: выбери другой чай и сравни средний эффект по каждой оси. */
export function EffectVersus({ cup }: { cup: Cup }) {
  const others = CUPS.filter((c) => c.id !== cup.id)
  const [pickedId, setPickedId] = useState<number | null>(null)
  const other = others.find((c) => c.id === pickedId) ?? others[0]
  const mine = averageOf(cup)
  const theirs = averageOf(other)

  return (
    <section className="effects" aria-label="Сравнение эффекта с другим чаем">
      <h3 className="block-title">Сравнить эффект с другим чаем</h3>
      <div className="versus-pick" role="group" aria-label="Другой чай">
        {others.map((c) => (
          <button key={c.id} aria-pressed={c.id === other.id} onClick={() => setPickedId(c.id)}>
            {c.name}
          </button>
        ))}
      </div>
      <p className="versus-names">
        <span style={{ '--c': TEA_COLOR[cup.type] } as CSSProperties}>{cup.name}</span>
        <span style={{ '--c': TEA_COLOR[other.type] } as CSSProperties}>{other.name}</span>
      </p>
      {EFFECTS.map((label, a) => (
        <div className="versus-row" key={label}>
          <span>{label}</span>
          <div>
            <motion.i style={{ background: TEA_COLOR[cup.type] }} initial={{ width: 0 }} animate={{ width: `${mine[a] * 100}%` }} transition={{ duration: 0.6, delay: a * 0.05 }} />
            <motion.i style={{ background: TEA_COLOR[other.type] }} initial={{ width: 0 }} animate={{ width: `${theirs[a] * 100}%` }} transition={{ duration: 0.6, delay: 0.1 + a * 0.05 }} />
          </div>
        </div>
      ))}
      <p className="mood-caption">Среднее по всем, кто отметил эффект</p>
    </section>
  )
}
