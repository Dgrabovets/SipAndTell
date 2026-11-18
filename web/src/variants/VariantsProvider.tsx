import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_VARIANTS, VARIANT_GROUPS, type VariantKey, type Variants } from './config'
import { VariantsContext } from './context'

const STORAGE_KEY = 'sipandtell.variants.v2'

/** Берём из хранилища только то, что ещё есть в конфиге: удалённые варианты не должны ломать экран. */
function load(): Variants {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    const valid = Object.fromEntries(VARIANT_GROUPS.filter((g) => g.options.some((o) => o.id === saved[g.key])).map((g) => [g.key, saved[g.key]]))
    return { ...DEFAULT_VARIANTS, ...valid }
  } catch {
    return DEFAULT_VARIANTS
  }
}

export function VariantsProvider({ children }: { children: ReactNode }) {
  const [variants, setVariants] = useState<Variants>(load)

  useEffect(() => {
    // Выбор запоминаем, чтобы он пережил перезагрузку страницы. Без хранилища всё работает как есть.
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(variants))
    } catch {
      /* хранилище недоступно */
    }
  }, [variants])

  // Выбор виден CSS: html[data-label-font='manrope'] и так далее.
  useEffect(() => {
    for (const [key, id] of Object.entries(variants)) document.documentElement.dataset[key] = id
  }, [variants])

  const value = useMemo(() => ({ variants, set: (key: VariantKey, id: string) => setVariants((v) => ({ ...v, [key]: id })) }), [variants])
  return <VariantsContext.Provider value={value}>{children}</VariantsContext.Provider>
}
