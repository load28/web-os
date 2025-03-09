"use client"

import { useEffect } from "react"
import { BrowserOSProvider } from "./context"
import { Desktop } from "./desktop"
import { Taskbar } from "./taskbar"
import { AppWindow } from "./app-window"
import { AppLoader } from "./app-loader"
import { useBrowserOS } from "./context"
import { type AppManifest, appManager } from "@browseros/core"

interface BrowserOSProps {
  apps: AppManifest[]
  className?: string
  wallpaper?: string
}

export function BrowserOS({ apps, className = "", wallpaper }: BrowserOSProps) {
  // 앱 등록
  useEffect(() => {
    apps.forEach((app) => {
      appManager.registerApp(app)
    })

    // 컴포넌트 언마운트 시 앱 등록 해제
    return () => {
      apps.forEach((app) => {
        appManager.unregisterApp(app.id)
      })
    }
  }, [apps])

  return (
    <BrowserOSProvider wallpaper={wallpaper}>
      <div className={`flex flex-col h-screen bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden ${className}`}>
        <div className="flex-1 relative">
          <Desktop />
          <WindowManager />
        </div>
        <Taskbar />
      </div>
    </BrowserOSProvider>
  )
}

// 창 관리자 컴포넌트
function WindowManager() {
  const { apps, appStates } = useBrowserOS()

  return (
    <>
      {apps.map((app) => {
        const state = appStates[app.id]
        if (!state || !state.isOpen) return null

        return (
          <AppWindow key={app.id} appId={app.id}>
            <AppLoader app={app} />
          </AppWindow>
        )
      })}
    </>
  )
}
