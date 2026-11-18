import { useId } from 'react'
import { AXES, topMoods, type Mood } from '../../data/moods'
import { anchorOf, pointsOf, smoothPath, useGrow, useSettlingWave, vertex } from './geometry'

const R = 68
/** Насколько вершины качаются в разгар волны: доля радиуса. */
const WAVE = 0.12

/** Радар настроения: плавная капля с градиентом цвета главного настроения. После роста по вершинам
 *  несколько раз пробегает волна и затихает, фигура остаётся ровно на значениях. */
export function MoodRadar({ mood }: { mood: Mood }) {
  const grow = useGrow()
  const wave = useSettlingWave()
  const gradient = useId()
  const tips = mood.map((v, i) => vertex(i, R * Math.max(v, 0.04) * grow * (1 + WAVE * wave.amp * Math.sin(wave.phase + (i * Math.PI) / 4))))
  const lead = AXES[topMoods(mood)[0]].color

  return (
    <svg className="mood-svg" viewBox="-165 -108 330 216" role="img" aria-label="Настроение, радар из восьми осей">
      <defs>
        <radialGradient id={gradient} r="1">
          <stop offset="0" stopColor={lead} stopOpacity="0.05" />
          <stop offset="1" stopColor={lead} stopOpacity="0.6" />
        </radialGradient>
      </defs>
      {[1 / 3, 2 / 3, 1].map((k) => (
        <polygon key={k} className="mood-grid" points={pointsOf(AXES.map((_, i) => vertex(i, R * k)))} />
      ))}
      {AXES.map((_, i) => (
        <line key={i} className="mood-grid" x1="0" y1="0" x2={vertex(i, R)[0]} y2={vertex(i, R)[1]} />
      ))}

      <path className="radar-shape" d={smoothPath(tips)} fill={`url(#${gradient})`} />
      {tips.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={mood[i] > 0.05 ? 3.5 : 0} fill={AXES[i].color} />
      ))}

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
