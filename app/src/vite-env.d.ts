/// <reference types="vite/client" />

// 모듈 페더레이션 타입 선언
declare module "noteApp/NoteApp" {
  const NoteApp: React.ComponentType;
  export default NoteApp;
}

declare module "todoApp/TodoApp" {
  const TodoApp: React.ComponentType;
  export default TodoApp;
}
