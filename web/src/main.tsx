import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import WebApp from '@twa-dev/sdk'
import '@fontsource-variable/manrope'
import '@fontsource-variable/lora'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Вне Telegram SDK ничего не делает, на экране остаются свои токены.
WebApp.ready()
WebApp.expand()
