"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type AppManifest, type AppState, type AppEventListener, appManager } from "@browseros/core"

// 컨텍스트 타입 정의
interface BrowserOSContextType {
  apps: AppManifest[]
  appStates: Record<string, AppState>
  wallpaper?: string
  launchApp: (appId: string) => void
  closeApp: (appId: string) => void
  minimizeApp: (appId: string) => void
  moveApp: (appId: string, x: number, y: number) => void
  resizeApp: (appId: string, width: number, height: number) => void
  sendMessage: (from: string, to: string, type: string, payload: any) => void
  registerEventListener: (appId: string, listener: AppEventListener) => () => void
}

// 컨텍스트 생성
const BrowserOSContext = createContext<BrowserOSContextType | undefined>(undefined)

// 프로바이더 컴포넌트
export function BrowserOSProvider({ children, wallpaper }: { children: React.ReactNode; wallpaper?: string }) {
  const [apps, setApps] = useState<AppManifest[]>([])
  const [appStates, setAppStates] = useState<Record<string, AppState>>({})

  // 앱 목록 및 상태 업데이트
  const updateAppsAndStates = () => {
    const allApps = appManager.getAllApps()
    setApps(allApps)

    const states: Record<string, AppState> = {}
    for (const app of allApps) {
      states[app.id] = appManager.getAppState(app.id)
    }
    setAppStates(states)
  }

  // 앱 실행
  const launchApp = (appId: string) => {
    appManager.launchApp(appId)
    updateAppsAndStates()
  }

  // 앱 닫기
  const closeApp = (appId: string) => {
    appManager.closeApp(appId)
    updateAppsAndStates()
  }

  // 앱 최소화
  const minimizeApp = (appId: string) => {
    appManager.minimizeApp(appId)
    updateAppsAndStates()
  }

  // 앱 이동
  const moveApp = (appId: string, x: number, y: number) => {
    appManager.moveApp(appId, { x, y })
    updateAppsAndStates()
  }

  // 앱 크기 조정
  const resizeApp = (appId: string, width: number, height: number) => {
    appManager.resizeApp(appId, { width, height })
    updateAppsAndStates()
  }

  // 메시지 전송
  const sendMessage = (from: string, to: string, type: string, payload: any) => {
    appManager.sendMessage(from, to, type, payload)
  }

  // 이벤트 리스너 등록
  const registerEventListener = (appId: string, listener: AppEventListener) => {
    return appManager.addEventListener(appId, listener)
  }

  // 초기화
  useEffect(() => {
    updateAppsAndStates()

    // 앱 상태 변경 감지를 위한 인터벌 설정
    const interval = setInterval(updateAppsAndStates, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <BrowserOSContext.Provider
      value={{
        apps,
        appStates,
        wallpaper,
        launchApp,
        closeApp,
        minimizeApp,
        moveApp,
        resizeApp,
        sendMessage,
        registerEventListener,
      }}
    >
      {children}
    </BrowserOSContext.Provider>
  )
}

// 훅 생성
export function useBrowserOS() {
  const context = useContext(BrowserOSContext)
  if (context === undefined) {
    throw new Error("useBrowserOS must be used within a BrowserOSProvider")
  }
  return context
}
