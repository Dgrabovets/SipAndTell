import { motion } from 'motion/react'
import type { Cup } from '../data/cups'
import { useVariants } from '../variants/useVariants'

const oneDecimal = (n: number) => n.toLocaleString('ru-RU', { maximumFractionDigits: 1 })

function Bars({ you, friends }: { you: number; friends: number }) {
  return (
    <div className="bars">
      <span>Ты</span>
      <motion.i initial={{ width: 0 }} animate={{ width: `${you * 10}%` }} transition={{ duration: 1, delay: 0.3 }} />
      <b>{you}</b>
      <span>Друзья</span>
      <motion.i className="alt" initial={{ width: 0 }} animate={{ width: `${friends * 10}%` }} transition={{ duration: 1, delay: 0.45 }} />
      <b>{oneDecimal(friends)}</b>
    </div>
  )
}

function Cells({ value, alt, delay }: { value: number; alt?: boolean; delay: number }) {
  return (
    <span className="cells">
      {Array.from({ length: 10 }, (_, i) => (
        <motion.i key={i} className={i < Math.round(value) ? (alt ? 'on alt' : 'on') : ''} initial={{ scale: 0.4, opacity: 0.3 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: delay + i * 0.045, type: 'spring', stiffness: 400, damping: 20 }} />
      ))}
    </span>
  )
}

function Segments({ you, friends }: { you: number; friends: number }) {
  return (
    <div className="bars">
      <span>Ты</span>
      <Cells value={you} delay={0.2} />
      <b>{you}</b>
      <span>Друзья</span>
      <Cells value={friends} alt delay={0.4} />
      <b>{oneDecimal(friends)}</b>
    </div>
  )
}

/** Одна шкала от 0 до 10: два маркера, между ними подсвечена разница. */
function Track({ you, friends }: { you: number; friends: number }) {
  const low = Math.min(you, friends)
  const high = Math.max(you, friends)
  return (
    <div className="track">
      <div className="track-line" />
      <motion.div className="track-diff" initial={{ left: '0%', width: '0%' }} animate={{ left: `${low * 10}%`, width: `${(high - low) * 10}%` }} transition={{ duration: 1, delay: 0.3 }} />
      <motion.span className="track-mark you" initial={{ left: '0%' }} animate={{ left: `${you * 10}%` }} transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.25 }}>
        <i />
        <em>Ты {you}</em>
      </motion.span>
      <motion.span className="track-mark friends" initial={{ left: '0%' }} animate={{ left: `${friends * 10}%` }} transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.4 }}>
        <i />
        <em>Друзья {oneDecimal(friends)}</em>
      </motion.span>
      <div className="track-ticks" aria-hidden>
        <span>0</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  )
}

const BLOCKS = { bars: Bars, segments: Segments, track: Track }

/** Сравнение с друзьями: твоя оценка и средняя оценка друзей тремя способами, ниже подпись и список. */
export function Friends({ cup }: { cup: Cup }) {
  const { variants } = useVariants()
  const average = cup.friends.reduce((sum, f) => sum + f.score, 0) / cup.friends.length
  const diff = cup.score - average
  const note = Math.abs(diff) < 0.5 ? 'Оценки почти совпали' : diff > 0 ? `Ты щедрее друзей на ${oneDecimal(diff)}` : `Друзья щедрее тебя на ${oneDecimal(-diff)}`
  const Block = BLOCKS[variants.friends as keyof typeof BLOCKS]

  return (
    <section className="friends" aria-label="Оценки друзей">
      <Block you={cup.score} friends={average} />
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
