"use client"

import { useEffect, useCallback } from "react"
import { useBrowserOS } from "./context"
import type { AppEventListener } from "@browseros/core"

export function useMessageBus(appId: string, onMessage?: AppEventListener) {
  const { registerEventListener, sendMessage } = useBrowserOS()

  useEffect(() => {
    if (!onMessage) return
    return registerEventListener(appId, onMessage)
  }, [appId, onMessage, registerEventListener])

  const send = useCallback(
    (target: string, type: string, payload: any) => {
      sendMessage(appId, target, type, payload)
    },
    [appId, sendMessage],
  )

  return { send }
}
