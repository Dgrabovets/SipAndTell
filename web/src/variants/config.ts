export interface VariantGroup {
  key: string
  title: string
  options: readonly { id: string; label: string }[]
}

/** Варианты элементов, по которым ещё нет решения. Первый вариант в группе берётся по умолчанию.
 *  Когда все решено, список пуст и панель «Вид» не показывается. Выбор виден в CSS как html[data-<key>='<id>']. */
export const VARIANT_GROUPS: readonly VariantGroup[] = [
  { key: 'capture', title: 'Форма «Выпил»: кнопки съёмки', options: [{ id: 'tiles', label: 'Три плитки сверху' }, { id: 'dock', label: 'Панель внизу, видна при прокрутке' }, { id: 'hero', label: 'Большой микрофон, остальное мелко' }] },
]

export type VariantKey = string
export type Variants = Record<VariantKey, string>

export const DEFAULT_VARIANTS: Variants = Object.fromEntries(VARIANT_GROUPS.map((g) => [g.key, g.options[0].id]))
