import { motion } from 'motion/react'
import { useState } from 'react'
import type { Cup, Daytime, Place } from '../data/cups'
import { Actions, type ActionStyle } from './Actions'
import { Icon } from './Icon'
import { MoodBlock } from './mood/MoodBlock'

const PLACE: Record<Place, string> = { home: 'Дома', work: 'На работе', friends: 'С друзьями', road: 'В дороге' }
const TIME: Record<Daytime, string> = { morning: 'Утро', day: 'День', evening: 'Вечер' }

const REVIEW_PREVIEW = 90

const oneDecimal = (n: number) => n.toLocaleString('ru-RU', { maximumFractionDigits: 1 })

function Friends({ cup }: { cup: Cup }) {
  const average = cup.friends.reduce((sum, f) => sum + f.score, 0) / cup.friends.length
  const diff = cup.score - average
  const note = Math.abs(diff) < 0.5 ? 'Оценки почти совпали' : diff > 0 ? `Ты щедрее друзей на ${oneDecimal(diff)}` : `Друзья щедрее тебя на ${oneDecimal(-diff)}`

  return (
    <section className="friends" aria-label="Оценки друзей">
      <div className="bars">
        <span>Ты</span>
        <motion.i initial={{ width: 0 }} animate={{ width: `${cup.score * 10}%` }} transition={{ duration: 1, delay: 0.3 }} />
        <b>{cup.score}</b>
        <span>Друзья</span>
        <motion.i className="alt" initial={{ width: 0 }} animate={{ width: `${average * 10}%` }} transition={{ duration: 1, delay: 0.45 }} />
        <b>{oneDecimal(average)}</b>
      </div>
      <p className="mood-caption">{note}</p>
      <ul className="friend-list">
        {cup.friends.map((f) => (
          <li key={f.name}>
            <span className="avatar">{f.name[0]}</span>
            {f.name} <b>{f.score}</b>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Детали чаепития: настроение радаром, обстоятельства значками, короткий отзыв, друзья, действия. */
export function CupDetails({ cup, actionStyle }: { cup: Cup; actionStyle: ActionStyle }) {
  const [full, setFull] = useState(false)
  const long = cup.review.length > REVIEW_PREVIEW

  return (
    <div className="details">
      <MoodBlock key={cup.id} mood={cup.mood} />

      <ul className="circumstances" aria-label="Обстоятельства">
        <li>
          <Icon name={cup.place} />
          {PLACE[cup.place]}
        </li>
        <li>
          <Icon name={cup.time} />
          {TIME[cup.time]}
        </li>
      </ul>

      <blockquote className="review">
        <p className={full ? '' : 'clamp'}>{cup.review}</p>
        {long && (
          <button className={full ? 'more-chip open' : 'more-chip'} aria-expanded={full} onClick={() => setFull(!full)}>
            {full ? 'Свернуть' : 'Читать целиком'}
            <Icon name="chevron" />
          </button>
        )}
      </blockquote>

      <Friends cup={cup} />

      <Actions style={actionStyle} />
    </div>
  )
}
