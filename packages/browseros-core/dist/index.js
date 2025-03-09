export * from "./types";
export * from "./app-manager";
export * from "./app-loader";
// 싱글톤 인스턴스 생성
import { BrowserOSAppManager } from "./app-manager";
import { BrowserOSAppLoader } from "./app-loader";
export const appManager = new BrowserOSAppManager();
export const appLoader = new BrowserOSAppLoader();
