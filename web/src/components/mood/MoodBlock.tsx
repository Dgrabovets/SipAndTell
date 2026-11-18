import { describeMood, type Mood } from '../../data/moods'
import { MoodRadar } from './MoodRadar'

/** Настроение: радар из шести вершин, заголовок и строка по двум сильнейшим. */
export function MoodBlock({ mood }: { mood: Mood }) {
  const { title, line } = describeMood(mood)

  return (
    <section className="mood-block" aria-label="Настроение">
      <MoodRadar mood={mood} />
      <p className="mood-phrase">{title}</p>
      <p className="mood-caption">{line}</p>
    </section>
  )
}
