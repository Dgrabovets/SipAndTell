export type TeaType = 'Улун' | 'Зелёный' | 'Пуэр' | 'Чёрный' | 'Белый'

export interface Cup {
  id: number
  name: string
  type: TeaType
  score: number
  mood: string
  place: string
  review: string
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
  { id: 1, name: 'Да Хун Пао', type: 'Улун', score: 9, mood: 'Спокойно', place: 'Дома, вечером, за книгой', review: 'Тёплый, с минеральной ноткой. Заварил шесть раз.', day: 'Сегодня' },
  { id: 2, name: 'Сенча Фукуджу', type: 'Зелёный', score: 7, mood: 'Бодро', place: 'На работе, утром', review: 'Свежий, но к третьей заварке пресный.', day: 'Сегодня' },
  { id: 3, name: 'Шу Пуэр 2018', type: 'Пуэр', score: 8, mood: 'Задумчиво', place: 'С друзьями', review: 'Земляной и густой. Друзьям понравился.', day: 'Вчера' },
  { id: 4, name: 'Цимэнь Хун Ча', type: 'Чёрный', score: 6, mood: 'Устало', place: 'В дороге', review: 'Мягкий, без горечи, но простоват.', day: 'Вчера' },
  { id: 5, name: 'Бай Му Дань', type: 'Белый', score: 8, mood: 'Спокойно', place: 'Дома, днём', review: 'Цветочный, лёгкий. Хорош холодным.', day: 'Вчера' },
]
