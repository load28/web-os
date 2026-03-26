<script lang="ts">
  let { appId, name, icon, onclick }: { appId: string; name: string; icon: string; onclick: () => void } = $props()
</script>

<button
  class="flex flex-col items-center justify-center gap-1 p-2 rounded cursor-pointer hover:bg-blue-100/50 transition-colors duration-200"
  onclick={onclick}
>
  <div class="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-sm border border-blue-100 text-lg">
    <span class="text-blue-600">{icon}</span>
  </div>
  <span class="text-xs font-medium text-center text-gray-800">{name}</span>
</button>
