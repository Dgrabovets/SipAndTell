import { AXES, type Mood } from '../../data/moods'
import { pointsOf, useGrow } from './geometry'

const CELL = 30
const GAP = 1.78

/** Шестиугольник с плоским верхом: вершины на 0°, 60° и так далее. */
function cellPoints(radius: number): string {
  return pointsOf(
    [0, 1, 2, 3, 4, 5].map((k): [number, number] => {
      const a = (k * 60 * Math.PI) / 180
      return [radius * Math.cos(a), radius * Math.sin(a)]
    }),
  )
}

/** Цветок из семи сот: шесть настроений вокруг центра, сила настроения это яркость и размер соты. */
export function MoodFlower({ mood }: { mood: Mood }) {
  const t = useGrow()

  return (
    <svg className="mood-svg" viewBox="-150 -108 300 216" role="img" aria-label="Настроение, цветок из шести сот">
      <polygon className="mood-grid" points={cellPoints(CELL * 0.94)} />
      {AXES.map((axis, i) => {
        const angle = ((-90 + i * 60) * Math.PI) / 180
        const cx = CELL * GAP * Math.cos(angle)
        const cy = CELL * GAP * Math.sin(angle)
        const v = mood[i]
        const scale = 0.86 + 0.14 * v * t
        return (
          <g key={axis.label} transform={`translate(${cx.toFixed(1)} ${cy.toFixed(1)})`}>
            <g className={v >= 0.7 ? 'cell pulse' : 'cell'} style={{ transform: `scale(${scale})` }}>
              <polygon points={cellPoints(CELL * 0.94)} fill={axis.color} fillOpacity={0.08 + 0.78 * v * t} stroke={axis.color} strokeOpacity={0.35} />
            </g>
            <text className={v >= 0.5 ? 'mood-label strong' : 'mood-label'} textAnchor="middle" y="4">
              {axis.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
