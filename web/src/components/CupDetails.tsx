import { useState } from 'react'
import type { Cup, Daytime, Place } from '../data/cups'
import { useVariants } from '../variants/useVariants'
import { Actions } from './Actions'
import { Friends } from './Friends'
import { Icon } from './Icon'
import { MoodBlock } from './mood/MoodBlock'

const PLACE: Record<Place, string> = { home: 'Дома', work: 'На работе', friends: 'С друзьями', road: 'В дороге' }
const TIME: Record<Daytime, string> = { morning: 'Утро', day: 'День', evening: 'Вечер' }

const REVIEW_PREVIEW = 90

/** Детали чаепития: настроение радаром, обстоятельства значками, короткий отзыв, друзья, действия. */
export function CupDetails({ cup }: { cup: Cup }) {
  const { variants } = useVariants()
  const [full, setFull] = useState(false)
  const long = cup.review.length > REVIEW_PREVIEW
  const circumstances = [
    { icon: cup.place, label: PLACE[cup.place] },
    { icon: cup.time, label: TIME[cup.time] },
  ]

  return (
    <div className="details">
      <MoodBlock key={cup.id} mood={cup.mood} />

      <ul className="circ-row" aria-label="Обстоятельства">
        {circumstances.map((item) => (
          <li key={item.label}>
            <Icon name={item.icon} />
            {item.label}
          </li>
        ))}
      </ul>

      <blockquote className={`review rv-${variants.review}`}>
        <p className={full ? '' : 'clamp'}>{cup.review}</p>
        {long && (
          <button className={full ? 'more-chip open' : 'more-chip'} aria-expanded={full} onClick={() => setFull(!full)}>
            {full ? 'Свернуть' : 'Читать целиком'}
            <Icon name="chevron" />
          </button>
        )}
      </blockquote>

      <Friends cup={cup} />
      <Actions />
    </div>
  )
}
