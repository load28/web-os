import type { AppManifest, AppState, AppEventListener, WindowPosition, WindowSize } from "./types";
export declare class BrowserOSAppManager {
    private apps;
    private appStates;
    private eventListeners;
    registerApp(app: AppManifest): void;
    unregisterApp(appId: string): void;
    getApp(appId: string): AppManifest | undefined;
    getAllApps(): AppManifest[];
    getAppState(appId: string): AppState;
    setAppState(appId: string, state: Partial<AppState>): void;
    launchApp(appId: string): void;
    closeApp(appId: string): void;
    minimizeApp(appId: string): void;
    moveApp(appId: string, position: WindowPosition): void;
    resizeApp(appId: string, size: WindowSize): void;
    addEventListener(appId: string, listener: AppEventListener): () => void;
    sendMessage(from: string, to: string, type: string, payload: any): void;
}
