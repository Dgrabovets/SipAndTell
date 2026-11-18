/** Варианты элементов, по которым ещё нет решения. Первый вариант в списке берётся по умолчанию. */
export const VARIANT_GROUPS = [
  { key: 'tabs', title: 'Детали: вкладки «Моё чаепитие» и «О чае»', options: [{ id: 'segment', label: 'Стеклянная плашка' }, { id: 'underline', label: 'Подчёркивание и свайп' }, { id: 'pager', label: 'Точки и свайп' }] },
] as const

export type VariantKey = (typeof VARIANT_GROUPS)[number]['key']
export type Variants = Record<VariantKey, string>

export const DEFAULT_VARIANTS = Object.fromEntries(VARIANT_GROUPS.map((g) => [g.key, g.options[0].id])) as Variants
