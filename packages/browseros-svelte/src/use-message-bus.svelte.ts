import { onDestroy } from 'svelte'
import { messageBus, type AppMessage, type AppMessagePayload } from '@browseros/shared'

// Svelte용 메시지 버스 훅
export function useMessageBus(appId: string, onMessage?: (message: AppMessage) => void) {
  let unsubscribe: (() => void) | undefined

  if (onMessage) {
    unsubscribe = messageBus.subscribe(appId, onMessage)
  }

  onDestroy(() => {
    unsubscribe?.()
  })

  return {
    sendMessage: (target: string | undefined, type: string, payload: AppMessagePayload) => {
      const safePayload = payload ?? {}
      messageBus.publish({
        source: appId,
        target,
        type,
        payload: safePayload,
      })
    },
  }
}
