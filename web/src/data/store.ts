import { useSyncExternalStore } from 'react'
import { CUPS as SEED, type Cup } from './cups'

const KEY = 'sipandtell.cups.v1'

type Stored = Omit<Cup, 'date'> & { date: string }

/** Чашки из хранилища браузера, пока нет сервера. Если там пусто или оно повреждено, берутся тестовые. */
function load(): Cup[] {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Stored[] | null
    if (Array.isArray(saved) && saved.every((c) => c.about && c.effects)) return saved.map((c) => ({ ...c, date: new Date(c.date) }))
  } catch {
    /* хранилище недоступно или повреждено */
  }
  return SEED
}

let cups: Cup[] = load()
const listeners = new Set<() => void>()

const byNewest = (a: Cup, b: Cup) => +b.date - +a.date || b.id - a.id

function set(next: Cup[]) {
  cups = [...next].sort(byNewest)
  try {
    localStorage.setItem(KEY, JSON.stringify(cups))
  } catch {
    /* без хранилища всё работает до перезагрузки */
  }
  listeners.forEach((l) => l())
}

/** Чашки пользователя: добавить, поправить, удалить, вернуть тестовые. Подписка через useCups. */
export const cupStore = {
  add(cup: Omit<Cup, 'id'>): Cup {
    const created = { ...cup, id: Math.max(0, ...cups.map((c) => c.id)) + 1 }
    set([...cups, created])
    return created
  },
  update(cup: Cup) {
    set(cups.map((c) => (c.id === cup.id ? cup : c)))
  },
  remove(id: number) {
    set(cups.filter((c) => c.id !== id))
  },
  reset() {
    set(SEED)
  },
  /** Справка для уже известного чая, чтобы новая чашка с тем же названием её получила. */
  known(name: string): Cup | undefined {
    return cups.find((c) => c.name.toLowerCase() === name.trim().toLowerCase())
  },
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export const useCups = () => useSyncExternalStore(subscribe, () => cups)
