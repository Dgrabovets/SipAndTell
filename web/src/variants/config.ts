export interface VariantGroup {
  key: string
  title: string
  options: readonly { id: string; label: string }[]
}

/** Варианты элементов, по которым ещё нет решения. Первый вариант в группе берётся по умолчанию.
 *  Когда все решено, список пуст и панель «Вид» не показывается. Выбор виден в CSS как html[data-<key>='<id>']. */
export const VARIANT_GROUPS: readonly VariantGroup[] = [
  { key: 'effectPair', title: 'Вкладка «Эффект», «Ты и друзья»: пара цветов', options: [{ id: 'amberLilac', label: 'Янтарный и сиреневый' }, { id: 'coralTeal', label: 'Коралловый и бирюзовый' }, { id: 'goldPink', label: 'Золотой и розовый' }] },
]

export type VariantKey = string
export type Variants = Record<VariantKey, string>

export const DEFAULT_VARIANTS: Variants = Object.fromEntries(VARIANT_GROUPS.map((g) => [g.key, g.options[0].id]))
