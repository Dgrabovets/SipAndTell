import { createContext } from 'react'
import { DEFAULT_VARIANTS, type VariantKey, type Variants } from './config'

export interface VariantsCtx {
  variants: Variants
  set: (key: VariantKey, id: string) => void
}

export const VariantsContext = createContext<VariantsCtx>({ variants: DEFAULT_VARIANTS, set: () => {} })
