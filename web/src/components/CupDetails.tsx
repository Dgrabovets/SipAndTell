import { motion } from 'motion/react'
import { useState } from 'react'
import type { Cup, Daytime, Place } from '../data/cups'
import { useVariants } from '../variants/useVariants'
import { Actions } from './Actions'
import { Icon } from './Icon'
import { MoodBlock } from './mood/MoodBlock'

const PLACE: Record<Place, string> = { home: 'Дома', work: 'На работе', friends: 'С друзьями', road: 'В дороге' }
const TIME: Record<Daytime, string> = { morning: 'Утро', day: 'День', evening: 'Вечер' }

const REVIEW_PREVIEW = 90
const RING = 20
const CIRCUMFERENCE = 2 * Math.PI * RING

const oneDecimal = (n: number) => n.toLocaleString('ru-RU', { maximumFractionDigits: 1 })

function Ring({ name, score, delay }: { name: string; score: number; delay: number }) {
  return (
    <li className="ring-friend">
      <span className="ring-avatar">
        <svg viewBox="-24 -24 48 48" aria-hidden>
          <circle className="ring-track" r={RING} />
          <motion.circle className="ring-fill" r={RING} strokeDasharray={CIRCUMFERENCE} initial={{ strokeDashoffset: CIRCUMFERENCE }} animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - score / 10) }} transition={{ duration: 1, delay }} />
        </svg>
        <b>{name[0]}</b>
      </span>
      <span>
        {name} <b>{score}</b>
      </span>
    </li>
  )
}

function Friends({ cup }: { cup: Cup }) {
  const { variants } = useVariants()
  const average = cup.friends.reduce((sum, f) => sum + f.score, 0) / cup.friends.length
  const diff = cup.score - average
  const note = Math.abs(diff) < 0.5 ? 'Оценки почти совпали' : diff > 0 ? `Ты щедрее друзей на ${oneDecimal(diff)}` : `Друзья щедрее тебя на ${oneDecimal(-diff)}`

  if (variants.friends === 'avatars') {
    return (
      <section className="friends" aria-label="Оценки друзей">
        <ul className="ring-list">
          <Ring name="Ты" score={cup.score} delay={0.2} />
          {cup.friends.map((f, i) => (
            <Ring key={f.name} name={f.name} score={f.score} delay={0.35 + i * 0.12} />
          ))}
        </ul>
        <p className="mood-caption">{note}</p>
      </section>
    )
  }

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

function Circumstances({ cup }: { cup: Cup }) {
  const { variants } = useVariants()
  const items = [
    { icon: cup.place, label: PLACE[cup.place] },
    { icon: cup.time, label: TIME[cup.time] },
  ]

  if (variants.place === 'row') {
    return (
      <ul className="circ-row" aria-label="Обстоятельства">
        {items.map((item) => (
          <li key={item.label}>
            <Icon name={item.icon} />
            {item.label}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul className="circumstances" aria-label="Обстоятельства">
      {items.map((item) => (
        <li key={item.label}>
          <Icon name={item.icon} />
          {item.label}
        </li>
      ))}
    </ul>
  )
}

/** Детали чаепития: настроение радаром, обстоятельства, короткий отзыв, друзья, действия. */
export function CupDetails({ cup }: { cup: Cup }) {
  const [full, setFull] = useState(false)
  const long = cup.review.length > REVIEW_PREVIEW

  return (
    <div className="details">
      <MoodBlock key={cup.id} mood={cup.mood} />
      <Circumstances cup={cup} />

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
      <Actions />
    </div>
  )
}
