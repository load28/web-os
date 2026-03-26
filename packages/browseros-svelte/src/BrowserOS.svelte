<script lang="ts">
  import { setContext, onDestroy } from 'svelte'
  import { type AppManifest, appManager } from '@browseros/core'
  import { BrowserOSStore } from './browser-os-store.svelte.js'
  import Desktop from './Desktop.svelte'
  import Taskbar from './Taskbar.svelte'
  import AppWindow from './AppWindow.svelte'
  import AppLoader from './AppLoader.svelte'

  let { apps, className = '', wallpaper }: { apps: AppManifest[]; className?: string; wallpaper?: string } = $props()

  // 스토어 생성 및 컨텍스트에 등록
  const store = new BrowserOSStore()
  $effect(() => {
    store.wallpaper = wallpaper
  })
  setContext('browseros', store)

  // 앱 등록
  $effect(() => {
    apps.forEach((app) => {
      appManager.registerApp(app)
    })

    return () => {
      apps.forEach((app) => {
        appManager.unregisterApp(app.id)
      })
    }
  })

  onDestroy(() => {
    store.destroy()
  })
</script>

<div class="flex flex-col h-screen bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden {className}">
  <div class="flex-1 relative">
    <Desktop />
    <!-- Window Manager -->
    {#each store.apps as app (app.id)}
      {#if store.appStates[app.id]?.isOpen}
        <AppWindow appId={app.id}>
          <AppLoader {app} />
        </AppWindow>
      {/if}
    {/each}
  </div>
  <Taskbar />
</div>
