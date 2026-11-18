import { useVariants } from '../variants/useVariants'
import { GlassSheet, type SheetAnimation } from './GlassSheet'

interface Props {
  open: boolean
  onClose: () => void
}

/** Заглушка формы «Выпил»: сама форма рисуется следующим шагом. */
export function DrinkSheet({ open, onClose }: Props) {
  const { variants } = useVariants()

  return (
    <GlassSheet open={open} label="Выпил" animation={variants.sheet as SheetAnimation} onClose={onClose}>
      <h2 className="sheet-title">Что ты пил?</h2>
      <p className="sheet-sub">Здесь будет форма: чай, оценка, настроение, обстоятельства, отзыв.</p>
    </GlassSheet>
  )
}
