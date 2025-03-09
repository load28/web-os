"use client"
import { useBrowserOS } from "./context"

interface TaskbarProps {
  className?: string
}

export function Taskbar({ className = "" }: TaskbarProps) {
  const { apps, appStates, launchApp } = useBrowserOS()

  return (
    <div className={`flex items-center h-12 px-2 bg-gradient-to-r from-blue-800 to-indigo-900 border-t border-indigo-950 shadow-lg ${className}`}>
      <div className="flex items-center gap-1">
        {apps.map((app) => {
          const state = appStates[app.id]
          const isOpen = state?.isOpen || false
          const isActive = state?.isActive || false

          return (
            <button
              key={app.id}
              className={`flex items-center justify-center w-10 h-10 rounded-md transition-colors ${
                isActive
                  ? "bg-blue-500 text-white"
                  : isOpen
                    ? "bg-blue-700 text-white"
                    : "bg-transparent text-gray-300 hover:bg-blue-800"
              }`}
              onClick={() => launchApp(app.id)}
            >
              <span className="w-5 h-5">{app.icon}</span>
            </button>
          )
        })}
      </div>
      <div className="ml-auto text-xs font-semibold text-blue-300 px-2 flex items-center">
        <span className="mr-1 text-sm bg-blue-600 p-1 rounded-full text-white">🌐</span>
        BrowserOS
      </div>
    </div>
  )
}
