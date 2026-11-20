import { motion } from 'motion/react'
import { useState, type CSSProperties } from 'react'
import { MoodBlock } from '../components/mood/MoodBlock'
import { TEA_CHART, TEA_COLOR, type Cup, type Daytime, type Place, type TeaType } from '../data/cups'
import { dayKey } from '../data/days'
import { useCups } from '../data/store'

const DAYS = 14
const oneDecimal = (n: number) => n.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const mean = (list: number[]) => list.reduce((a, b) => a + b, 0) / (list.length || 1)

const PLACES: Record<Place, string> = { home: 'Дома', work: 'На работе', friends: 'С друзьями', road: 'В дороге' }
const TIMES: Record<Daytime, string> = { morning: 'Утро', day: 'День', evening: 'Вечер' }
const SHARE_COLORS = ['#f2a33a', '#b78cf5', '#7ed957', '#ff5a8a']

/** Полоска долей: сегменты по числу чашек, под ней подписи с процентами. */
function Share({ items }: { items: { label: string; count: number }[] }) {
  const total = items.reduce((s, i) => s + i.count, 0) || 1
  return (
    <>
      <div className="share" role="img" aria-label={items.map((i) => `${i.label}: ${i.count}`).join(', ')}>
        {items.map((item, k) => (
          <motion.i key={item.label} style={{ background: SHARE_COLORS[k % SHARE_COLORS.length] }} initial={{ flexGrow: 0 }} animate={{ flexGrow: item.count }} transition={{ type: 'spring', stiffness: 100, damping: 16, delay: k * 0.08 }} />
        ))}
      </div>
      <ul className="share-legend">
        {items.map((item, k) => (
          <li key={item.label} style={{ '--c': SHARE_COLORS[k % SHARE_COLORS.length] } as CSSProperties}>
            <i />
            {item.label} <b>{Math.round((item.count / total) * 100)}%</b>
          </li>
        ))}
      </ul>
    </>
  )
}

/** Экран «Графики»: чаепития по дням, оценки по типам, карта настроений, время и места, сравнение с друзьями. */
export function StatsScreen() {
  const cups = useCups()
  const [today] = useState(() => new Date())

  if (cups.length === 0) {
    return (
      <>
        <h1 className="title">Графики</h1>
        <p className="empty">
          <b>Пока нечего показывать</b>
          Выпей первый чай, и здесь появятся графики.
        </p>
      </>
    )
  }

  const days = Array.from({ length: DAYS }, (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - (DAYS - 1 - i)))
  const byDay = days.map((d) => ({ d, cups: cups.filter((c) => dayKey(c.date) === dayKey(d)) }))

  const types = [...new Set(cups.map((c) => c.type))].map((type) => {
    const list = cups.filter((c) => c.type === type)
    return { type, count: list.length, avg: mean(list.map((c) => c.score)) }
  })

  const meanMood = cups[0].mood.map((_, i) => mean(cups.map((c) => c.mood[i])))
  const count = <K extends string>(pick: (c: Cup) => K, labels: Record<K, string>) => (Object.keys(labels) as K[]).map((k) => ({ label: labels[k], count: cups.filter((c) => pick(c) === k).length })).filter((i) => i.count > 0)

  const withFriends = cups.filter((c) => c.friends.length > 0)
  const mine = mean(withFriends.map((c) => c.score))
  const theirs = mean(withFriends.flatMap((c) => c.friends.map((f) => f.score)))
  const diff = mine - theirs

  return (
    <>
      <h1 className="title">Графики</h1>
      <p className="subtitle">Твой чай в цифрах</p>

      <section className="stat-card">
        <h3 className="block-title">Чаепития за две недели</h3>
        <div className="bars14">
          {byDay.map(({ d, cups: list }, k) => (
            <div key={dayKey(d)} className="week-col">
              <span className="week-stack">
                {list.map((c, i) => (
                  <motion.i key={c.id} style={{ background: TEA_CHART[c.type] }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.2 + k * 0.03 + i * 0.05, type: 'spring', stiffness: 300, damping: 20 }} />
                ))}
              </span>
              <small>{d.getDate()}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="stat-card">
        <h3 className="block-title">Средняя оценка по типам</h3>
        {types.map(({ type, count: n, avg }, k) => (
          <div className="type-row" key={type}>
            <span>
              {type} <small>{n}</small>
            </span>
            <span className="eff-track">
              <motion.i style={{ '--c': TEA_CHART[type as TeaType] ?? TEA_COLOR[type as TeaType] } as CSSProperties} initial={{ width: 0 }} animate={{ width: `${avg * 10}%` }} transition={{ type: 'spring', stiffness: 120, damping: 16, delay: k * 0.06 }} />
            </span>
            <b>{oneDecimal(avg)}</b>
          </div>
        ))}
      </section>

      {meanMood.some((v) => v > 0) && (
        <section className="stat-card">
          <h3 className="block-title">Какое у тебя настроение за чаем</h3>
          <MoodBlock mood={meanMood} />
        </section>
      )}

      <section className="stat-card">
        <h3 className="block-title">Когда</h3>
        <Share items={count((c) => c.time, TIMES)} />
        <h3 className="block-title second">Где</h3>
        <Share items={count((c) => c.place, PLACES)} />
      </section>

      {withFriends.length > 0 && (
        <section className="stat-card">
          <h3 className="block-title">Ты и друзья</h3>
          <div className="type-row">
            <span>Ты</span>
            <span className="eff-track">
              <motion.i style={{ '--c': '#f2a33a' } as CSSProperties} initial={{ width: 0 }} animate={{ width: `${mine * 10}%` }} transition={{ type: 'spring', stiffness: 120, damping: 16 }} />
            </span>
            <b>{oneDecimal(mine)}</b>
          </div>
          <div className="type-row">
            <span>Друзья</span>
            <span className="eff-track">
              <motion.i style={{ '--c': '#b78cf5' } as CSSProperties} initial={{ width: 0 }} animate={{ width: `${theirs * 10}%` }} transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.08 }} />
            </span>
            <b>{oneDecimal(theirs)}</b>
          </div>
          <p className="hint-line">{Math.abs(diff) < 0.3 ? 'Оцениваете почти одинаково.' : diff > 0 ? `Ты щедрее друзей на ${oneDecimal(diff)}.` : `Друзья щедрее тебя на ${oneDecimal(-diff)}.`}</p>
        </section>
      )}
    </>
  )
}
