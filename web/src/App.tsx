import { MotionConfig } from 'motion/react'
import { useState } from 'react'
import { Aurora } from './components/Aurora'
import { DrinkButton } from './components/DrinkButton'
import { DrinkSheet } from './components/DrinkSheet'
import { HomeB } from './screens/HomeB'

export default function App() {
  const [sheet, setSheet] = useState(false)

  return (
    <MotionConfig reducedMotion="user">
      <Aurora />
      <main className="app">
        <HomeB />
      </main>
      <DrinkButton onClick={() => setSheet(true)} />
      <DrinkSheet open={sheet} onClose={() => setSheet(false)} />
    </MotionConfig>
  )
}
