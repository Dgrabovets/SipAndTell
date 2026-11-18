import { CupCard } from '../components/CupCard'
import { CUPS } from '../data/cups'
import { groupByDay } from '../data/groupByDay'

/** Вариант A: спокойная лента по дням. */
export function HomeA() {
  return (
    <>
      <h1 className="title">Мой чайный дневник</h1>
      <p className="subtitle">14 чаепитий в этом месяце</p>
      {groupByDay(CUPS).map(([day, cups]) => (
        <section key={day}>
          <h2 className="day-label">{day}</h2>
          <ul className="list">
            {cups.map((cup) => (
              <CupCard key={cup.id} cup={cup} />
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}
