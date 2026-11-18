import { AXES, describeMood, topMoods, type Mood } from '../../data/moods'
import { MoodFlower } from './MoodFlower'
import { MoodRadar } from './MoodRadar'
import { MoodWheel } from './MoodWheel'

export type MoodStyle = 'radar' | 'flower' | 'wheel'

const WIDGETS = { radar: MoodRadar, flower: MoodFlower, wheel: MoodWheel }

/** Настроение: рисунок шестиугольника и фраза, собранная по двум сильнейшим вершинам. */
export function MoodBlock({ mood, style }: { mood: Mood; style: MoodStyle }) {
  const Widget = WIDGETS[style]
  const [a, b] = topMoods(mood)
  const percent = (i: number) => `${AXES[i].label} ${Math.round(mood[i] * 100)}%`

  return (
    <section className="mood-block" aria-label="Настроение">
      <Widget mood={mood} />
      <p className="mood-phrase">{describeMood(mood)}</p>
      <p className="mood-caption">{b === null ? percent(a) : `${percent(a)} · ${percent(b)}`}</p>
    </section>
  )
}
