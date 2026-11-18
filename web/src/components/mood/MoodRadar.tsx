import { AXES, type Mood } from '../../data/moods'
import { anchorOf, pointsOf, useGrow, vertex } from './geometry'

const R = 68

/** Радар: шесть вершин, закрашенная фигура показывает сочетание настроений и «дышит». */
export function MoodRadar({ mood }: { mood: Mood }) {
  const t = useGrow()
  const shape = mood.map((v, i) => vertex(i, R * Math.max(v, 0.04) * t))

  return (
    <svg className="mood-svg" viewBox="-165 -108 330 216" role="img" aria-label="Настроение, радар из шести осей">
      {[1 / 3, 2 / 3, 1].map((k) => (
        <polygon key={k} className="mood-grid" points={pointsOf(AXES.map((_, i) => vertex(i, R * k)))} />
      ))}
      {AXES.map((_, i) => (
        <line key={i} className="mood-grid" x1="0" y1="0" x2={vertex(i, R)[0]} y2={vertex(i, R)[1]} />
      ))}
      <g className="breathe">
        <polygon className="radar-shape" points={pointsOf(shape)} />
        {shape.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={mood[i] > 0.05 ? 3.5 : 0} fill={AXES[i].color} />
        ))}
      </g>
      {AXES.map((axis, i) => {
        const [x, y] = vertex(i, R + 14)
        return (
          <text key={axis.label} className={mood[i] >= 0.5 ? 'mood-label strong' : 'mood-label'} x={x} y={y + 4} textAnchor={anchorOf(i)}>
            {axis.label}
          </text>
        )
      })}
    </svg>
  )
}
