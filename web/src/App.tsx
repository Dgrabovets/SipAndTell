import { MotionConfig } from 'motion/react'
import { useEffect, useState } from 'react'
import { DrinkButton } from './components/DrinkButton'
import { DrinkSheet } from './components/DrinkSheet'
import { HomeB } from './screens/HomeB'

const GLASS = { off: 'Без', matte: 'Матовое', liquid: 'Жидкое', floating: 'Плавающее' }
type Glass = keyof typeof GLASS

export default function App() {
  const [sheet, setSheet] = useState(false)
  const [glass, setGlass] = useState<Glass>('liquid')
  const [dark, setDark] = useState(() => matchMedia('(prefers-color-scheme: dark)').matches)

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    document.documentElement.dataset.glass = glass
  }, [dark, glass])

  return (
    <MotionConfig reducedMotion="user">
      {import.meta.env.DEV && (
        <div className="dev-switch" role="group" aria-label="Стекло">
          {(Object.keys(GLASS) as Glass[]).map((g) => (
            <button key={g} aria-pressed={glass === g} onClick={() => setGlass(g)}>
              {GLASS[g]}
            </button>
          ))}
          <button onClick={() => setDark(!dark)}>{dark ? 'Светлая' : 'Тёмная'}</button>
        </div>
      )}
      <main className={import.meta.env.DEV ? 'app app-dev' : 'app'}>
        <HomeB />
      </main>
      <DrinkButton onClick={() => setSheet(true)} />
      <DrinkSheet open={sheet} onClose={() => setSheet(false)} />
    </MotionConfig>
  )
}
