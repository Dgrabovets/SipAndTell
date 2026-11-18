import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { VARIANT_GROUPS } from './config'
import { useVariants } from './useVariants'

/** Только для разработки: выбор варианта каждого элемента. */
export function VariantsPanel() {
  const [open, setOpen] = useState(false)
  const { variants, set } = useVariants()

  return (
    <>
      <button className="vp-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        Вид
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="vp" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            {VARIANT_GROUPS.map((group) => (
              <section key={group.key}>
                <h3>{group.title}</h3>
                <div className="vp-options" role="group" aria-label={group.title}>
                  {group.options.map((option) => (
                    <button key={option.id} aria-pressed={variants[group.key] === option.id} onClick={() => set(group.key, option.id)}>
                      {option.label}
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
