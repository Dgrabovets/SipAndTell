import { GlassSheet } from './GlassSheet'

interface Props {
  open: boolean
  onClose: () => void
}

/** Заглушка формы «Выпил»: сама форма рисуется следующим шагом. */
export function DrinkSheet({ open, onClose }: Props) {
  return (
    <GlassSheet open={open} label="Выпил" onClose={onClose}>
      <h2>Что ты пил?</h2>
      <p>Здесь будет форма: чай, оценка, настроение, обстоятельства, отзыв.</p>
    </GlassSheet>
  )
}
