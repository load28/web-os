"use client"
import { useBrowserOS } from "./context"
import { DesktopIcon } from "./desktop-icon"

interface DesktopProps {
  className?: string
}

export function Desktop({ className = "" }: DesktopProps) {
  const { apps, launchApp, wallpaper } = useBrowserOS()

  return (
    <div
      className={`absolute inset-0 p-4 grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] auto-rows-[80px] gap-4 ${className}`}
    >
      {apps.map((app) => (
        <DesktopIcon 
          key={app.id}
          appId={app.id}
          name={app.name}
          icon={app.icon}
          onClick={() => launchApp(app.id)}
        />
      ))}
    </div>
  )
}
