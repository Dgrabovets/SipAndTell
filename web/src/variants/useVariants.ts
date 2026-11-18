import { useContext } from 'react'
import { VariantsContext } from './context'

export const useVariants = () => useContext(VariantsContext)
