/** Варианты элементов, по которым ещё нет решения. Первый вариант в списке берётся по умолчанию. */
export const VARIANT_GROUPS = [
  { key: 'friends', title: 'Друзья в деталях', options: [{ id: 'bars', label: 'Полоски' }, { id: 'segments', label: 'Ячейки' }, { id: 'track', label: 'Одна шкала' }] },
  { key: 'fab', title: 'Кнопка «Выпил»: анимация', options: [{ id: 'ripple', label: 'Рябь' }, { id: 'steam', label: 'Пар' }, { id: 'glow', label: 'Свечение' }] },
  { key: 'sheet', title: 'Карточка создания: появление', options: [{ id: 'slide', label: 'Выезд' }, { id: 'bloom', label: 'Круг из кнопки' }, { id: 'zoom', label: 'Приближение' }] },
  { key: 'nav', title: 'Навигация сверху: анимация', options: [{ id: 'slide', label: 'Скольжение' }, { id: 'jelly', label: 'Желе' }, { id: 'dot', label: 'Точка' }] },
] as const

export type VariantKey = (typeof VARIANT_GROUPS)[number]['key']
export type Variants = Record<VariantKey, string>

export const DEFAULT_VARIANTS = Object.fromEntries(VARIANT_GROUPS.map((g) => [g.key, g.options[0].id])) as Variants
