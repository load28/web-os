import { useState, useEffect, useCallback } from "react";
import { useMessageBus } from "@browseros/shared";

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export function TodoApp() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");
  
  // 메시지 버스를 통한 앱 간 통신 설정
  const messageHandler = useCallback((message) => {
    if (message.type === "ADD_TODO" && message.payload?.text) {
      const newTodoItem = {
        id: `todo-${Date.now()}`,
        text: message.payload.text,
        completed: false,
      };
      setTodos((prev) => [...prev, newTodoItem]);
    }
  }, []);

  const { sendMessage } = useMessageBus("todo-app", messageHandler);
  
  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    const loadTodos = () => {
      try {
        const savedTodos = localStorage.getItem('browseros-todos');
        if (savedTodos) {
          setTodos(JSON.parse(savedTodos));
        }
      } catch (error) {
        console.error('할 일 로드 오류:', error);
      }
    };
    
    loadTodos();
  }, []);
  
  // 할 일 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('browseros-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const newTodoItem = {
        id: `todo-${Date.now()}`,
        text: newTodo,
        completed: false,
      };
      setTodos((prev) => [...prev, newTodoItem]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const sendToNote = (todoId: string) => {
    const todo = todos.find(todo => todo.id === todoId);
    if (todo) {
      sendMessage("note-app", "ADD_NOTE", {
        content: `할 일: ${todo.text} (${todo.completed ? "완료" : "진행 중"})`
      });
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b-2 pb-2 border-gray-200">할 일 목록</h2>
        <div className="space-y-2">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`p-3 border-2 rounded-md flex items-center justify-between ${
                todo.completed ? "bg-gray-100 border-gray-300" : "bg-white border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  id={`todo-${todo.id}`}
                />
                <label
                  htmlFor={`todo-${todo.id}`}
                  className={`text-sm font-medium ${todo.completed ? "line-through text-gray-500" : "text-gray-800"}`}
                >
                  {todo.text}
                </label>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => sendToNote(todo.id)} 
                  className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  노트로 보내기
                </button>
                <button 
                  onClick={() => deleteTodo(todo.id)} 
                  className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="새 할 일 추가..."
          className="flex-1 p-3 border-2 border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-800"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTodo();
            }
          }}
        />
        <button 
          onClick={addTodo} 
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors shadow-sm"
        >
          추가
        </button>
      </div>
    </div>
  );
}
