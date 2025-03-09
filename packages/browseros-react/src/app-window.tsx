"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { useBrowserOS } from "./context"

interface AppWindowProps {
  appId: string
  children: React.ReactNode
}

export function AppWindow({ appId, children }: AppWindowProps) {
  const { apps, appStates, closeApp, minimizeApp, moveApp, resizeApp } = useBrowserOS()
  const appState = appStates[appId]
  const app = apps.find((a) => a.id === appId)

  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const windowRef = useRef<HTMLDivElement>(null)
  const [isMovingOrResizing, setIsMovingOrResizing] = useState(false)

  // 앱이 열려있지 않거나 최소화되어 있으면 렌더링하지 않음
  if (!appState || !appState.isOpen || appState.isMinimized || !app) {
    return null
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains("window-titlebar")) {
      setIsDragging(true)
      setIsMovingOrResizing(true)
      setDragStart({
        x: e.clientX - appState.position.x,
        y: e.clientY - appState.position.y,
      })
    }
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true)
    setIsMovingOrResizing(true)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: appState.size.width,
      height: appState.size.height,
    })
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, e.clientX - dragStart.x)
        const newY = Math.max(0, e.clientY - dragStart.y)
        moveApp(appId, newX, newY)
      } else if (isResizing) {
        const newWidth = Math.max(300, resizeStart.width + (e.clientX - resizeStart.x))
        const newHeight = Math.max(200, resizeStart.height + (e.clientY - resizeStart.y))
        resizeApp(appId, newWidth, newHeight)
      }
    },
    [isDragging, isResizing, dragStart, resizeStart, appId, moveApp, resizeApp],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
    setIsMovingOrResizing(false)
  }, [])

  // 이벤트 리스너 등록 및 해제
  useEffect(() => {
    if (isMovingOrResizing) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isMovingOrResizing, handleMouseMove, handleMouseUp])

  return (
    <div
      ref={windowRef}
      className={`absolute rounded-lg shadow-lg overflow-hidden flex flex-col bg-slate-50 backdrop-blur-sm border ${
        appState.isActive ? "z-10 ring-2 ring-blue-500" : "z-0 border-gray-200"
      }`}
      style={{
        left: `${appState.position.x}px`,
        top: `${appState.position.y}px`,
        width: `${appState.size.width}px`,
        height: `${appState.size.height}px`,
      }}
    >
      {/* Window titlebar */}
      <div
        className="window-titlebar flex items-center justify-between px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 border-b cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg text-white">{app.icon}</span>
          <span className="text-sm font-semibold text-white">{app.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-400 transition-colors" onClick={() => minimizeApp(appId)}>
            <span className="flex items-center justify-center w-4 h-4 text-white font-bold">−</span>
          </button>
          <button className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-400 transition-colors" onClick={() => closeApp(appId)}>
            <span className="flex items-center justify-center w-4 h-4 text-white font-bold">×</span>
          </button>
        </div>
      </div>

      {/* Window content */}
      <div className="flex-1 bg-slate-50 overflow-auto text-gray-800 app-window-content">{children}</div>

      {/* Resize handle */}
      <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" onMouseDown={handleResizeMouseDown}>
        <div className="w-0 h-0 border-t-8 border-l-8 border-transparent border-t-gray-300 transform rotate-45 translate-x-1 translate-y-1" />
      </div>
    </div>
  )
}
