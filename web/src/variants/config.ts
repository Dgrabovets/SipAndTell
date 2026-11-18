export interface VariantGroup {
  key: string
  title: string
  options: readonly { id: string; label: string }[]
}

/** Варианты элементов, по которым ещё нет решения. Первый вариант в группе берётся по умолчанию.
 *  Когда все решено, список пуст и панель «Вид» не показывается. Выбор виден в CSS как html[data-<key>='<id>']. */
export const VARIANT_GROUPS: readonly VariantGroup[] = [
  { key: 'effectColors', title: 'Вкладка «Эффект»: цвета линий', options: [{ id: 'pair', label: 'Янтарный и голубой всегда' }, { id: 'tea', label: 'Цвета чаёв, при одинаковых мятный' }, { id: 'outline', label: 'Заливка и контур, цвет один' }] },
  { key: 'effectNumbers', title: 'Вкладка «Эффект»: числа', options: [{ id: 'plain', label: 'Справа у каждой полоски' }, { id: 'tip', label: 'На кончике полоски' }, { id: 'delta', label: 'Только разница справа' }] },
]

export type VariantKey = string
export type Variants = Record<VariantKey, string>

export const DEFAULT_VARIANTS: Variants = Object.fromEntries(VARIANT_GROUPS.map((g) => [g.key, g.options[0].id]))
