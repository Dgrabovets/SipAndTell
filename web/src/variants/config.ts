/** Варианты элементов, по которым ещё нет решения. Первый вариант в списке берётся по умолчанию. */
export const VARIANT_GROUPS = [
  { key: 'calendar', title: 'Календарь: где живёт', options: [{ id: 'strip', label: 'Лента дней под шапкой' }, { id: 'month', label: 'Кнопка и шторка с месяцем' }] },
  { key: 'friends', title: 'Детали: друзья на шкале', options: [{ id: 'legend', label: 'Точки и легенда' }, { id: 'initials', label: 'Буквы в точках' }, { id: 'stagger', label: 'Имена над и под шкалой' }] },
  { key: 'fab', title: 'Кнопка «Выпил»: как видно, что она живая', options: [{ id: 'still', label: 'Без анимации' }, { id: 'pulse', label: 'Мягкая пульсация' }, { id: 'label', label: 'Подпись «Выпил»' }] },
] as const

export type VariantKey = (typeof VARIANT_GROUPS)[number]['key']
export type Variants = Record<VariantKey, string>

export const DEFAULT_VARIANTS = Object.fromEntries(VARIANT_GROUPS.map((g) => [g.key, g.options[0].id])) as Variants
