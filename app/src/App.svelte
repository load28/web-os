<script lang="ts">
  import { onMount } from 'svelte'
  import { BrowserOS, registerAppComponent } from '@browseros/svelte'
  import LoadingScreen from './components/LoadingScreen.svelte'
  import type { AppManifest } from '@browseros/core'

  // 앱 컴포넌트들 임포트
  import NoteApp from './components/apps/NoteApp.svelte'
  import TodoApp from './components/apps/TodoApp.svelte'

  // 앱 컴포넌트 등록
  registerAppComponent('NoteApp', NoteApp)
  registerAppComponent('TodoApp', TodoApp)

  // 앱 매니페스트 정의
  const appManifests: AppManifest[] = [
    {
      id: 'note-app',
      name: 'Notes',
      icon: '📝',
      componentName: 'NoteApp',
    },
    {
      id: 'todo-app',
      name: 'Todo List',
      icon: '✓',
      componentName: 'TodoApp',
    },
  ]

  let isLoading = $state(true)

  // 앱 초기화
  onMount(async () => {
    try {
      // 로딩 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 800))
      isLoading = false
    } catch (error) {
      console.error('앱 초기화 오류:', error)
      isLoading = false
    }
  })
</script>

{#if isLoading}
  <LoadingScreen />
{:else}
  <BrowserOS apps={appManifests} />
{/if}
