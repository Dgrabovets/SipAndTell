import { motion } from 'motion/react'
import { useState, type CSSProperties } from 'react'
import { Icon } from '../components/Icon'
import type { Cup } from '../data/cups'
import { useCups } from '../data/store'

/** Ссылка-приглашение. Пока бота нет, это заготовка: когда он появится, сервер выдаст настоящую со своим кодом. */
const INVITE = 'https://t.me/имя_бота?start=ваш_код'

const oneDecimal = (n: number) => n.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

interface FriendRow {
  name: string
  color: string
  shared: number
  mine: number
  theirs: number
  last: Cup
}

/** Друзья, собранные из оценок на чашках: сколько общих чаёв и как отличаются средние оценки. */
function friendsOf(cups: Cup[]): FriendRow[] {
  const rows = new Map<string, { color: string; pairs: { cup: Cup; theirs: number }[] }>()
  for (const cup of cups) {
    for (const f of cup.friends) {
      const row = rows.get(f.name) ?? { color: f.color, pairs: [] }
      row.pairs.push({ cup, theirs: f.score })
      rows.set(f.name, row)
    }
  }
  return [...rows].map(([name, { color, pairs }]) => ({
    name,
    color,
    shared: pairs.length,
    mine: pairs.reduce((s, p) => s + p.cup.score, 0) / pairs.length,
    theirs: pairs.reduce((s, p) => s + p.theirs, 0) / pairs.length,
    last: pairs[0].cup,
  }))
}

/** Экран «Друзья»: приглашение по ссылке и сравнение средних оценок с каждым другом. */
export function FriendsScreen() {
  const friends = friendsOf(useCups())
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INVITE)
    } catch {
      /* буфер недоступен, ссылку видно на экране */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <h1 className="title">Друзья</h1>
      <p className="subtitle">Сравни, кто как оценивает чай</p>

      <motion.button className="glass-btn primary invite" whileTap={{ scale: 0.96 }} onClick={copy}>
        <Icon name="share" />
        {copied ? 'Ссылка скопирована' : 'Пригласить друга'}
      </motion.button>
      <p className="hint-line invite-link">{INVITE}</p>

      {friends.length === 0 && (
        <p className="empty">
          <b>Здесь пока никого нет</b>
          Отправь другу ссылку, и вы увидите оценки друг друга.
        </p>
      )}

      <ul className="list friend-cards">
        {friends.map((f, i) => {
          const diff = f.mine - f.theirs
          return (
            <motion.li key={f.name} className="friend-card" style={{ '--c': f.color } as CSSProperties} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.08, type: 'spring', stiffness: 260, damping: 24 }}>
              <span className="friend-avatar">{f.name[0]}</span>
              <div className="friend-body">
                <b>{f.name}</b>
                <small>
                  Общих чаёв: {f.shared}. Последний: {f.last.name}
                </small>
                <div className="friend-bars" aria-label={`Средняя оценка: ты ${oneDecimal(f.mine)}, ${f.name} ${oneDecimal(f.theirs)}`}>
                  <span>
                    <motion.i className="you" initial={{ width: 0 }} animate={{ width: `${f.mine * 10}%` }} transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.2 }} />
                    <em>{oneDecimal(f.mine)}</em>
                  </span>
                  <span>
                    <motion.i initial={{ width: 0 }} animate={{ width: `${f.theirs * 10}%` }} transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.3 }} />
                    <em>{oneDecimal(f.theirs)}</em>
                  </span>
                </div>
                <small>{Math.abs(diff) < 0.5 ? 'Оцениваете почти одинаково' : diff > 0 ? `Ты щедрее на ${oneDecimal(diff)}` : `${f.name} щедрее на ${oneDecimal(-diff)}`}</small>
              </div>
            </motion.li>
          )
        })}
      </ul>
    </>
  )
}
