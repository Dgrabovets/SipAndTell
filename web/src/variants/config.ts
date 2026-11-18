export interface VariantGroup {
  key: string
  title: string
  options: readonly { id: string; label: string }[]
}

/** Варианты элементов, по которым ещё нет решения. Первый вариант в группе берётся по умолчанию.
 *  Когда все решено, список пуст и панель «Вид» не показывается. */
export const VARIANT_GROUPS: readonly VariantGroup[] = [
  { key: 'radar', title: 'Радар настроения: движение', options: [{ id: 'soft', label: 'Мягко, прежние характеры' }, { id: 'kinds', label: 'У каждого настроения свой рисунок' }, { id: 'glow', label: 'Форма стоит, пульсирует свечение' }] },
]

export type VariantKey = string
export type Variants = Record<VariantKey, string>

export const DEFAULT_VARIANTS: Variants = Object.fromEntries(VARIANT_GROUPS.map((g) => [g.key, g.options[0].id]))
