import type { Cup } from './cups'

export function groupByDay(cups: Cup[]): [string, Cup[]][] {
  const days = new Map<string, Cup[]>()
  for (const cup of cups) days.set(cup.day, [...(days.get(cup.day) ?? []), cup])
  return [...days]
}
