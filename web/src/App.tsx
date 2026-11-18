import { MotionConfig } from 'motion/react'
import { useState } from 'react'
import { Aurora } from './components/Aurora'
import { DrinkButton } from './components/DrinkButton'
import { DrinkSheet } from './components/DrinkSheet'
import type { ActionStyle } from './components/Actions'
import { HomeB } from './screens/HomeB'

const STYLES: Record<ActionStyle, string> = { pair: 'Пара', round: 'Круги', menu: 'Меню' }

export default function App() {
  const [sheet, setSheet] = useState(false)
  const [actionStyle, setActionStyle] = useState<ActionStyle>('pair')

  return (
    <MotionConfig reducedMotion="user">
      <Aurora />
      {import.meta.env.DEV && (
        <div className="dev-switch" role="group" aria-label="Кнопки в деталях">
          {(Object.keys(STYLES) as ActionStyle[]).map((s) => (
            <button key={s} aria-pressed={actionStyle === s} onClick={() => setActionStyle(s)}>
              {STYLES[s]}
            </button>
          ))}
        </div>
      )}
      <main className="app">
        <HomeB actionStyle={actionStyle} />
      </main>
      <DrinkButton onClick={() => setSheet(true)} />
      <DrinkSheet open={sheet} onClose={() => setSheet(false)} />
    </MotionConfig>
  )
}
