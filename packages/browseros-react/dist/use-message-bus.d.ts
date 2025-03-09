import type { AppEventListener } from "@browseros/core";
export declare function useMessageBus(appId: string, onMessage?: AppEventListener): {
    send: (target: string, type: string, payload: any) => void;
};
