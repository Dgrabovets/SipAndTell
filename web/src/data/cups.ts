import type { Mood } from './moods'

export type TeaType = 'Улун' | 'Зелёный' | 'Пуэр' | 'Чёрный' | 'Белый'
export type Place = 'home' | 'work' | 'friends' | 'road'
export type Daytime = 'morning' | 'day' | 'evening'

export interface Friend {
  name: string
  score: number
}

export interface Cup {
  id: number
  name: string
  type: TeaType
  score: number
  /** Сила шести настроений, см. data/moods.ts. */
  mood: Mood
  place: Place
  time: Daytime
  review: string
  friends: Friend[]
  day: string
}

/** Цвет точки рядом с типом чая. Подпись типа всегда рядом, цвет только подсказка. */
export const TEA_COLOR: Record<TeaType, string> = {
  Улун: 'var(--tea-oolong)',
  Зелёный: 'var(--tea-green)',
  Пуэр: 'var(--tea-puer)',
  Чёрный: 'var(--tea-black)',
  Белый: 'var(--tea-white)',
}

/** Тестовые данные, пока нет сервера. */
export const CUPS: Cup[] = [
  { id: 1, name: 'Да Хун Пао', type: 'Улун', score: 9, mood: [0.1, 0.25, 0.85, 0, 0.6, 0], place: 'home', time: 'evening', review: 'Тёплый, с минеральной ноткой. Заварил шесть раз и каждый раз он раскрывался по-новому. К концу почти сладкий.', friends: [{ name: 'Аня', score: 8 }, { name: 'Макс', score: 9 }], day: 'Сегодня' },
  { id: 2, name: 'Сенча Фукуджу', type: 'Зелёный', score: 7, mood: [0.9, 0.5, 0.1, 0, 0, 0.2], place: 'work', time: 'morning', review: 'Свежий, но к третьей заварке пресный.', friends: [{ name: 'Аня', score: 6 }, { name: 'Лёва', score: 7 }], day: 'Сегодня' },
  { id: 3, name: 'Шу Пуэр 2018', type: 'Пуэр', score: 8, mood: [0, 0.3, 0.5, 0.1, 0.8, 0], place: 'friends', time: 'evening', review: 'Земляной и густой. Друзьям понравился, спорили, на что похож запах.', friends: [{ name: 'Макс', score: 8 }, { name: 'Лёва', score: 9 }, { name: 'Аня', score: 7 }], day: 'Вчера' },
  { id: 4, name: 'Цимэнь Хун Ча', type: 'Чёрный', score: 6, mood: [0, 0, 0.2, 0.8, 0.3, 0.2], place: 'road', time: 'day', review: 'Мягкий, без горечи, но простоват.', friends: [{ name: 'Аня', score: 7 }], day: 'Вчера' },
  { id: 5, name: 'Бай Му Дань', type: 'Белый', score: 8, mood: [0.2, 0.4, 0.7, 0, 0.1, 0], place: 'home', time: 'day', review: 'Цветочный, лёгкий. Хорош холодным.', friends: [{ name: 'Лёва', score: 8 }, { name: 'Макс', score: 7 }], day: 'Вчера' },
]
