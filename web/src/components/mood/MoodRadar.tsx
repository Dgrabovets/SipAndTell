import { useId } from 'react'
import { AXES, topMoods, type Mood } from '../../data/moods'
import { useVariants } from '../../variants/useVariants'
import { anchorOf, pointsOf, smoothPath, useClock, useGrow, vertex } from './geometry'

const R = 68
const WAVE = 0.07

/** Лепесток вершины i длиной length: капля от центра к вершине. */
function petalPath(i: number, length: number): string {
  const [tx, ty] = vertex(i, length)
  const [mx, my] = vertex(i, length * 0.55)
  const [px, py] = [-(ty / length), tx / length]
  const w = R * 0.26
  return `M0 0 Q${(mx + px * w).toFixed(1)} ${(my + py * w).toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)} Q${(mx - px * w).toFixed(1)} ${(my - py * w).toFixed(1)} 0 0Z`
}

/** Радар настроения. Рисовка (многоугольник, плавная капля, лепестки, лучи) и движение (дыхание, только рост, волна, искра)
 *  выбираются в панели «Вид». Радиус каждой вершины считается один раз, а рисовка только разные способы его показать. */
export function MoodRadar({ mood }: { mood: Mood }) {
  const { variants } = useVariants()
  const draw = variants.radarDraw
  const move = variants.radarMove
  const t = useGrow()
  const clock = useClock(move === 'wave')
  const gradient = useId()
  const radii = mood.map((v, i) => R * Math.max(v, 0.04) * t * (move === 'wave' ? 1 + WAVE * Math.sin(clock * 2.2 + (i * Math.PI) / 4) : 1))
  const tips = radii.map((r, i) => vertex(i, r))
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

      <g className={move === 'breathe' ? 'breathe' : undefined}>
        {draw === 'polygon' && <polygon className="radar-shape" points={pointsOf(tips)} />}
        {draw === 'smooth' && <path className="radar-shape" d={smoothPath(tips)} fill={`url(#${gradient})`} />}
        {draw === 'petals' &&
          radii.map((r, i) =>
            mood[i] > 0.05 ? <path key={i} d={petalPath(i, r)} fill={AXES[i].color} fillOpacity="0.5" stroke={AXES[i].color} strokeWidth="1.2" strokeLinejoin="round" /> : null,
          )}
        {draw === 'rays' &&
          radii.map((r, i) => (mood[i] > 0.05 ? <line key={i} x1={vertex(i, 8)[0]} y1={vertex(i, 8)[1]} x2={vertex(i, Math.max(r, 9))[0]} y2={vertex(i, Math.max(r, 9))[1]} stroke={AXES[i].color} strokeWidth="9" strokeLinecap="round" strokeOpacity="0.85" /> : null))}
        {draw !== 'petals' && draw !== 'rays' && tips.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={mood[i] > 0.05 ? 3.5 : 0} fill={AXES[i].color} />)}
        {move === 'spark' && <polygon className="radar-spark" pathLength={100} points={pointsOf(tips)} />}
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
