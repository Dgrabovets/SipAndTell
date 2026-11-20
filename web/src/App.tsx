import { MotionConfig } from 'motion/react'
import { Aurora } from './components/Aurora'
import { DrinkButton } from './components/DrinkButton'
import { DrinkSheet } from './components/DrinkSheet'
import { drinkStore } from './data/drinkStore'
import { Home } from './screens/Home'
import { VariantsPanel } from './variants/VariantsPanel'
import { VariantsProvider } from './variants/VariantsProvider'

export default function App() {
  return (
    <VariantsProvider>
      <MotionConfig reducedMotion="user">
        <Aurora />
        {import.meta.env.DEV && <VariantsPanel />}
        <main className="app">
          <Home />
        </main>
        <DrinkButton onClick={() => drinkStore.open()} />
        <DrinkSheet />
      </MotionConfig>
    </VariantsProvider>
  )
}
