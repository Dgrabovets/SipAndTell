/** Варианты каждого элемента интерфейса. Первый вариант в списке берётся по умолчанию. */
export const VARIANT_GROUPS = [
  { key: 'card', title: 'Карточка на главной', options: [{ id: 'glass', label: 'Крупная' }, { id: 'row', label: 'Строка' }, { id: 'tile', label: 'Плитки' }] },
  { key: 'score', title: 'Оценка', options: [{ id: 'big', label: 'Число' }, { id: 'ring', label: 'Кольцо' }, { id: 'dots', label: 'Точки' }] },
  { key: 'chips', title: 'Чипы на карточке', options: [{ id: 'pills', label: 'Таблетки' }, { id: 'text', label: 'Строка' }, { id: 'minimal', label: 'Минимум' }] },
  { key: 'header', title: 'Шапка', options: [{ id: 'title', label: 'Заголовок' }, { id: 'summary', label: 'Сводка' }, { id: 'compact', label: 'Компактная' }] },
  { key: 'drink', title: 'Кнопка «Выпил»', options: [{ id: 'wide', label: 'Во всю ширину' }, { id: 'fab', label: 'Круглая' }, { id: 'island', label: 'Островок' }] },
  { key: 'nav', title: 'Навигация', options: [{ id: 'none', label: 'Нет' }, { id: 'top', label: 'Сверху' }, { id: 'bottom', label: 'Снизу' }] },
  { key: 'friends', title: 'Друзья в деталях', options: [{ id: 'bars', label: 'Полоски' }, { id: 'avatars', label: 'Круги' }] },
  { key: 'place', title: 'Обстоятельства', options: [{ id: 'chips', label: 'Таблетки' }, { id: 'row', label: 'Значки' }] },
] as const

export type VariantKey = (typeof VARIANT_GROUPS)[number]['key']
export type Variants = Record<VariantKey, string>

export const DEFAULT_VARIANTS = Object.fromEntries(VARIANT_GROUPS.map((g) => [g.key, g.options[0].id])) as Variants
