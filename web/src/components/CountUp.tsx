import { animate } from 'motion/react'
import { useEffect, useState } from 'react'

/** Число, которое набегает от нуля. */
export function CountUp({ to, delay = 0 }: { to: number; delay?: number }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const controls = animate(0, to, { duration: 0.9, delay, ease: 'easeOut', onUpdate: (v) => setValue(Math.round(v)) })
    return () => controls.stop()
  }, [to, delay])

  return <>{value}</>
}
