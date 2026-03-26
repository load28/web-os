<script lang="ts">
  import { getContext, type Snippet } from 'svelte'
  import type { BrowserOSStore } from './browser-os-store.svelte.js'

  let { appId, children }: { appId: string; children: Snippet } = $props()

  const store = getContext<BrowserOSStore>('browseros')

  let isDragging = $state(false)
  let isResizing = $state(false)
  let dragStart = $state({ x: 0, y: 0 })
  let resizeStart = $state({ x: 0, y: 0, width: 0, height: 0 })

  const appState = $derived(store.appStates[appId])
  const app = $derived(store.apps.find((a) => a.id === appId))

  function handleMouseDown(e: MouseEvent) {
    const target = e.target as HTMLElement
    if (target.closest('.window-titlebar') && !target.closest('button')) {
      isDragging = true
      dragStart = {
        x: e.clientX - (appState?.position.x ?? 0),
        y: e.clientY - (appState?.position.y ?? 0),
      }
      e.preventDefault()
    }
  }

  function handleResizeMouseDown(e: MouseEvent) {
    e.stopPropagation()
    e.preventDefault()
    isResizing = true
    resizeStart = {
      x: e.clientX,
      y: e.clientY,
      width: appState?.size.width ?? 500,
      height: appState?.size.height ?? 400,
    }
  }

  function handleMouseMove(e: MouseEvent) {
    if (isDragging) {
      const newX = Math.max(0, e.clientX - dragStart.x)
      const newY = Math.max(0, e.clientY - dragStart.y)
      store.moveApp(appId, newX, newY)
    } else if (isResizing) {
      const newWidth = Math.max(300, resizeStart.width + (e.clientX - resizeStart.x))
      const newHeight = Math.max(200, resizeStart.height + (e.clientY - resizeStart.y))
      store.resizeApp(appId, newWidth, newHeight)
    }
  }

  function handleMouseUp() {
    isDragging = false
    isResizing = false
  }

  $effect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  })
</script>

{#if appState && appState.isOpen && !appState.isMinimized && app}
  <div
    class="absolute rounded-lg shadow-lg overflow-hidden flex flex-col bg-slate-50 backdrop-blur-sm border {appState.isActive ? 'z-10 ring-2 ring-blue-500' : 'z-0 border-gray-200'}"
    style="left: {appState.position.x}px; top: {appState.position.y}px; width: {appState.size.width}px; height: {appState.size.height}px;"
  >
    <!-- Window titlebar -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="window-titlebar flex items-center justify-between px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 border-b cursor-move"
      onmousedown={handleMouseDown}
    >
      <div class="flex items-center gap-2">
        <span class="text-lg text-white">{app.icon}</span>
        <span class="text-sm font-semibold text-white">{app.name}</span>
      </div>
      <div class="flex items-center gap-1">
        <button
          class="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-400 transition-colors"
          onclick={() => store.minimizeApp(appId)}
        >
          <span class="flex items-center justify-center w-4 h-4 text-white font-bold">−</span>
        </button>
        <button
          class="w-6 h-6 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-400 transition-colors"
          onclick={() => store.closeApp(appId)}
        >
          <span class="flex items-center justify-center w-4 h-4 text-white font-bold">×</span>
        </button>
      </div>
    </div>

    <!-- Window content -->
    <div class="flex-1 bg-slate-50 overflow-auto text-gray-800 app-window-content">
      {@render children()}
    </div>

    <!-- Resize handle -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
      onmousedown={handleResizeMouseDown}
    >
      <div class="w-0 h-0 border-t-8 border-l-8 border-transparent border-t-gray-300 transform rotate-45 translate-x-1 translate-y-1"></div>
    </div>
  </div>
{/if}
