import { motion } from 'motion/react'
import { useState, type CSSProperties } from 'react'
import { CUPS, EFFECTS_COUNT, TEA_COLOR, YOU_COLOR, type Cup } from '../data/cups'
import { useVariants } from '../variants/useVariants'
import { EFFECT_WORDS } from './effectWords'

/** Одна линия на графике: чьи это значения, каким цветом и как подписать. */
interface Series {
  name: string
  color: string
  values: number[]
}

type Mode = 'both' | 'versus'

const MODES: { id: Mode; label: string }[] = [
  { id: 'both', label: 'Ты и друзья' },
  { id: 'versus', label: 'С другим чаем' },
]

const FRIENDS_COLOR = '#6fb7e0'
/** Цвет чая на тёмном фоне осветлён, иначе тёмные чаи (пуэр) почти не видны. */
const bright = (tea: string) => `color-mix(in srgb, ${tea} 55%, white)`

const averageOf = (list: number[][]) => Array.from({ length: EFFECTS_COUNT }, (_, a) => list.reduce((sum, v) => sum + v[a], 0) / list.length)

/** Полоски по одной на эффект: длина пружинит к значению, справа числа из десяти. Две линии идут парой. */
function Bars({ series, labels }: { series: Series[]; labels: string[] }) {
  return (
    <div className="eff-bars">
      {labels.map((label, a) => (
        <div className="eff-bar" key={label}>
          <span>{label}</span>
          <div className="eff-lines">
            {series.map((s) => (
              <span className="eff-line" key={s.name}>
                <span className="eff-track">
                  <motion.i style={{ background: s.color }} initial={{ width: 0 }} animate={{ width: `${s.values[a] * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 16, delay: a * 0.05 }} />
                </span>
                <em style={{ color: s.color }}>{Math.round(s.values[a] * 10)}</em>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/** Вкладка «Эффект». Два режима: твоя оценка рядом со средней по друзьям и сравнение твоей оценки с другим чаем.
 *  Как называются эффекты, выбирается в панели «Вид». */
export function EffectTab({ cup }: { cup: Cup }) {
  const { variants } = useVariants()
  const labels = EFFECT_WORDS[variants.words].full
  const [mode, setMode] = useState<Mode>('both')
  const others = CUPS.filter((c) => c.id !== cup.id)
  const [pickedId, setPickedId] = useState<number | null>(null)
  const other = others.find((c) => c.id === pickedId) ?? others[0]
  const friendNames = Object.keys(cup.effects).filter((n) => n !== 'Ты')
  const mine = cup.effects['Ты']

  const series: Series[] =
    mode === 'both'
      ? [
          { name: 'Ты', color: YOU_COLOR, values: mine },
          { name: 'Друзья в среднем', color: FRIENDS_COLOR, values: averageOf(friendNames.map((n) => cup.effects[n])) },
        ]
      : [
          { name: cup.name, color: bright(TEA_COLOR[cup.type]), values: mine },
          { name: other.name, color: bright(TEA_COLOR[other.type]), values: other.effects['Ты'] },
        ]

  const caption = mode === 'both' ? `Друзья, которых посчитали: ${friendNames.join(', ')}.` : 'Твои ощущения от двух чаёв рядом.'

  return (
    <div className="details effect-tab">
      <div className="seg" role="tablist" aria-label="Что показать">
        {MODES.map((m) => (
          <button key={m.id} role="tab" aria-selected={mode === m.id} onClick={() => setMode(m.id)}>
            {mode === m.id && <motion.span className="seg-mark" layoutId="seg-mark" transition={{ type: 'spring', stiffness: 460, damping: 34 }} />}
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {mode === 'versus' && (
        <div className="versus-pick" role="group" aria-label="С каким чаем сравнить">
          {others.map((c) => (
            <button key={c.id} aria-pressed={c.id === other.id} onClick={() => setPickedId(c.id)}>
              {c.name}
            </button>
          ))}
        </div>
      )}

      <p className="versus-names">
        {series.map((s) => (
          <span key={s.name} style={{ '--c': s.color } as CSSProperties}>
            {s.name}
          </span>
        ))}
      </p>
      <Bars series={series} labels={labels} />
      <p className="mood-caption">{caption}</p>
    </div>
  )
}
