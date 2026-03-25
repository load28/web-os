<script lang="ts">
  import { getContext } from 'svelte'
  import type { BrowserOSStore } from './browser-os-store.svelte.js'

  let { className = '' }: { className?: string } = $props()

  const store = getContext<BrowserOSStore>('browseros')
</script>

<div class="flex items-center h-12 px-2 bg-gradient-to-r from-blue-800 to-indigo-900 border-t border-indigo-950 shadow-lg {className}">
  <div class="flex items-center gap-1">
    {#each store.apps as app (app.id)}
      {@const state = store.appStates[app.id]}
      {@const isOpen = state?.isOpen || false}
      {@const isActive = state?.isActive || false}
      <button
        class="flex items-center justify-center w-10 h-10 rounded-md transition-colors {isActive
          ? 'bg-blue-500 text-white'
          : isOpen
            ? 'bg-blue-700 text-white'
            : 'bg-transparent text-gray-300 hover:bg-blue-800'}"
        onclick={() => store.launchApp(app.id)}
      >
        <span class="w-5 h-5">{app.icon}</span>
      </button>
    {/each}
  </div>
  <div class="ml-auto text-xs font-semibold text-blue-300 px-2 flex items-center">
    <span class="mr-1 text-sm bg-blue-600 p-1 rounded-full text-white">🌐</span>
    BrowserOS
  </div>
</div>
