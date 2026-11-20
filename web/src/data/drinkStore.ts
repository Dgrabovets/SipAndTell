import { useSyncExternalStore } from 'react'
import type { Cup, TeaType } from './cups'

/** Что просит открыть шторка «Выпил»: пустую форму, форму с уже выбранным чаем или правку чашки. */
export interface DrinkRequest {
  open: boolean
  /** Номер запроса: новый запрос пересоздаёт форму, даже если старая ещё уезжает. */
  id: number
  seed?: { name: string; type: TeaType }
  edit?: Cup
}

let seq = 0
let state: DrinkRequest = { open: false, id: 0 }
const listeners = new Set<() => void>()

function set(next: DrinkRequest) {
  state = next
  listeners.forEach((l) => l())
}

export const drinkStore = {
  open: (seed?: DrinkRequest['seed']) => set({ open: true, id: ++seq, seed }),
  edit: (cup: Cup) => set({ open: true, id: ++seq, edit: cup }),
  close: () => set({ ...state, open: false }),
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export const useDrinkRequest = () => useSyncExternalStore(subscribe, () => state)
