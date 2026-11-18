import { CupCard } from '../components/CupCard'
import { CUPS } from '../data/cups'

/** Вариант C: сводка недели сверху, список ниже. */
export function HomeC() {
  const average = (CUPS.reduce((sum, c) => sum + c.score, 0) / CUPS.length).toFixed(1)

  return (
    <>
      <h1 className="title">Привет, чаёвник</h1>
      <p className="subtitle">Твоя неделя в чае</p>
      <div className="stats">
        <div className="stat">
          <b>{CUPS.length}</b>
          <span>чаепитий</span>
        </div>
        <div className="stat">
          <b>{average}</b>
          <span>средняя оценка</span>
        </div>
        <div className="stat">
          <b>Улун</b>
          <span>любимый тип</span>
        </div>
      </div>
      <h2 className="day-label">Последние</h2>
      <ul className="list">
        {CUPS.map((cup) => (
          <CupCard key={cup.id} cup={cup} />
        ))}
      </ul>
    </>
  )
}
