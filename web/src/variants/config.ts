/** Варианты элементов, по которым ещё нет решения. Первый вариант в списке берётся по умолчанию. */
export const VARIANT_GROUPS = [
  { key: 'month', title: 'Календарь: как выглядит месяц', options: [{ id: 'dots', label: 'Точки под числом' }, { id: 'tint', label: 'Заливка цветом чая' }, { id: 'agenda', label: 'С чашками дня под месяцем' }] },
] as const

export type VariantKey = (typeof VARIANT_GROUPS)[number]['key']
export type Variants = Record<VariantKey, string>

export const DEFAULT_VARIANTS = Object.fromEntries(VARIANT_GROUPS.map((g) => [g.key, g.options[0].id])) as Variants
