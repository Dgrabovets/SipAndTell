import sdk from '@twa-dev/sdk'

type WebApp = typeof sdk

/** Пакет в сборке Vite отдаёт default вложенным дважды, берём настоящий объект. */
export const webApp: WebApp = (sdk as unknown as { default?: WebApp }).default ?? sdk
