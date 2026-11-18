import { motion } from 'motion/react'
import { useState, type CSSProperties } from 'react'
import { CUPS, EFFECTS_COUNT, type Cup } from '../data/cups'
import { useVariants } from '../variants/useVariants'

/** Названия семи осей, порядок как в данных чашки. Как в дневнике, прошедшим временем от первого лица. */
const LABELS = ['Взбодрил', 'Успокоил', 'Согрел', 'Собрал мысли', 'Разморило', 'Поднял настроение', 'Взвинтил']

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

/** Пары цветов для режима «Ты и друзья». Первый цвет твой, второй средний по друзьям. */
const PAIRS: Record<string, [string, string]> = {
  amberLilac: ['#f2a33a', '#b78cf5'],
  coralTeal: ['#ff7a6b', '#4fd1c5'],
  goldPink: ['#f5c542', '#f06fa8'],
}

/** Яркие цвета типов чая для графика: на тёмном фоне они должны различаться с первого взгляда. */
const TEA_CHART: Record<string, string> = {
  Улун: '#f2a33a',
  Зелёный: '#7ed957',
  Пуэр: '#d4623f',
  Чёрный: '#ff5a8a',
  Белый: '#efe3b8',
}

/** Если сравнивают два чая одного типа, второму достаётся бирюзовый. */
const SAME_TYPE = '#3fe0cf'

/** Число из десяти с одной десятой: средние значения не должны округляться до целого. */
const tenths = (v: number) => (v * 10).toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

const averageOf = (list: number[][]) => Array.from({ length: EFFECTS_COUNT }, (_, a) => list.reduce((sum, v) => sum + v[a], 0) / list.length)

/** Полоски по одной на эффект, между эффектами тонкая линия. Длина пружинит к значению, справа число из десяти. */
function Bars({ series }: { series: Series[] }) {
  return (
    <div className="eff-bars">
      {LABELS.map((label, a) => (
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
 *  Пара цветов для «Ты и друзья» выбирается в панели «Вид». */
export function EffectTab({ cup }: { cup: Cup }) {
  const { variants } = useVariants()
  const [mode, setMode] = useState<Mode>('both')
  const others = CUPS.filter((c) => c.id !== cup.id)
  const [pickedId, setPickedId] = useState<number | null>(null)
  const other = others.find((c) => c.id === pickedId) ?? others[0]
  const friendNames = Object.keys(cup.effects).filter((n) => n !== 'Ты')
  const mine = cup.effects['Ты']
  const pair = PAIRS[variants.effectPair]
  const sameTea = cup.type === other.type

  const series: Series[] =
    mode === 'both'
      ? [
          { name: 'Ты', color: pair[0], values: mine },
          { name: 'Друзья', color: pair[1], values: averageOf(friendNames.map((n) => cup.effects[n])) },
        ]
      : [
          { name: cup.name, color: TEA_CHART[cup.type], values: mine },
          { name: other.name, color: sameTea ? SAME_TYPE : TEA_CHART[other.type], values: other.effects['Ты'] },
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
      <Bars series={series} />
      <p className="mood-caption">{caption}</p>
    </div>
  )
}
