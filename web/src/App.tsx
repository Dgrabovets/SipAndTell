import { MotionConfig } from 'motion/react'
import { useEffect, useState } from 'react'
import { DrinkButton } from './components/DrinkButton'
import { DrinkSheet } from './components/DrinkSheet'
import { HomeB } from './screens/HomeB'

const PALETTES = { house: 'Дом', matcha: 'Матча', hibiscus: 'Гибискус', dusk: 'Сумерки' }
type Palette = keyof typeof PALETTES

export default function App() {
  const [sheet, setSheet] = useState(false)
  const [palette, setPalette] = useState<Palette>('house')
  const [dark, setDark] = useState(() => matchMedia('(prefers-color-scheme: dark)').matches)

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    document.documentElement.dataset.palette = palette
  }, [dark, palette])

  return (
    <MotionConfig reducedMotion="user">
      {import.meta.env.DEV && (
        <div className="dev-switch" role="group" aria-label="Палитра">
          {(Object.keys(PALETTES) as Palette[]).map((p) => (
            <button key={p} aria-pressed={palette === p} onClick={() => setPalette(p)}>
              {PALETTES[p]}
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
