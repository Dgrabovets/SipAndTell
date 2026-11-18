import { MotionConfig } from 'motion/react'
import { useState } from 'react'
import { Aurora } from './components/Aurora'
import { DrinkButton } from './components/DrinkButton'
import { DrinkSheet } from './components/DrinkSheet'
import { HomeB, type OpenMode } from './screens/HomeB'

const MODES: Record<OpenMode, string> = { inline: '1', screen: '2', sheet: '3' }

export default function App() {
  const [sheet, setSheet] = useState(false)
  const [mode, setMode] = useState<OpenMode>('inline')

  return (
    <MotionConfig reducedMotion="user">
      <Aurora />
      {import.meta.env.DEV && (
        <div className="dev-switch" role="group" aria-label="Как открывается карточка">
          {(Object.keys(MODES) as OpenMode[]).map((m) => (
            <button key={m} aria-pressed={mode === m} onClick={() => setMode(m)}>
              {MODES[m]}
            </button>
          ))}
        </div>
      )}
      <main className="app">
        <HomeB key={mode} mode={mode} />
      </main>
      <DrinkButton onClick={() => setSheet(true)} />
      <DrinkSheet open={sheet} onClose={() => setSheet(false)} />
    </MotionConfig>
  )
}
