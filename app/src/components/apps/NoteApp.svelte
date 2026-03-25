<script lang="ts">
  import { onMount } from 'svelte'
  import { useMessageBus } from '@browseros/svelte'

  interface NoteItem {
    id: string
    content: string
  }

  let notes = $state<NoteItem[]>([])
  let currentNote = $state('')

  // 메시지 버스를 통한 앱 간 통신 설정
  const { sendMessage } = useMessageBus('note-app', (message) => {
    if (message.type === 'ADD_NOTE' && message.payload?.content) {
      notes = [
        ...notes,
        {
          id: `note-${Date.now()}`,
          content: message.payload.content,
        },
      ]
    }
  })

  // 컴포넌트 마운트 시 데이터 로드
  onMount(() => {
    try {
      const savedNotes = localStorage.getItem('browseros-notes')
      if (savedNotes) {
        notes = JSON.parse(savedNotes)
      }
    } catch (error) {
      console.error('노트 로드 오류:', error)
    }
  })

  // 노트 변경 시 로컬 스토리지에 저장
  $effect(() => {
    localStorage.setItem('browseros-notes', JSON.stringify(notes))
  })

  function addNote() {
    if (currentNote.trim()) {
      notes = [
        ...notes,
        {
          id: `note-${Date.now()}`,
          content: currentNote,
        },
      ]
      currentNote = ''
    }
  }

  function deleteNote(noteId: string) {
    notes = notes.filter((note) => note.id !== noteId)
  }

  function sendToTodo(noteId: string) {
    const note = notes.find((n) => n.id === noteId)
    if (note) {
      sendMessage('todo-app', 'ADD_TODO', {
        text: note.content,
      })
    }
  }
</script>

<div class="flex flex-col h-full p-4">
  <div class="flex-1 overflow-auto">
    <h2 class="text-xl font-bold mb-4 text-gray-800 border-b-2 pb-2 border-gray-200">Notes</h2>
    <div class="space-y-3">
      {#each notes as note (note.id)}
        <div class="p-3 bg-yellow-100 border border-yellow-300 rounded-md">
          <div class="flex justify-between">
            <p class="text-sm font-medium text-gray-800">{note.content}</p>
            <div class="flex gap-2">
              <button
                onclick={() => sendToTodo(note.id)}
                class="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                할 일로 보내기
              </button>
              <button
                onclick={() => deleteNote(note.id)}
                class="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="flex gap-2 mt-4">
    <textarea
      bind:value={currentNote}
      placeholder="새 노트 작성..."
      class="flex-1 min-h-[80px] p-3 border-2 border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-800"
    ></textarea>
    <button
      onclick={addNote}
      class="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors shadow-sm"
    >
      추가
    </button>
  </div>
</div>
