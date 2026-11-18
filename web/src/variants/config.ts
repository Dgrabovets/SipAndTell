/** Варианты элементов, по которым ещё нет решения. Первый вариант в списке берётся по умолчанию. */
export const VARIANT_GROUPS = [
  { key: 'summary', title: 'Шапка: сводка недели', options: [{ id: 'tiles', label: 'Три плитки' }, { id: 'line', label: 'Тонкая плашка' }, { id: 'week', label: 'Неделя столбиками' }, { id: 'ring', label: 'Кольцо средней оценки' }] },
  { key: 'radarDraw', title: 'Радар настроения: рисовка', options: [{ id: 'polygon', label: 'Многоугольник' }, { id: 'smooth', label: 'Плавная капля' }, { id: 'petals', label: 'Лепестки' }, { id: 'rays', label: 'Лучи' }] },
  { key: 'radarMove', title: 'Радар настроения: движение', options: [{ id: 'breathe', label: 'Дыхание' }, { id: 'grow', label: 'Только рост' }, { id: 'wave', label: 'Волна по вершинам' }, { id: 'spark', label: 'Бегущая искра' }] },
] as const

export type VariantKey = (typeof VARIANT_GROUPS)[number]['key']
export type Variants = Record<VariantKey, string>

export const DEFAULT_VARIANTS = Object.fromEntries(VARIANT_GROUPS.map((g) => [g.key, g.options[0].id])) as Variants
