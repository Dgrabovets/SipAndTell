import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { EFFECT_LABELS, TEA_COLOR, type Cup, type Daytime, type Place, type TeaType } from '../data/cups'
import type { DrinkRequest } from '../data/drinkStore'
import { cupStore } from '../data/store'
import { chime, haptics } from '../feedback'
import { AXES } from '../data/moods'
import { useVariants } from '../variants/useVariants'
import { Icon } from './Icon'
import { MoodBlock } from './mood/MoodBlock'

const TEA_TYPES = Object.keys(TEA_COLOR) as TeaType[]
const PLACES: [Place, string][] = [['home', 'Дома'], ['work', 'На работе'], ['friends', 'С друзьями'], ['road', 'В дороге']]
const TIMES: [Daytime, string][] = [['morning', 'Утро'], ['day', 'День'], ['evening', 'Вечер']]

/** Четыре ступени силы для настроений и эффектов: нет, чуть, заметно, сильно. */
const LEVELS = [0, 0.35, 0.65, 0.95]
const levelOf = (v: number) => (v < 0.15 ? 0 : v < 0.5 ? 1 : v < 0.8 ? 2 : 3)

interface Draft {
  name: string
  type: TeaType | null
  score: number | null
  place: Place | null
  time: Daytime | null
  mood: number[]
  effects: number[]
  review: string
}

/** Справка для чая, о котором пока ничего не известно: настоящую даст ИИ после проверки. */
const NEW_ABOUT: Cup['about'] = { origin: '', brew: '', notes: [], text: 'Справку подготовим, когда чай пройдёт проверку.', effect: '', caffeine: '' }

const timeNow = (): Daytime => {
  const h = new Date().getHours()
  return h < 11 ? 'morning' : h < 18 ? 'day' : 'evening'
}

const draftOf = (cup: Cup): Draft => ({ name: cup.name, type: cup.type, score: cup.score, place: cup.place, time: cup.time, mood: cup.mood, effects: cup.effects['Ты'], review: cup.review })

const EMPTY: Draft = { name: '', type: null, score: null, place: null, time: null, mood: AXES.map(() => 0), effects: EFFECT_LABELS.map(() => 0), review: '' }

/** Пока сервера нет, ответ ИИ имитируется: по фото известен только чай, по рассказу всё остальное. */
const FROM_PHOTO: Partial<Draft> = { name: 'Да Хун Пао', type: 'Улун' }
const FROM_VOICE: Partial<Draft> = {
  score: 9,
  place: 'home',
  time: 'evening',
  mood: [0.1, 0.25, 0.3, 0.85, 0, 0.35, 0, 0],
  effects: [0.4, 0.5, 0.9, 0.6, 0.1, 0.7, 0.1],
  review: 'Тёплый, с минеральной ноткой. Заварил шесть раз, к концу почти сладкий.',
}

type Source = 'photo' | 'video' | 'voice'
const STATUS: Record<Source, string> = { photo: 'Смотрю на фото', video: 'Смотрю и слушаю видео', voice: 'Расшифровываю рассказ' }
const RECORD_MS = 2400
/** Самое длинное голосовое: запись сама останавливается. */
const MAX_RECORD_MS = 90_000
const THINK_MS = 1300

const CAPTURE: { id: Source; label: string; icon: string }[] = [
  { id: 'photo', label: 'Фото чая', icon: 'camera' },
  { id: 'video', label: 'Видео', icon: 'video' },
  { id: 'voice', label: 'Голосом', icon: 'mic' },
]

function AiMark({ on }: { on: boolean }) {
  return on ? (
    <span className="ai-mark" title="Заполнил ИИ, можно поправить">
      <Icon name="spark" />
      ИИ
    </span>
  ) : null
}

/** Ряд значков, который по тапу меняет ступень силы по кругу. */
function LevelChips({ labels, values, colors, onChange }: { labels: string[]; values: number[]; colors?: string[]; onChange: (i: number, v: number) => void }) {
  return (
    <div className="level-grid">
      {labels.map((label, i) => {
        const level = levelOf(values[i])
        return (
          <button key={label} className="level-chip" aria-label={`${label}, ступень ${level} из 3`} style={{ '--c': colors?.[i] ?? 'var(--primary)' } as CSSProperties} onClick={() => onChange(i, LEVELS[(level + 1) % 4])}>
            <span>{label}</span>
            <i aria-hidden>
              {[1, 2, 3].map((n) => (
                <b key={n} className={n <= level ? 'on' : ''} />
              ))}
            </i>
          </button>
        )
      })}
    </div>
  )
}

/** Форма «Выпил»: съёмка и рассказ заполняют поля, человек правит. Вид кнопок съёмки выбирается в панели «Вид». */
export function DrinkForm({ seed, target, onDone }: { seed?: DrinkRequest['seed']; target?: Cup; onDone: () => void }) {
  const { variants } = useVariants()
  const style = variants.capture
  const [draft, setDraft] = useState<Draft>(() => (target ? draftOf(target) : { ...EMPTY, ...seed }))
  const [ai, setAi] = useState<Set<keyof Draft>>(new Set())
  const [phase, setPhase] = useState<'idle' | 'recording' | 'thinking'>('idle')
  const [source, setSource] = useState<Source>('photo')
  const [preview, setPreview] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const filled = ai.size > 0

  /** Сохранение: правка меняет чашку, новая добавляется. Справка берётся у уже известного чая с тем же названием. */
  const save = () => {
    const known = cupStore.known(draft.name)
    const fields = {
      name: draft.name.trim(),
      type: draft.type!,
      score: draft.score!,
      mood: draft.mood,
      place: draft.place ?? 'home',
      time: draft.time ?? timeNow(),
      review: draft.review,
    }
    if (target) cupStore.update({ ...target, ...fields, effects: { ...target.effects, Ты: draft.effects } })
    else cupStore.add({ ...fields, friends: [], date: new Date(), about: known?.about ?? NEW_ABOUT, effects: { Ты: draft.effects } })
    haptics.success()
    chime()
    onDone()
  }

  useEffect(() => () => clearTimeout(timer.current), [])

  const edit = (patch: Partial<Draft>) => {
    setDraft((d) => ({ ...d, ...patch }))
    // Поправленное руками поле больше не считается заполненным ИИ.
    setAi((s) => {
      const next = new Set(s)
      for (const k of Object.keys(patch) as (keyof Draft)[]) next.delete(k)
      return next
    })
  }

  const apply = (patch: Partial<Draft>) => {
    setDraft((d) => ({ ...d, ...patch }))
    setAi((s) => new Set([...s, ...(Object.keys(patch) as (keyof Draft)[])]))
  }

  /** Имитация ответа ИИ: коротко «думаем», потом заполняем поля. */
  const analyse = (from: Source) => {
    setSource(from)
    setPhase('thinking')
    timer.current = setTimeout(() => {
      if (from !== 'voice') apply(FROM_PHOTO)
      if (from !== 'photo') apply(FROM_VOICE)
      setPhase('idle')
    }, THINK_MS)
  }

  const pickFile = (from: Source, file: File | undefined) => {
    if (!file) return
    setPreview(from === 'photo' ? URL.createObjectURL(file) : null)
    analyse(from)
  }

  const recorder = useRef<MediaRecorder>(undefined)

  /** Настоящая запись с микрофона: нажал, говоришь, нажал ещё раз. Звук нигде не сохраняется, после остановки
   *  идёт имитация расшифровки. Если микрофон недоступен, работает короткая имитация записи. */
  const record = async () => {
    if (phase === 'recording') {
      if (recorder.current?.state === 'recording') recorder.current.stop()
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const media = new MediaRecorder(stream)
      media.onstop = () => {
        clearTimeout(timer.current)
        stream.getTracks().forEach((t) => t.stop())
        analyse('voice')
      }
      media.start()
      recorder.current = media
      setPhase('recording')
      timer.current = setTimeout(() => media.stop(), MAX_RECORD_MS)
    } catch {
      recorder.current = undefined
      setPhase('recording')
      timer.current = setTimeout(() => analyse('voice'), RECORD_MS)
    }
  }

  const capture = (
    <div className="cap" data-style={style} data-filled={filled} role="group" aria-label="Заполнить по фото, видео или рассказу">
      {CAPTURE.map((c) =>
        c.id === 'voice' ? (
          <motion.button key={c.id} className={phase === 'recording' ? 'cap-btn cap-voice rec' : 'cap-btn cap-voice'} whileTap={{ scale: 0.94 }} onClick={record} disabled={phase === 'thinking'}>
            <Icon name={c.icon} />
            <span>{phase === 'recording' ? 'Стоп' : c.label}</span>
          </motion.button>
        ) : (
          <motion.label key={c.id} className="cap-btn" whileTap={{ scale: 0.94 }}>
            <input type="file" hidden accept={c.id === 'photo' ? 'image/*' : 'video/*'} capture={c.id === 'photo' ? 'environment' : undefined} disabled={phase !== 'idle'} onChange={(e) => pickFile(c.id, e.target.files?.[0])} />
            <Icon name={c.icon} />
            <span>{c.label}</span>
          </motion.label>
        ),
      )}
    </div>
  )

  return (
    <div className="drink-form">
      <h2 className="sheet-title">{target ? 'Правка чаепития' : 'Что ты пил?'}</h2>
      {style !== 'dock' && capture}

      <AnimatePresence>
        {phase !== 'idle' && (
          <motion.p className="cap-status" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <span className="cap-dots" aria-hidden>
              <i />
              <i />
              <i />
            </span>
            {phase === 'recording' ? 'Записываю, расскажи про чай' : STATUS[source]}
          </motion.p>
        )}
      </AnimatePresence>
      {preview && <img className="cap-preview" src={preview} alt="Фото чая" />}

      <section className="field">
        <h3 className="block-title">
          Чай <AiMark on={ai.has('name') || ai.has('type')} />
        </h3>
        <input className="text-input" placeholder="Название" value={draft.name} onChange={(e) => edit({ name: e.target.value })} />
        <div className="chips-row" role="group" aria-label="Тип чая">
          {TEA_TYPES.map((t) => (
            <button key={t} className="chip tinted pick" aria-pressed={draft.type === t} style={{ '--tint': TEA_COLOR[t] } as CSSProperties} onClick={() => edit({ type: t })}>
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="field">
        <h3 className="block-title">
          Оценка <AiMark on={ai.has('score')} />
        </h3>
        <div className="score-row" role="group" aria-label="Оценка из десяти">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button key={n} aria-pressed={draft.score === n} onClick={() => edit({ score: n })}>
              {n}
            </button>
          ))}
        </div>
      </section>

      <section className="field">
        <h3 className="block-title">
          Обстоятельства <AiMark on={ai.has('place') || ai.has('time')} />
        </h3>
        <div className="chips-row" role="group" aria-label="Где">
          {PLACES.map(([id, label]) => (
            <button key={id} className="chip pick" aria-pressed={draft.place === id} onClick={() => edit({ place: id })}>
              {label}
            </button>
          ))}
        </div>
        <div className="chips-row" role="group" aria-label="Когда">
          {TIMES.map(([id, label]) => (
            <button key={id} className="chip pick" aria-pressed={draft.time === id} onClick={() => edit({ time: id })}>
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="field">
        <h3 className="block-title">
          Настроение <AiMark on={ai.has('mood')} />
        </h3>
        <LevelChips labels={AXES.map((a) => a.label)} colors={AXES.map((a) => a.color)} values={draft.mood} onChange={(i, v) => edit({ mood: draft.mood.map((x, k) => (k === i ? v : x)) })} />
        {draft.mood.some((v) => v > 0) ? <MoodBlock mood={draft.mood} /> : <p className="hint-line">Отметь, что чувствуешь, и появится радар.</p>}
      </section>

      <section className="field">
        <h3 className="block-title">
          Как подействовал <AiMark on={ai.has('effects')} />
        </h3>
        <LevelChips labels={EFFECT_LABELS} values={draft.effects} onChange={(i, v) => edit({ effects: draft.effects.map((x, k) => (k === i ? v : x)) })} />
      </section>

      <section className="field">
        <h3 className="block-title">
          Отзыв <AiMark on={ai.has('review')} />
        </h3>
        <textarea className="text-input" rows={3} placeholder="Своими словами" value={draft.review} onChange={(e) => edit({ review: e.target.value })} />
      </section>

      {style === 'dock' && capture}

      <motion.button className="save-btn" whileTap={{ scale: 0.97 }} disabled={!draft.name.trim() || !draft.type || draft.score === null} onClick={save}>
        {target ? 'Сохранить правку' : 'Сохранить'}
      </motion.button>
    </div>
  )
}
