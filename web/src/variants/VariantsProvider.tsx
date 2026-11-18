import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_VARIANTS, type VariantKey, type Variants } from './config'
import { VariantsContext } from './context'

const STORAGE_KEY = 'sipandtell.variants'

function load(): Variants {
  try {
    return { ...DEFAULT_VARIANTS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') }
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
    document.documentElement.dataset.drink = variants.drink
    document.documentElement.dataset.nav = variants.nav
  }, [variants])

  const value = useMemo(() => ({ variants, set: (key: VariantKey, id: string) => setVariants((v) => ({ ...v, [key]: id })) }), [variants])
  return <VariantsContext.Provider value={value}>{children}</VariantsContext.Provider>
}
