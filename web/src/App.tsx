import { MotionConfig } from 'motion/react'
import { useEffect, useState } from 'react'
import { Aurora } from './components/Aurora'
import { DrinkButton } from './components/DrinkButton'
import { DrinkSheet } from './components/DrinkSheet'
import { HomeB } from './screens/HomeB'

const FONTS = { system: 'A', serif: 'B', web: 'C' }
type Font = keyof typeof FONTS

export default function App() {
  const [sheet, setSheet] = useState(false)
  const [font, setFont] = useState<Font>('system')

  useEffect(() => {
    document.documentElement.dataset.font = font
  }, [font])

  return (
    <MotionConfig reducedMotion="user">
      <Aurora />
      {import.meta.env.DEV && (
        <div className="font-switch" role="group" aria-label="Шрифт">
          {(Object.keys(FONTS) as Font[]).map((f) => (
            <button key={f} aria-pressed={font === f} onClick={() => setFont(f)}>
              {FONTS[f]}
            </button>
          ))}
        </div>
      )}
      <main className="app">
        <HomeB />
      </main>
      <DrinkButton onClick={() => setSheet(true)} />
      <DrinkSheet open={sheet} onClose={() => setSheet(false)} />
    </MotionConfig>
  )
}
