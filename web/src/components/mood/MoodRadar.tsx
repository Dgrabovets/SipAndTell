import { useId } from 'react'
import { AXES, topMoods, type Mood } from '../../data/moods'
import { WAVE_BY_MOOD, anchorOf, pointsOf, smoothPath, useGrow, useSettlingWave, vertex, waveAt } from './geometry'

const R = 68

/** Радар настроения: плавная капля с градиентом цвета главного настроения. После роста движение затихает
 *  на значениях, а его рисунок зависит от главного настроения. Вершины не выходят за внешнее кольцо. */
export function MoodRadar({ mood }: { mood: Mood }) {
  const grow = useGrow()
  const lead = topMoods(mood)[0]
  const profile = WAVE_BY_MOOD[lead]
  const wave = useSettlingWave(profile)
  const gradient = useId()
  const shape = profile.amp * wave.amp
  const turn = profile.kind === 'turn' ? shape * Math.sin(wave.phase) : 0
  const tips = mood.map((v, i) => {
    const base = R * Math.max(v, 0.04) * grow
    const shift = profile.kind === 'turn' ? 0 : shape * waveAt(profile.kind, wave.phase, i)
    return vertex(i + turn, Math.min(R, base * (1 + shift)))
  })
  const leadColor = AXES[lead].color

  return (
    <svg className="mood-svg" viewBox="-165 -108 330 216" role="img" aria-label="Настроение, радар из восьми осей">
      <defs>
        <radialGradient id={gradient} r="1">
          <stop offset="0" stopColor={leadColor} stopOpacity="0.05" />
          <stop offset="1" stopColor={leadColor} stopOpacity="0.6" />
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
