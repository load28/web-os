"use client"

interface DesktopIconProps {
  appId: string
  name: string
  icon: string
  onClick: () => void
}

export function DesktopIcon({ appId, name, icon, onClick }: DesktopIconProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-1 p-2 rounded cursor-pointer hover:bg-blue-100/50 transition-colors duration-200"
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-sm border border-blue-100 text-lg">
        <span className="text-blue-600">{icon}</span>
      </div>
      <span className="text-xs font-medium text-center text-gray-800">{name}</span>
    </div>
  )
}
