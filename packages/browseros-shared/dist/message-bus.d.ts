export interface AppMessagePayload {
    [key: string]: any;
    content?: string;
    text?: string;
}
export interface AppMessage {
    type: string;
    payload: AppMessagePayload;
    source: string;
    target?: string;
}
declare class MessageBus {
    private listeners;
    subscribe(appId: string, callback: (message: AppMessage) => void): () => void;
    publish(message: AppMessage): void;
    private safeClone;
}
export declare const messageBus: MessageBus;
export declare function useMessageBus(appId: string, onMessage?: (message: AppMessage) => void): {
    sendMessage: (target: string | undefined, type: string, payload: AppMessagePayload) => void;
};
export {};
