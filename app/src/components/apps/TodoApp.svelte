<script lang="ts">
  import { onMount } from 'svelte'
  import { useMessageBus } from '@browseros/svelte'

  interface TodoItem {
    id: string
    text: string
    completed: boolean
  }

  let todos = $state<TodoItem[]>([])
  let newTodo = $state('')

  // 메시지 버스를 통한 앱 간 통신 설정
  const { sendMessage } = useMessageBus('todo-app', (message) => {
    if (message.type === 'ADD_TODO' && message.payload?.text) {
      todos = [
        ...todos,
        {
          id: `todo-${Date.now()}`,
          text: message.payload.text,
          completed: false,
        },
      ]
    }
  })

  // 컴포넌트 마운트 시 데이터 로드
  onMount(() => {
    try {
      const savedTodos = localStorage.getItem('browseros-todos')
      if (savedTodos) {
        todos = JSON.parse(savedTodos)
      }
    } catch (error) {
      console.error('할 일 로드 오류:', error)
    }
  })

  // 할 일 변경 시 로컬 스토리지에 저장
  $effect(() => {
    localStorage.setItem('browseros-todos', JSON.stringify(todos))
  })

  function addTodo() {
    if (newTodo.trim()) {
      todos = [
        ...todos,
        {
          id: `todo-${Date.now()}`,
          text: newTodo,
          completed: false,
        },
      ]
      newTodo = ''
    }
  }

  function toggleTodo(id: string) {
    todos = todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
  }

  function deleteTodo(id: string) {
    todos = todos.filter((todo) => todo.id !== id)
  }

  function sendToNote(todoId: string) {
    const todo = todos.find((t) => t.id === todoId)
    if (todo) {
      sendMessage('note-app', 'ADD_NOTE', {
        content: `할 일: ${todo.text} (${todo.completed ? '완료' : '진행 중'})`,
      })
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      addTodo()
    }
  }
</script>

<div class="flex flex-col h-full p-4">
  <div class="flex-1 overflow-auto">
    <h2 class="text-xl font-bold mb-4 text-gray-800 border-b-2 pb-2 border-gray-200">할 일 목록</h2>
    <div class="space-y-2">
      {#each todos as todo (todo.id)}
        <div
          class="p-3 border-2 rounded-md flex items-center justify-between {todo.completed
            ? 'bg-gray-100 border-gray-300'
            : 'bg-white border-gray-300'}"
        >
          <div class="flex items-center gap-2 flex-1">
            <input
              type="checkbox"
              checked={todo.completed}
              onchange={() => toggleTodo(todo.id)}
              id="todo-{todo.id}"
            />
            <label
              for="todo-{todo.id}"
              class="text-sm font-medium {todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}"
            >
              {todo.text}
            </label>
          </div>

          <div class="flex items-center gap-2">
            <button
              onclick={() => sendToNote(todo.id)}
              class="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              노트로 보내기
            </button>
            <button
              onclick={() => deleteTodo(todo.id)}
              class="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              삭제
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="flex gap-2 mt-4">
    <input
      bind:value={newTodo}
      placeholder="새 할 일 추가..."
      class="flex-1 p-3 border-2 border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-800"
      onkeydown={handleKeydown}
    />
    <button
      onclick={addTodo}
      class="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors shadow-sm"
    >
      추가
    </button>
  </div>
</div>
