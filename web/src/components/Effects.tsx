import { motion } from 'motion/react'
import { useState, type CSSProperties } from 'react'
import { EFFECTS_COUNT, EFFECT_LABELS, SAME_TYPE, TEA_CHART, type Cup } from '../data/cups'
import { useCups } from '../data/store'

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

/** Цвета режима «Ты и друзья»: твой янтарный, средний по друзьям сиреневый. */
const YOU_BAR = '#f2a33a'
const FRIENDS_BAR = '#b78cf5'

/** Число из десяти с одной десятой: средние значения не должны округляться до целого. */
const tenths = (v: number) => (v * 10).toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

const averageOf = (list: number[][]) => Array.from({ length: EFFECTS_COUNT }, (_, a) => list.reduce((sum, v) => sum + v[a], 0) / list.length)

/** Полоски по одной на эффект, между эффектами тонкая линия. Длина пружинит к значению, справа число из десяти. */
function Bars({ series }: { series: Series[] }) {
  return (
    <div className="eff-bars">
      {EFFECT_LABELS.map((label, a) => (
        <div className="eff-bar" key={label}>
          <span>{label}</span>
          <div className="eff-lines">
            {series.map((s) => (
              <span className="eff-line" key={s.name}>
                <span className="eff-track">
                  <motion.i style={{ '--c': s.color } as CSSProperties} initial={{ width: 0 }} animate={{ width: `${s.values[a] * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 16, delay: a * 0.05 }} />
                </span>
                <em>{tenths(s.values[a])}</em>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/** Вкладка «Эффект». Два режима: твоя оценка рядом со средней по друзьям и сравнение твоей оценки с другим чаем.
 *   */
export function EffectTab({ cup }: { cup: Cup }) {
  const [asked, setMode] = useState<Mode>('both')
  const others = useCups().filter((c) => c.id !== cup.id)
  const [pickedId, setPickedId] = useState<number | null>(null)
  const other = others.find((c) => c.id === pickedId) ?? others[0]
  const canCompare = others.length > 0
  const friendNames = Object.keys(cup.effects).filter((n) => n !== 'Ты')
  const mode: Mode = asked === 'versus' && canCompare ? 'versus' : 'both'
  const mine = cup.effects['Ты']
  const hasFriends = friendNames.length > 0
  const sameTea = cup.type === other.type

  const series: Series[] =
    mode === 'both'
      ? [{ name: 'Ты', color: YOU_BAR, values: mine }, ...(hasFriends ? [{ name: 'Друзья', color: FRIENDS_BAR, values: averageOf(friendNames.map((n) => cup.effects[n])) }] : [])]
      : [
          { name: cup.name, color: TEA_CHART[cup.type], values: mine },
          { name: other.name, color: sameTea ? SAME_TYPE : TEA_CHART[other.type], values: other.effects['Ты'] },
        ]

  const caption = mode === 'both' ? (hasFriends ? `Друзья, которых посчитали: ${friendNames.join(', ')}.` : 'Друзья пока не отметили, как подействовал этот чай.') : 'Твои ощущения от двух чаёв рядом.'

  return (
    <div className="details effect-tab">
      <div className="seg" role="tablist" aria-label="Что показать">
        {MODES.filter((m) => m.id === 'both' || canCompare).map((m) => (
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
      <Bars series={series} />
      <p className="mood-caption">{caption}</p>
    </div>
  )
}
