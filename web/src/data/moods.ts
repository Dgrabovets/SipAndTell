/** Шесть настроений на вершинах шестиугольника. Противоположные вершины это противоположные состояния:
 *  бодро и устало, радостно и задумчиво, уютно и напряжённо. */
export interface MoodAxis {
  label: string
  /** Существительное и родительный падеж для описания смеси. */
  noun: string
  genitive: string
  color: string
}

export const AXES: MoodAxis[] = [
  { label: 'Бодро', noun: 'Бодрость', genitive: 'бодрости', color: '#e5a64a' },
  { label: 'Радостно', noun: 'Радость', genitive: 'радости', color: '#e3c95f' },
  { label: 'Уютно', noun: 'Уют', genitive: 'уюта', color: '#d9805f' },
  { label: 'Устало', noun: 'Усталость', genitive: 'усталости', color: '#7f93b8' },
  { label: 'Задумчиво', noun: 'Задумчивость', genitive: 'задумчивости', color: '#9a86c4' },
  { label: 'Напряжённо', noun: 'Напряжение', genitive: 'напряжения', color: '#bb5a4c' },
]

/** Сила каждого настроения от 0 до 1, порядок как в AXES. */
export type Mood = number[]

const SOLO = ['Бодро и ясно', 'Светло на душе', 'Как под пледом', 'Выдохся, но доволен', 'Мысли бродят неспешно', 'Собран, как струна']

/** Фразы для соседних вершин: i и i+1. */
const PAIR = ['Заряд и улыбка', 'Тёплая радость', 'Сонный уют', 'Тихая усталость', 'Сосредоточенная глубина', 'На взводе и в деле']

/** Индексы двух самых сильных настроений. Второго нет, если оно слабое. */
export function topMoods(mood: Mood): [number, number | null] {
  const order = mood.map((v, i) => [v, i] as const).sort((a, b) => b[0] - a[0])
  const [first, second] = order
  return [first[1], second[0] >= 0.25 && second[0] >= first[0] * 0.35 ? second[1] : null]
}

/** Короткое слово для чипа на карточке. */
export function moodWord(mood: Mood): string {
  return AXES[topMoods(mood)[0]].label
}

/** Описание настроения словами по двум сильнейшим вершинам. */
export function describeMood(mood: Mood): string {
  const [a, b] = topMoods(mood)
  if (b === null) return SOLO[a]
  const [lo, hi] = a < b ? [a, b] : [b, a]
  if (hi - lo === 1) return PAIR[lo]
  if (lo === 0 && hi === 5) return PAIR[5]
  return `${AXES[a].noun} и немного ${AXES[b].genitive}`
}
