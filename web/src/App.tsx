import { MotionConfig } from 'motion/react'
import { useState } from 'react'
import { Aurora } from './components/Aurora'
import { DrinkButton } from './components/DrinkButton'
import { DrinkSheet } from './components/DrinkSheet'
import { Home } from './screens/Home'
import { VariantsPanel } from './variants/VariantsPanel'
import { VariantsProvider } from './variants/VariantsProvider'

export default function App() {
  const [sheet, setSheet] = useState(false)

  return (
    <VariantsProvider>
      <MotionConfig reducedMotion="user">
        <Aurora />
        {import.meta.env.DEV && <VariantsPanel />}
        <main className="app">
          <Home />
        </main>
        <DrinkButton onClick={() => setSheet(true)} />
        <DrinkSheet open={sheet} onClose={() => setSheet(false)} />
      </MotionConfig>
    </VariantsProvider>
  )
}
