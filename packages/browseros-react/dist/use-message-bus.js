"use client";
import { useEffect, useCallback } from "react";
import { useBrowserOS } from "./context";
export function useMessageBus(appId, onMessage) {
    const { registerEventListener, sendMessage } = useBrowserOS();
    useEffect(() => {
        if (!onMessage)
            return;
        return registerEventListener(appId, onMessage);
    }, [appId, onMessage, registerEventListener]);
    const send = useCallback((target, type, payload) => {
        sendMessage(appId, target, type, payload);
    }, [appId, sendMessage]);
    return { send };
}
