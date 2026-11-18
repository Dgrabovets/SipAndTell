import { MotionConfig } from 'motion/react'
import { useState } from 'react'
import { Aurora } from './components/Aurora'
import { DrinkButton } from './components/DrinkButton'
import { DrinkSheet } from './components/DrinkSheet'
import type { MoodStyle } from './components/mood/MoodBlock'
import { HomeB } from './screens/HomeB'

const STYLES: Record<MoodStyle, string> = { radar: 'Радар', flower: 'Цветок', wheel: 'Колесо' }

export default function App() {
  const [sheet, setSheet] = useState(false)
  const [moodStyle, setMoodStyle] = useState<MoodStyle>('radar')

  return (
    <MotionConfig reducedMotion="user">
      <Aurora />
      {import.meta.env.DEV && (
        <div className="dev-switch" role="group" aria-label="Как рисуем настроение">
          {(Object.keys(STYLES) as MoodStyle[]).map((s) => (
            <button key={s} aria-pressed={moodStyle === s} onClick={() => setMoodStyle(s)}>
              {STYLES[s]}
            </button>
          ))}
        </div>
      )}
      <main className="app">
        <HomeB moodStyle={moodStyle} />
      </main>
      <DrinkButton onClick={() => setSheet(true)} />
      <DrinkSheet open={sheet} onClose={() => setSheet(false)} />
    </MotionConfig>
  )
}
