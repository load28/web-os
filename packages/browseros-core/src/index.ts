export * from "./types"
export * from "./app-manager"

// 싱글톤 인스턴스 생성
import { BrowserOSAppManager } from "./app-manager"

// appManager 인스턴스만 여기서 생성
export const appManager = new BrowserOSAppManager()
