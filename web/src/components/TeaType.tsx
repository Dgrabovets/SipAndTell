import { TEA_COLOR, type TeaType as Type } from '../data/cups'

export function TeaType({ type }: { type: Type }) {
  return (
    <span className="tea-type" style={{ '--dot': TEA_COLOR[type] } as React.CSSProperties}>
      <span className="tea-dot" aria-hidden />
      {type}
    </span>
  )
}
