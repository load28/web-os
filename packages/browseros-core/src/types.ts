// 앱 매니페스트 타입 정의
export interface AppManifest {
  id: string
  name: string
  icon: string
  url?: string
  scope?: string
  module?: string
  componentName?: string
}

// 창 위치 및 크기 타입
export interface WindowPosition {
  x: number
  y: number
}

export interface WindowSize {
  width: number
  height: number
}

// 앱 상태 타입
export interface AppState {
  isOpen: boolean
  isMinimized: boolean
  isActive: boolean
  position: WindowPosition
  size: WindowSize
}

// 앱 메시지 타입
export interface AppMessage {
  type: string
  payload: any
  source: string
  target?: string
}

// 앱 이벤트 리스너 타입
export type AppEventListener = (message: AppMessage) => void
