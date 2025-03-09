import type React from "react";
import { type AppManifest, type AppState, type AppEventListener } from "@browseros/core";
interface BrowserOSContextType {
    apps: AppManifest[];
    appStates: Record<string, AppState>;
    launchApp: (appId: string) => void;
    closeApp: (appId: string) => void;
    minimizeApp: (appId: string) => void;
    moveApp: (appId: string, x: number, y: number) => void;
    resizeApp: (appId: string, width: number, height: number) => void;
    sendMessage: (from: string, to: string, type: string, payload: any) => void;
    registerEventListener: (appId: string, listener: AppEventListener) => () => void;
}
export declare function BrowserOSProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useBrowserOS(): BrowserOSContextType;
export {};
