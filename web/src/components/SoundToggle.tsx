import { motion } from 'motion/react'
import { useState } from 'react'
import { setSound, soundOn } from '../feedback'
import { Icon } from './Icon'

/** Включает и выключает звук сохранения. */
export function SoundToggle() {
  const [on, setOn] = useState(soundOn)

  return (
    <motion.button
      className="round-icon"
      aria-label={on ? 'Выключить звук' : 'Включить звук'}
      aria-pressed={on}
      whileTap={{ scale: 0.88 }}
      onClick={() => {
        setSound(!on)
        setOn(!on)
      }}
    >
      <Icon name={on ? 'sound' : 'mute'} />
    </motion.button>
  )
}
