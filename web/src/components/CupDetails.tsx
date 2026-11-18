import type { Cup } from '../data/cups'

export function CupDetails({ cup }: { cup: Cup }) {
  return (
    <dl className="details">
      <dt>Настроение</dt>
      <dd>{cup.mood}</dd>
      <dt>Обстоятельства</dt>
      <dd>{cup.place}</dd>
      <dt>Отзыв</dt>
      <dd>{cup.review}</dd>
    </dl>
  )
}
