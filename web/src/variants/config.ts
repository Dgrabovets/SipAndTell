/** Варианты элементов, по которым ещё нет решения. Первый вариант в списке берётся по умолчанию. */
export const VARIANT_GROUPS = [
  // Карточка чаепития в списке
  { key: 'surface', title: 'Карточка: поверхность', options: [{ id: 'tint', label: 'Цвет чая' }, { id: 'plain', label: 'Однотонная' }, { id: 'stripe', label: 'Полоска слева' }, { id: 'glow', label: 'Светящаяся рамка' }] },
  { key: 'density', title: 'Карточка: плотность', options: [{ id: 'roomy', label: 'Просторная' }, { id: 'compact', label: 'Плотная' }] },
  { key: 'enter', title: 'Карточка: появление в списке', options: [{ id: 'rise', label: 'Всплытие' }, { id: 'slide', label: 'Слева' }, { id: 'blur', label: 'Проявление' }, { id: 'none', label: 'Без' }] },
  { key: 'press', title: 'Карточка: отклик на нажатие', options: [{ id: 'lift', label: 'Приподнять' }, { id: 'tilt', label: '3D-наклон' }, { id: 'squish', label: 'Сжатие' }] },
  { key: 'score', title: 'Карточка: оценка', options: [{ id: 'ring', label: 'Кольцо' }, { id: 'tone', label: 'Цвет по оценке' }, { id: 'arc', label: 'Полукруг' }] },
  { key: 'chips', title: 'Карточка: что в чипах', options: [{ id: 'basic', label: 'Тип, настроение, день' }, { id: 'short', label: 'Тип и настроение' }, { id: 'rich', label: 'С иконками места' }] },
  { key: 'list', title: 'Список: группировка', options: [{ id: 'flat', label: 'Общий' }, { id: 'days', label: 'По дням' }] },
  { key: 'gesture', title: 'Карточка: жест', options: [{ id: 'none', label: 'Нет' }, { id: 'swipe', label: 'Свайп: действия' }] },
  // Детали чаепития
  { key: 'head', title: 'Детали: шапка', options: [{ id: 'title', label: 'Название и тип' }, { id: 'ring', label: 'С большим кольцом' }] },
  { key: 'review', title: 'Детали: отзыв', options: [{ id: 'quote', label: 'Цитата' }, { id: 'frame', label: 'Рамка' }, { id: 'line', label: 'Линия слева' }] },
  { key: 'friends', title: 'Детали: друзья', options: [{ id: 'bars', label: 'Полоски' }, { id: 'segments', label: 'Ячейки' }, { id: 'track', label: 'Одна шкала' }] },
  { key: 'sheet', title: 'Карточка создания: появление', options: [{ id: 'slide', label: 'Выезд' }, { id: 'bloom', label: 'Круг из кнопки' }, { id: 'zoom', label: 'Приближение' }] },
  // Кнопка и навигация
  { key: 'fab', title: 'Кнопка «Выпил»: анимация', options: [{ id: 'ripple', label: 'Рябь' }, { id: 'steam', label: 'Пар' }, { id: 'glow', label: 'Свечение' }] },
  { key: 'nav', title: 'Навигация сверху: анимация', options: [{ id: 'slide', label: 'Скольжение' }, { id: 'jelly', label: 'Желе' }, { id: 'dot', label: 'Точка' }] },
] as const

export type VariantKey = (typeof VARIANT_GROUPS)[number]['key']
export type Variants = Record<VariantKey, string>

export const DEFAULT_VARIANTS = Object.fromEntries(VARIANT_GROUPS.map((g) => [g.key, g.options[0].id])) as Variants
