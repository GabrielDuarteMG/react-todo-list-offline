export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
  todoListId: string;
}

export interface TodoList {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

export interface TaskStore {
  tasks: Task[];
  todoLists: TodoList[];
  currentTodoList: string | null;
  isLoading: boolean;
  error: string | null;
  viewMode: 'list' | 'text';
  filterText: string;
  
  // TodoList actions
  fetchTodoLists: () => Promise<void>;
  addTodoList: (title: string) => Promise<void>;
  editTodoList: (id: string, title: string) => Promise<void>;
  deleteTodoList: (id: string) => Promise<void>;
  setCurrentTodoList: (id: string | null) => void;
  
  // Task actions
  fetchTasks: () => Promise<void>;
  addTask: (text: string) => Promise<void>;
  editTask: (id: string, text: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setViewMode: (mode: 'list' | 'text') => void;
  setFilterText: (text: string) => void;
  exportTasks: () => Promise<void>;
  importTasks: (url: string) => Promise<void>;
  exportTasksToGist: () => Promise<void>;
  importFromGist: (url: string) => Promise<void>;
}