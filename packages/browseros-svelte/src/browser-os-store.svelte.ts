import { appManager } from '@browseros/core'
import type { AppManifest, AppState, AppEventListener } from '@browseros/core'

// BrowserOS 상태 관리 스토어 (Svelte 5 runes)
export class BrowserOSStore {
  apps = $state<AppManifest[]>([])
  appStates = $state<Record<string, AppState>>({})
  wallpaper = $state<string | undefined>(undefined)

  private intervalId: ReturnType<typeof setInterval> | null = null

  constructor(wallpaper?: string) {
    this.wallpaper = wallpaper
    this.updateAppsAndStates()
    this.intervalId = setInterval(() => this.updateAppsAndStates(), 100)
  }

  private updateAppsAndStates() {
    const allApps = appManager.getAllApps()
    this.apps = allApps

    const states: Record<string, AppState> = {}
    for (const app of allApps) {
      states[app.id] = appManager.getAppState(app.id)
    }
    this.appStates = states
  }

  launchApp(appId: string) {
    appManager.launchApp(appId)
    this.updateAppsAndStates()
  }

  closeApp(appId: string) {
    appManager.closeApp(appId)
    this.updateAppsAndStates()
  }

  minimizeApp(appId: string) {
    appManager.minimizeApp(appId)
    this.updateAppsAndStates()
  }

  moveApp(appId: string, x: number, y: number) {
    appManager.moveApp(appId, { x, y })
    this.updateAppsAndStates()
  }

  resizeApp(appId: string, width: number, height: number) {
    appManager.resizeApp(appId, { width, height })
    this.updateAppsAndStates()
  }

  sendMessage(from: string, to: string, type: string, payload: any) {
    appManager.sendMessage(from, to, type, payload)
  }

  registerEventListener(appId: string, listener: AppEventListener) {
    return appManager.addEventListener(appId, listener)
  }

  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }
}
