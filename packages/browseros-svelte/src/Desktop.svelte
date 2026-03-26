<script lang="ts">
  import { getContext } from 'svelte'
  import type { BrowserOSStore } from './browser-os-store.svelte.js'
  import DesktopIcon from './DesktopIcon.svelte'

  let { className = '' }: { className?: string } = $props()

  const store = getContext<BrowserOSStore>('browseros')
</script>

<div class="absolute inset-0 p-4 grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] auto-rows-[80px] gap-4 {className}">
  {#each store.apps as app (app.id)}
    <DesktopIcon
      appId={app.id}
      name={app.name}
      icon={app.icon}
      onclick={() => store.launchApp(app.id)}
    />
  {/each}
</div>
