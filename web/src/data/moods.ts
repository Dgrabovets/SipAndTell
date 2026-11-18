/** Восемь настроений на вершинах радара. Вершина i и вершина i+4 это противоположные состояния:
 *  бодро и устало, радостно и грустно, любопытно и раздражённо, уютно и тревожно. */
export interface MoodAxis {
  label: string
  /** Родительный падеж: «с ноткой грусти». */
  genitive: string
  color: string
}

export const AXES: MoodAxis[] = [
  { label: 'Бодро', genitive: 'бодрости', color: '#e5a64a' },
  { label: 'Радостно', genitive: 'радости', color: '#e3c95f' },
  { label: 'Любопытно', genitive: 'любопытства', color: '#8fc27a' },
  { label: 'Уютно', genitive: 'уюта', color: '#d9805f' },
  { label: 'Устало', genitive: 'усталости', color: '#7f93b8' },
  { label: 'Грустно', genitive: 'грусти', color: '#6f8fd0' },
  { label: 'Раздражённо', genitive: 'раздражения', color: '#bb5a4c' },
  { label: 'Тревожно', genitive: 'тревоги', color: '#9a86c4' },
]

/** Сила каждого настроения от 0 до 1, порядок как в AXES. */
export type Mood = number[]

export interface MoodText {
  title: string
  line: string
}

const SOLO: MoodText[] = [
  { title: 'Ясная голова', line: 'Чай разбудил лучше будильника.' },
  { title: 'Светлый день', line: 'Улыбка пришла раньше первой заварки.' },
  { title: 'Что там в чашке?', line: 'Новый вкус, и хочется разобраться.' },
  { title: 'Плед и тишина', line: 'За окном что-то происходит, но тебя это не касается.' },
  { title: 'Тихий выдох', line: 'Чашка греет руки, остальное подождёт.' },
  { title: 'Тихая грусть', line: 'Чай не лечит, но с ним легче.' },
  { title: 'Колючий день', line: 'Пока остывает чай, остываешь и ты.' },
  { title: 'Неспокойно внутри', line: 'Тёплая чашка занимает руки, пока голова разбирается.' },
]

/** Пары по возрастанию индексов: соседние вершины и противоположные. Остальные собираются из одиночных. */
const PAIR: Record<string, MoodText> = {
  '0-1': { title: 'Искры в чашке', line: 'Энергия и хорошее настроение на одной заварке.' },
  '1-2': { title: 'Радостное любопытство', line: 'Каждый глоток чуть интереснее предыдущего.' },
  '2-3': { title: 'Уютное открытие', line: 'Новый чай, а плед старый.' },
  '3-4': { title: 'Сонный уют', line: 'Ещё пара глотков, и можно закрывать глаза.' },
  '4-5': { title: 'Тихая усталость', line: 'День закончился, а мысли ещё допивают.' },
  '5-6': { title: 'Горький привкус', line: 'Чай обычный, но день попался трудный.' },
  '6-7': { title: 'На нервах', line: 'Руки заняты чашкой, голова всё ещё не здесь.' },
  '0-7': { title: 'На взводе, но в деле', line: 'Чай как сигнал к старту.' },
  '0-4': { title: 'Бодрая усталость', line: 'Тело просит паузы, голова ещё бежит.' },
  '1-5': { title: 'Светлая грусть', line: 'Улыбка с привкусом воспоминаний.' },
  '2-6': { title: 'Любопытство с занозой', line: 'Хочется разобраться, но что-то мешает.' },
  '3-7': { title: 'Уют под давлением', line: 'Тепло чашки спорит со списком дел.' },
}

const FLAT: MoodText = { title: 'Ровный день', line: 'Ничего громкого, просто хороший чай.' }

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

/** Цвет сильнейшего настроения. */
export function moodColor(mood: Mood): string {
  return AXES[topMoods(mood)[0]].color
}

/** Заголовок и строка о настроении по двум сильнейшим вершинам. */
export function describeMood(mood: Mood): MoodText {
  const [a, b] = topMoods(mood)
  if (Math.max(...mood) < 0.45) return FLAT
  if (b === null) return SOLO[a]
  const ready = PAIR[`${Math.min(a, b)}-${Math.max(a, b)}`]
  if (ready) return ready
  return { title: `${SOLO[a].title} с ноткой ${AXES[b].genitive}`, line: SOLO[a].line }
}
