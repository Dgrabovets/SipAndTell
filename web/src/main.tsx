import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/jost'
import '@fontsource-variable/manrope'
import './index.css'
import App from './App.tsx'
import { webApp } from './telegram'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Вне Telegram SDK ничего не делает, на экране остаются свои токены.
webApp.ready()
webApp.expand()
