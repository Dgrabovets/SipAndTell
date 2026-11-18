import { AXES, type Mood } from '../../data/moods'
import { anchorOf, useGrow, vertex } from './geometry'

const INNER = 20
const MAX = 78

/** Сектор кольца для вершины i: от внутреннего радиуса до outer, шириной 56° с зазорами. */
function sector(i: number, outer: number): string {
  const a = vertex(i, INNER, -28)
  const b = vertex(i, INNER, 28)
  const c = vertex(i, outer, 28)
  const d = vertex(i, outer, -28)
  const f = (n: number) => n.toFixed(1)
  return `M${f(a[0])} ${f(a[1])} A${INNER} ${INNER} 0 0 1 ${f(b[0])} ${f(b[1])} L${f(c[0])} ${f(c[1])} A${f(outer)} ${f(outer)} 0 0 0 ${f(d[0])} ${f(d[1])} Z`
}

/** Колесо: шесть секторов, чем сильнее настроение, тем дальше сектор тянется от центра. */
export function MoodWheel({ mood }: { mood: Mood }) {
  const t = useGrow()

  return (
    <svg className="mood-svg" viewBox="-150 -108 300 216" role="img" aria-label="Настроение, колесо из шести секторов">
      <circle className="mood-grid" r={MAX} />
      <g className="breathe">
        {AXES.map((axis, i) => (
          <path key={axis.label} d={sector(i, INNER + (MAX - INNER) * Math.max(mood[i], 0.08) * t)} fill={axis.color} fillOpacity={0.3 + 0.65 * mood[i]} />
        ))}
      </g>
      {AXES.map((axis, i) => {
        const [x, y] = vertex(i, MAX + 16)
        return (
          <text key={axis.label} className={mood[i] >= 0.5 ? 'mood-label strong' : 'mood-label'} x={x} y={y + 4} textAnchor={anchorOf(i)}>
            {axis.label}
          </text>
        )
      })}
    </svg>
  )
}
