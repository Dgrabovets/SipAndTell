import { motion } from 'motion/react'
import { useState, type CSSProperties } from 'react'
import { CUPS, EFFECTS_COUNT, TEA_COLOR, YOU_COLOR, type Cup } from '../data/cups'
import { useVariants } from '../variants/useVariants'

/** Названия семи осей, порядок как в данных чашки. Как в дневнике, прошедшим временем от первого лица. */
const LABELS = ['Взбодрил', 'Успокоил', 'Согрел', 'Собрал мысли', 'Разморило', 'Поднял настроение', 'Взвинтил']

/** Одна линия на графике: чьи это значения, каким цветом и как подписать. */
interface Series {
  name: string
  color: string
  values: number[]
  /** Рисовать контуром, а не заливкой: отличается формой, а не цветом. */
  outline?: boolean
}

type Mode = 'both' | 'versus'

const MODES: { id: Mode; label: string }[] = [
  { id: 'both', label: 'Ты и друзья' },
  { id: 'versus', label: 'С другим чаем' },
]

const SKY = '#6fb7e0'
const MINT = '#7fd1b9'
const CREAM = '#f3ebe2'
/** Цвет чая на тёмном фоне осветлён, иначе тёмные чаи (пуэр) почти не видны. */
const bright = (tea: string) => `color-mix(in srgb, ${tea} 55%, white)`

const averageOf = (list: number[][]) => Array.from({ length: EFFECTS_COUNT }, (_, a) => list.reduce((sum, v) => sum + v[a], 0) / list.length)

type Numbers = 'plain' | 'tip' | 'delta'

/** Полоски по одной на эффект: длина пружинит к значению. Числа: справа у каждой полоски, на кончике полоски
 *  или только разница между двумя линиями. */
function Bars({ series, numbers }: { series: Series[]; numbers: Numbers }) {
  return (
    <div className="eff-bars" data-nums={numbers}>
      {LABELS.map((label, a) => {
        const diff = Math.round(series[0].values[a] * 10) - Math.round(series[1].values[a] * 10)
        return (
          <div className="eff-bar" key={label}>
            <span>{label}</span>
            <div className="eff-lines">
              {series.map((s) => {
                const pct = `${s.values[a] * 100}%`
                const spring = { type: 'spring' as const, stiffness: 120, damping: 16, delay: a * 0.05 }
                return (
                  <span className="eff-line" key={s.name}>
                    <span className="eff-track">
                      <motion.i className={s.outline ? 'outline' : undefined} style={{ '--c': s.color } as CSSProperties} initial={{ width: 0 }} animate={{ width: pct }} transition={spring} />
                      {numbers === 'tip' && (
                        <motion.em className="tip" style={{ color: s.color }} initial={{ left: 0 }} animate={{ left: pct }} transition={spring}>
                          {Math.round(s.values[a] * 10)}
                        </motion.em>
                      )}
                    </span>
                    {numbers === 'plain' && <em>{Math.round(s.values[a] * 10)}</em>}
                  </span>
                )
              })}
            </div>
            {numbers === 'delta' && <b className={diff > 0 ? 'up' : diff < 0 ? 'down' : ''}>{diff > 0 ? `+${diff}` : diff < 0 ? `−${Math.abs(diff)}` : '0'}</b>}
          </div>
        )
      })}
    </div>
  )
}

/** Цвета двух линий. pair: янтарный и голубой всегда, поэтому два одинаковых чая не сливаются.
 *  tea: цвета самих чаёв, а при одинаковом типе второй берёт мятный. outline: первая линия заливкой, вторая контуром. */
function colorsOf(scheme: string, mode: Mode, a: Cup, b: Cup): { colors: [string, string]; outline: boolean } {
  if (scheme === 'tea' && mode === 'versus') return { colors: [bright(TEA_COLOR[a.type]), a.type === b.type ? MINT : bright(TEA_COLOR[b.type])], outline: false }
  if (scheme === 'outline') return { colors: [YOU_COLOR, CREAM], outline: true }
  return { colors: [YOU_COLOR, SKY], outline: false }
}

/** Вкладка «Эффект». Два режима: твоя оценка рядом со средней по друзьям и сравнение твоей оценки с другим чаем.
 *  Цвета линий и подача чисел выбираются в панели «Вид». */
export function EffectTab({ cup }: { cup: Cup }) {
  const { variants } = useVariants()
  const [mode, setMode] = useState<Mode>('both')
  const others = CUPS.filter((c) => c.id !== cup.id)
  const [pickedId, setPickedId] = useState<number | null>(null)
  const other = others.find((c) => c.id === pickedId) ?? others[0]
  const friendNames = Object.keys(cup.effects).filter((n) => n !== 'Ты')
  const mine = cup.effects['Ты']
  const { colors, outline } = colorsOf(variants.effectColors, mode, cup, other)

  const series: Series[] =
    mode === 'both'
      ? [
          { name: 'Ты', color: colors[0], values: mine },
          { name: 'Друзья в среднем', color: colors[1], outline, values: averageOf(friendNames.map((n) => cup.effects[n])) },
        ]
      : [
          { name: cup.name, color: colors[0], values: mine },
          { name: other.name, color: colors[1], outline, values: other.effects['Ты'] },
        ]

  const base = mode === 'both' ? `Друзья, которых посчитали: ${friendNames.join(', ')}.` : 'Твои ощущения от двух чаёв рядом.'
  const caption = variants.effectNumbers === 'delta' ? `${base} Справа разница между первой и второй линией.` : base

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
      <Bars series={series} numbers={variants.effectNumbers as Numbers} />
      <p className="mood-caption">{caption}</p>
    </div>
  )
}
