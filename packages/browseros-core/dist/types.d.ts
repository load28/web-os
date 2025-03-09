export interface AppManifest {
    id: string;
    name: string;
    icon: string;
    url?: string;
    scope?: string;
    module?: string;
    componentName?: string;
}
export interface WindowPosition {
    x: number;
    y: number;
}
export interface WindowSize {
    width: number;
    height: number;
}
export interface AppState {
    isOpen: boolean;
    isMinimized: boolean;
    isActive: boolean;
    position: WindowPosition;
    size: WindowSize;
}
export interface AppMessage {
    type: string;
    payload: any;
    source: string;
    target?: string;
}
export type AppEventListener = (message: AppMessage) => void;
