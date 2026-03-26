<script lang="ts">
  import type { AppManifest } from '@browseros/core'
  import { getAppComponent } from './app-loader.js'

  let { app }: { app: AppManifest } = $props()

  const Component = $derived(app.componentName ? getAppComponent(app.componentName) : undefined)
</script>

{#if Component}
  <Component />
{:else}
  <div class="p-4 text-red-500">
    <h3 class="font-bold">앱 로드 오류</h3>
    <p>컴포넌트를 찾을 수 없습니다: {app.componentName}</p>
  </div>
{/if}
