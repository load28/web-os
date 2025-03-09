export function LoadingScreen() {
  return (
    <div className="flex flex-col h-screen bg-blue-50 overflow-hidden">
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">BrowserOS</h1>
            <p className="text-lg mb-4">로딩 중...</p>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
      <div className="h-12 bg-gray-800"></div>
    </div>
  )
}
