import { motion } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'

/** Обёртка, которая плавно меняет высоту вслед за содержимым. Нужна там, где число карточек
 *  или длина текста меняется: шторка не прыгает, а тихо подстраивается. */
export function Smooth({ children }: { children: ReactNode }) {
  const inner = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | 'auto'>('auto')

  useEffect(() => {
    const el = inner.current
    if (!el) return
    const watch = new ResizeObserver(() => setHeight(el.offsetHeight))
    watch.observe(el)
    return () => watch.disconnect()
  }, [])

  return (
    <motion.div className="smooth" initial={false} animate={{ height }} transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}>
      <div ref={inner} className="smooth-inner">
        {children}
      </div>
    </motion.div>
  )
}
