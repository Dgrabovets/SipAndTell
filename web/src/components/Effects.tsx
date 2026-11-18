import { motion } from 'motion/react'
import { useState, type CSSProperties } from 'react'
import { CUPS, EFFECTS_COUNT, TEA_COLOR, YOU_COLOR, type Cup } from '../data/cups'
import { useVariants } from '../variants/useVariants'
import { EFFECT_WORDS, type EffectWords } from './effectWords'
import { useGrow, useMorph } from './mood/geometry'

/** Одна линия на графике: чьи это значения, каким цветом и как подписать. */
interface Series {
  name: string
  color: string
  values: number[]
}

type Mode = 'mine' | 'friends' | 'versus'

const MODES: { id: Mode; label: string }[] = [
  { id: 'mine', label: 'Моя оценка' },
  { id: 'friends', label: 'У друзей' },
  { id: 'versus', label: 'С другим чаем' },
]

const FRIENDS_COLOR = '#6fb7e0'
/** Цвет чая на тёмном фоне осветлён, иначе тёмные чаи (пуэр) почти не видны на графике. */
const bright = (tea: string) => `color-mix(in srgb, ${tea} 55%, white)`
const N = EFFECTS_COUNT
const R = 62

/** Точка оси i, нулевая сверху, дальше по часовой. */
function pt(i: number, radius: number): [number, number] {
  const angle = ((-90 + (i * 360) / N) * Math.PI) / 180
  return [radius * Math.cos(angle), radius * Math.sin(angle)]
}

const poly = (list: [number, number][]) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
const anchor = (x: number) => (Math.abs(x) < 0.5 ? 'middle' : x > 0 ? 'start' : 'end')

/** Сетка радара и подписи осей: общая для обоих радарных видов. */
function RadarFrame({ words, children }: { words: EffectWords; children: React.ReactNode }) {
  return (
    <svg className="mood-svg" viewBox="-150 -92 300 184" role="img" aria-label="Эффект чая, радар из семи осей">
      {[1 / 3, 2 / 3, 1].map((k) => (
        <polygon key={k} className="mood-grid" points={poly(words.short.map((_, i) => pt(i, R * k)))} />
      ))}
      {words.short.map((_, i) => (
        <line key={i} className="mood-grid" x1="0" y1="0" x2={pt(i, R)[0]} y2={pt(i, R)[1]} />
      ))}
      {children}
      {words.short.map((label, i) => {
        const [x, y] = pt(i, R + 11)
        return (
          <text key={label} className="mood-label" x={x} y={y + 4} textAnchor={anchor(x)}>
            {label}
          </text>
        )
      })}
    </svg>
  )
}

const shape = (values: number[], k: number) => poly(values.map((v, i) => pt(i, R * Math.max(v, 0.03) * k)))

/** Радар, фигура вырастает из центра при каждой смене режима или чая. */
function RadarGrow({ series, words }: ViewProps) {
  const grow = useGrow(0.05)
  return (
    <RadarFrame words={words}>
      {series.map((s) => (
        <polygon key={s.name} points={shape(s.values, grow)} fill={s.color} fillOpacity="0.16" stroke={s.color} strokeWidth="1.8" strokeLinejoin="round" />
      ))}
    </RadarFrame>
  )
}

/** Радар, фигура перетекает: при смене режима каждая вершина плавно едет к новому значению, вторая фигура появляется и исчезает. */
function RadarMorph({ series, words }: ViewProps) {
  const flat = useMorph([...Array.from({ length: N }, (_, i) => series[0].values[i]), ...Array.from({ length: N }, (_, i) => series[1]?.values[i] ?? 0)])
  return (
    <RadarFrame words={words}>
      {series.map((s, k) => (
        <polygon key={k} points={shape(flat.slice(k * N, (k + 1) * N), 1)} fill={s.color} fillOpacity="0.16" stroke={s.color} strokeWidth="1.8" strokeLinejoin="round" />
      ))}
    </RadarFrame>
  )
}

/** Полоски: у каждого эффекта своя, длина пружинит к значению, справа число из десяти. Две линии идут парой. */
function Bars({ series, words }: ViewProps) {
  return (
    <div className="eff-bars">
      {words.full.map((label, a) => (
        <div className="eff-bar" key={label}>
          <span>{label}</span>
          <div>
            {series.map((s) => (
              <motion.i key={s.name} style={{ background: s.color }} initial={{ width: 0 }} animate={{ width: `${s.values[a] * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 16, delay: a * 0.05 }} />
            ))}
          </div>
          <b>{Math.round(series[0].values[a] * 10)}</b>
        </div>
      ))}
    </div>
  )
}

/** Пузыри по кругу: размер каждого пружинит к значению, у вторых значений контур позади. */
function Bubbles({ series, words }: ViewProps) {
  const ring = 52
  return (
    <svg className="mood-svg" viewBox="-150 -100 300 200" role="img" aria-label="Эффект чая пузырями">
      {words.short.map((label, i) => {
        const [x, y] = pt(i, ring)
        const [lx, ly] = pt(i, ring + 36)
        return (
          <g key={label}>
            {series.map((s, k) => (
              <motion.circle key={s.name} cx={x} cy={y} fill={k === 0 ? s.color : 'none'} fillOpacity={0.45} stroke={s.color} strokeWidth={k === 0 ? 0 : 2} initial={{ r: 0 }} animate={{ r: 4 + 22 * s.values[i] }} transition={{ type: 'spring', stiffness: 170, damping: 9, delay: i * 0.06 }} />
            ))}
            <text className="mood-label" x={lx} y={ly + 4} textAnchor={anchor(lx)}>
              {label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

interface ViewProps {
  series: Series[]
  words: EffectWords
}

const VIEWS = { grow: RadarGrow, morph: RadarMorph, bars: Bars, bubbles: Bubbles }

const averageOf = (list: number[][]) => Array.from({ length: N }, (_, a) => list.reduce((sum, v) => sum + v[a], 0) / list.length)

/** Вкладка «Эффект». Три режима: твоя оценка, среднее по друзьям и сравнение твоей оценки с другим чаем.
 *  Как рисуются значения и как называются эффекты, выбирается в панели «Вид». */
export function EffectTab({ cup }: { cup: Cup }) {
  const { variants } = useVariants()
  const words = EFFECT_WORDS[variants.words]
  const View = VIEWS[variants.effectView as keyof typeof VIEWS]
  const [mode, setMode] = useState<Mode>('mine')
  const others = CUPS.filter((c) => c.id !== cup.id)
  const [pickedId, setPickedId] = useState<number | null>(null)
  const other = others.find((c) => c.id === pickedId) ?? others[0]
  const friendNames = Object.keys(cup.effects).filter((n) => n !== 'Ты')

  const mine: Series = { name: 'Ты', color: YOU_COLOR, values: cup.effects['Ты'] }
  const series: Series[] =
    mode === 'mine'
      ? [mine]
      : mode === 'friends'
        ? [{ name: 'Друзья', color: FRIENDS_COLOR, values: averageOf(friendNames.map((n) => cup.effects[n])) }]
        : [
            { name: cup.name, color: bright(TEA_COLOR[cup.type]), values: mine.values },
            { name: other.name, color: bright(TEA_COLOR[other.type]), values: other.effects['Ты'] },
          ]

  const caption =
    mode === 'mine' ? 'Так чай подействовал на тебя.' : mode === 'friends' ? `Так он в среднем подействовал на друзей: ${friendNames.join(', ')}.` : 'Твои ощущения от двух чаёв рядом.'

  return (
    <div className="details effect-tab">
      <div className="seg" role="tablist" aria-label="Чьи ощущения показать">
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

      <View key={`${variants.effectView}-${variants.effectView === 'grow' ? mode + other.id : 'keep'}`} series={series} words={words} />

      {series.length > 1 && (
        <p className="versus-names">
          {series.map((s) => (
            <span key={s.name} style={{ '--c': s.color } as CSSProperties}>
              {s.name}
            </span>
          ))}
        </p>
      )}
      <p className="mood-caption">{caption}</p>
    </div>
  )
}
