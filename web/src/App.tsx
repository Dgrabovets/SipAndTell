import { MotionConfig } from 'motion/react'
import { useState } from 'react'
import { DrinkButton } from './components/DrinkButton'
import { DrinkSheet } from './components/DrinkSheet'
import { HomeA } from './screens/HomeA'
import { HomeB } from './screens/HomeB'
import { HomeC } from './screens/HomeC'

const VARIANTS = { A: HomeA, B: HomeB, C: HomeC }
type Variant = keyof typeof VARIANTS

export default function App() {
  const [variant, setVariant] = useState<Variant>('A')
  const [sheet, setSheet] = useState(false)
  const Home = VARIANTS[variant]

  return (
    <MotionConfig reducedMotion="user">
      {import.meta.env.DEV && (
        <div className="dev-switch" role="group" aria-label="Вариант главной">
          {(Object.keys(VARIANTS) as Variant[]).map((v) => (
            <button key={v} aria-pressed={variant === v} onClick={() => setVariant(v)}>
              {v}
            </button>
          ))}
        </div>
      )}
      <main className={import.meta.env.DEV ? 'app app-dev' : 'app'}>
        <Home key={variant} />
      </main>
      <DrinkButton onClick={() => setSheet(true)} />
      <DrinkSheet open={sheet} onClose={() => setSheet(false)} />
    </MotionConfig>
  )
}
