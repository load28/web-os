import { useState, useEffect, useCallback } from "react";
import { useMessageBus } from "@browseros/shared";

export interface NoteItem {
  id: string;
  content: string;
}

export function NoteApp() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [currentNote, setCurrentNote] = useState("");

  // 메시지 버스를 통한 앱 간 통신 설정
  const messageHandler = useCallback((message) => {
    if (message.type === "ADD_NOTE" && message.payload?.content) {
      const newNote = {
        id: `note-${Date.now()}`,
        content: message.payload.content,
      };
      setNotes((prev) => [...prev, newNote]);
    }
  }, []);

  const { sendMessage } = useMessageBus("note-app", messageHandler);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    const loadNotes = () => {
      try {
        const savedNotes = localStorage.getItem('browseros-notes');
        if (savedNotes) {
          setNotes(JSON.parse(savedNotes));
        }
      } catch (error) {
        console.error('노트 로드 오류:', error);
      }
    };
    
    loadNotes();
  }, []);

  // 노트 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('browseros-notes', JSON.stringify(notes));
  }, [notes]);
  
  const addNote = () => {
    if (currentNote.trim()) {
      const newNote = {
        id: `note-${Date.now()}`,
        content: currentNote,
      };
      setNotes((prev) => [...prev, newNote]);
      setCurrentNote("");
    }
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  const sendToTodo = (noteId: string) => {
    const note = notes.find(note => note.id === noteId);
    if (note) {
      sendMessage("todo-app", "ADD_TODO", {
        text: note.content
      });
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b-2 pb-2 border-gray-200">Notes</h2>
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="p-3 bg-yellow-100 border border-yellow-300 rounded-md">
              <div className="flex justify-between">
                <p className="text-sm font-medium text-gray-800">{note.content}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => sendToTodo(note.id)} 
                    className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    할 일로 보내기
                  </button>
                  <button 
                    onClick={() => deleteNote(note.id)} 
                    className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <textarea
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder="새 노트 작성..."
          className="flex-1 min-h-[80px] p-3 border-2 border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-800"
        />
        <button 
          onClick={addNote} 
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors shadow-sm"
        >
          추가
        </button>
      </div>
    </div>
  );
}
