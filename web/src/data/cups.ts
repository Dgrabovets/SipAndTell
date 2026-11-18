import type { Mood } from './moods'

export type TeaType = 'Улун' | 'Зелёный' | 'Пуэр' | 'Чёрный' | 'Белый'
export type Place = 'home' | 'work' | 'friends' | 'road'
export type Daytime = 'morning' | 'day' | 'evening'

export interface Friend {
  name: string
  score: number
  /** Цвет друга: его метка на шкале и в списке. */
  color: string
}

export interface Cup {
  id: number
  name: string
  type: TeaType
  score: number
  /** Сила восьми настроений, порядок как в data/moods.ts. */
  mood: Mood
  place: Place
  time: Daytime
  review: string
  friends: Friend[]
  date: Date
}

/** Цвет точки рядом с типом чая. Подпись типа всегда рядом, цвет только подсказка. */
export const TEA_COLOR: Record<TeaType, string> = {
  Улун: 'var(--tea-oolong)',
  Зелёный: 'var(--tea-green)',
  Пуэр: 'var(--tea-puer)',
  Чёрный: 'var(--tea-black)',
  Белый: 'var(--tea-white)',
}

/** Цвет самого пользователя на шкалах и в списках. */
export const YOU_COLOR = 'var(--primary)'

const FRIEND_COLOR = { Аня: '#6fb7e0', Макс: '#b58be6', Лёва: '#e68ba6' }

const friend = (name: keyof typeof FRIEND_COLOR, score: number): Friend => ({ name, score, color: FRIEND_COLOR[name] })

/** Полдень n дней назад: тестовые данные всегда выглядят свежими. */
const ago = (n: number) => {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() - n)
  return d
}

/** Тестовые данные, пока нет сервера. Настроение: бодро, радостно, любопытно, уютно, устало, грустно, раздражённо, тревожно. */
export const CUPS: Cup[] = [
  { id: 1, name: 'Да Хун Пао', type: 'Улун', score: 9, mood: [0.1, 0.25, 0.3, 0.85, 0, 0.35, 0, 0], place: 'home', time: 'evening', review: 'Тёплый, с минеральной ноткой. Заварил шесть раз и каждый раз он раскрывался по-новому. К концу почти сладкий.', friends: [friend('Аня', 8), friend('Макс', 9)], date: ago(0) },
  { id: 2, name: 'Сенча Фукуджу', type: 'Зелёный', score: 7, mood: [0.9, 0.5, 0.2, 0.1, 0, 0, 0, 0.2], place: 'work', time: 'morning', review: 'Свежий, но к третьей заварке пресный.', friends: [friend('Аня', 6), friend('Лёва', 7)], date: ago(0) },
  { id: 3, name: 'Шу Пуэр 2018', type: 'Пуэр', score: 8, mood: [0, 0.2, 0.3, 0.6, 0.1, 0.75, 0, 0], place: 'friends', time: 'evening', review: 'Земляной и густой. Друзьям понравился, спорили, на что похож запах.', friends: [friend('Макс', 8), friend('Лёва', 9), friend('Аня', 7)], date: ago(1) },
  { id: 4, name: 'Цимэнь Хун Ча', type: 'Чёрный', score: 6, mood: [0, 0, 0, 0.1, 0.8, 0.4, 0.15, 0.2], place: 'road', time: 'day', review: 'Мягкий, без горечи, но простоват.', friends: [friend('Аня', 7)], date: ago(1) },
  { id: 5, name: 'Бай Му Дань', type: 'Белый', score: 8, mood: [0.2, 0.4, 0.3, 0.7, 0, 0, 0, 0], place: 'home', time: 'day', review: 'Цветочный, лёгкий. Хорош холодным.', friends: [friend('Лёва', 8), friend('Макс', 7)], date: ago(1) },
  { id: 6, name: 'Лао Бань Чжан', type: 'Пуэр', score: 5, mood: [0.1, 0, 0, 0, 0.3, 0, 0.8, 0.5], place: 'work', time: 'day', review: 'Заварил в спешке, получилось горько. День был такой же.', friends: [friend('Макс', 9)], date: ago(5) },
  { id: 7, name: 'Те Гуань Инь', type: 'Улун', score: 7, mood: [0.3, 0.3, 0.6, 0.3, 0.1, 0, 0, 0], place: 'home', time: 'morning', review: 'Цветочный, с долгим послевкусием.', friends: [friend('Аня', 8)], date: ago(8) },
  { id: 8, name: 'Дянь Хун', type: 'Чёрный', score: 8, mood: [0.5, 0.6, 0.2, 0.5, 0, 0, 0, 0], place: 'friends', time: 'evening', review: 'Медовый, с карамельной нотой. Пили вчетвером.', friends: [friend('Макс', 8), friend('Лёва', 9)], date: ago(21) },
]
