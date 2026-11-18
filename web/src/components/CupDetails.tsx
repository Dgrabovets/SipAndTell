import { motion } from 'motion/react'
import { useState } from 'react'
import type { Cup, Daytime, Place } from '../data/cups'
import { Icon } from './Icon'
import { MoodBlock, type MoodStyle } from './mood/MoodBlock'

const PLACE: Record<Place, string> = { home: 'Дома', work: 'На работе', friends: 'С друзьями', road: 'В дороге' }
const TIME: Record<Daytime, string> = { morning: 'Утро', day: 'День', evening: 'Вечер' }

const REVIEW_PREVIEW = 90

function Friends({ cup }: { cup: Cup }) {
  const average = cup.friends.reduce((sum, f) => sum + f.score, 0) / cup.friends.length
  const diff = cup.score - average
  const note = Math.abs(diff) < 0.5 ? 'Ваши оценки совпали' : diff > 0 ? `Ты поставил на ${diff.toFixed(1)} выше` : `Друзья поставили на ${(-diff).toFixed(1)} выше`

  return (
    <section className="friends" aria-label="Оценки друзей">
      <div className="bars">
        <span>Ты</span>
        <motion.i initial={{ width: 0 }} animate={{ width: `${cup.score * 10}%` }} transition={{ duration: 1, delay: 0.3 }} />
        <b>{cup.score}</b>
        <span>Друзья</span>
        <motion.i className="alt" initial={{ width: 0 }} animate={{ width: `${average * 10}%` }} transition={{ duration: 1, delay: 0.45 }} />
        <b>{average.toFixed(1)}</b>
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

/** Детали чаепития: настроение шестиугольником, обстоятельства значками, короткий отзыв, друзья. */
export function CupDetails({ cup, moodStyle }: { cup: Cup; moodStyle: MoodStyle }) {
  const [full, setFull] = useState(false)
  const long = cup.review.length > REVIEW_PREVIEW

  return (
    <div className="details">
      <MoodBlock key={cup.id + moodStyle} mood={cup.mood} style={moodStyle} />

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
          <button className="text-btn" onClick={() => setFull(!full)}>
            {full ? 'Свернуть' : 'Читать дальше'}
          </button>
        )}
      </blockquote>

      <Friends cup={cup} />

      <div className="actions">
        <button className="glass-btn">Выпить ещё раз</button>
        <button className="text-btn">Изменить</button>
      </div>
    </div>
  )
}
