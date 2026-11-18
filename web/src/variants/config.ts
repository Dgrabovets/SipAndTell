export interface VariantGroup {
  key: string
  title: string
  options: readonly { id: string; label: string }[]
}

/** Варианты элементов, по которым ещё нет решения. Первый вариант в группе берётся по умолчанию.
 *  Когда все решено, список пуст и панель «Вид» не показывается. Выбор виден в CSS как html[data-<key>='<id>']. */
export const VARIANT_GROUPS: readonly VariantGroup[] = [
  { key: 'effect', title: 'Эффект чая: где показывать и сравнивать', options: [{ id: 'dots', label: 'Шкалы с точками людей в «Моё чаепитие»' }, { id: 'radar', label: 'Вкладка «Эффект» с радаром' }, { id: 'versus', label: 'Сравнение с другим чаем в «Моё чаепитие»' }] },
  { key: 'font', title: 'Шрифт подписей в навигации и сводке', options: [{ id: 'jost', label: 'Jost, как сейчас' }, { id: 'caps', label: 'Jost капслоком с разрядкой' }, { id: 'manrope', label: 'Manrope' }, { id: 'onest', label: 'Onest' }, { id: 'nunito', label: 'Nunito, округлый' }] },
]

export type VariantKey = string
export type Variants = Record<VariantKey, string>

export const DEFAULT_VARIANTS: Variants = Object.fromEntries(VARIANT_GROUPS.map((g) => [g.key, g.options[0].id]))
