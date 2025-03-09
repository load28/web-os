import { useState, useEffect } from 'react'
import { BrowserOS, registerAppComponent } from '@browseros/react'
import { LoadingScreen } from './components/LoadingScreen'
import type { AppManifest } from '@browseros/core'

// 폰트 및 글로벌 스타일 적용
import './index.css'

// 앱 컴포넌트들 임포트
import { NoteApp } from './components/apps/NoteApp'
import { TodoApp } from './components/apps/TodoApp'

// 앱 컴포넌트 등록
registerAppComponent("NoteApp", NoteApp);
registerAppComponent("TodoApp", TodoApp);

// 앱 매니페스트 정의
const appManifests: AppManifest[] = [
  {
    id: "note-app",
    name: "Notes",
    icon: "📝",
    componentName: "NoteApp"
  },
  {
    id: "todo-app",
    name: "Todo List",
    icon: "✓",
    componentName: "TodoApp"
  }
];

function App() {
  const [isLoading, setIsLoading] = useState(true)

  // 앱 초기화
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 로딩 시뮬레이션 (실제 환경에서는 필요한 초기화 작업 수행)
        await new Promise(resolve => setTimeout(resolve, 800))
        setIsLoading(false)
      } catch (error) {
        console.error('앱 초기화 오류:', error)
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  // BrowserOS 컴포넌트 렌더링
  return <BrowserOS apps={appManifests} />
}

export default App
