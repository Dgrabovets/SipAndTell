---
name: telegram-miniapp-ui
description: >-
  Use when building or changing a Telegram Mini App screen, layout, or
  interaction: adaptive mobile UI, visual hierarchy, touch targets, safe
  areas, theme, or a slow first paint. Use for Mini App, Telegram Web App,
  адаптивную вёрстку, внешний вид экрана и отзывчивый интерфейс.
---

# Telegram Mini App UI

The Mini App is a phone page inside Telegram. One thumb, one column, the primary action visible without scrolling.

## Layout

- Design at 360px wide first. Stretch the same column up to 480px. Do not add a desktop sidebar.
- Use `100dvh` and Telegram `safe-area` insets. Do not size the screen with `100vh`.
- Keep type at 16px or larger for anything the person types. Inputs below 16px make iOS zoom the page.
- Touch targets are at least 44px. Gap between two targets is at least 8px.
- The primary action sits in the lower third or in Telegram `MainButton`. A second action is a text button, not a second filled button of the same weight.
- No action exists only on hover. Hover is not available on a phone.

## Look

- Take background, text, button, and hint colors from Telegram `themeParams`. Support the dark theme the client is already in.
- Use one typeface already on the phone. Do not load a webfont on the first screen.
- One accent color for the primary action. Status (unconfirmed card, AI-filled field) uses a short text label plus a quiet mark, not color alone.
- A card is a name, a type, and one number. Everything else is behind one disclosure.
- Empty, loading, and error states are designed with the screen, not added after.

## Speed

- The first screen shows search and the camera action before any catalog request finishes. Use a stable skeleton the same size as the result row. Do not use a full-screen spinner.
- Photos have a fixed ratio so the page does not jump.
- Do not wait on geolocation, AI, or a review draft before the person can tap «Пил».
- Route changes and the drink sheet open on the same frame the finger lifts. A network call starts after the sheet is visible.
- Keep the first JavaScript bundle free of chat, map tiles, and the learning page. Load those when the person opens them.

## Telegram shell

- Read the user and colors through `@twa-dev/sdk`.
- Call `ready()` after the first screen can be seen.
- Use `BackButton` when a sheet is open. Do not invent a second back arrow.
- Expand to full height. Do not show the page inside a nested scroll box unless the list itself scrolls.
- Haptics only on a successful «Пил» and on a destructive confirm.
