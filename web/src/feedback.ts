import { webApp } from './telegram'

const SOUND_KEY = 'sipandtell.sound'

/** Вибрация Telegram: только на успешное «Выпил» и на подтверждённое удаление. Вне Telegram ничего не делает. */
export const haptics = {
  success() {
    try {
      webApp.HapticFeedback.notificationOccurred('success')
    } catch {
      /* вне Telegram вибрации нет */
    }
  },
  warning() {
    try {
      webApp.HapticFeedback.notificationOccurred('warning')
    } catch {
      /* вне Telegram вибрации нет */
    }
  },
}

/** Звук включён, если его не выключали. Выбор помнится в браузере. */
export function soundOn(): boolean {
  try {
    return localStorage.getItem(SOUND_KEY) !== 'off'
  } catch {
    return true
  }
}

export function setSound(on: boolean) {
  try {
    localStorage.setItem(SOUND_KEY, on ? 'on' : 'off')
  } catch {
    /* без хранилища выбор живёт до перезагрузки */
  }
}

let audio: AudioContext | undefined

/** Мягкий двойной звонок при сохранении: две тихие ноты, синтезируются на месте, файлов нет. */
export function chime() {
  if (!soundOn()) return
  try {
    audio ??= new AudioContext()
    const now = audio.currentTime
    for (const [i, hz] of [660, 880].entries()) {
      const osc = audio.createOscillator()
      const gain = audio.createGain()
      osc.type = 'sine'
      osc.frequency.value = hz
      gain.gain.setValueAtTime(0.0001, now + i * 0.12)
      gain.gain.exponentialRampToValueAtTime(0.08, now + i * 0.12 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.5)
      osc.connect(gain).connect(audio.destination)
      osc.start(now + i * 0.12)
      osc.stop(now + i * 0.12 + 0.55)
    }
  } catch {
    /* звук недоступен */
  }
}
