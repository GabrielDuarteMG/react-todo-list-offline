import { useEffect } from "react";
import Header from "./components/Header";
import TodoListTabs from "./components/TodoListTabs";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskTextArea from "./components/TaskTextArea";
import { useTaskStore } from "./store/taskStore";
import { AlertCircle } from "lucide-react";

function App() {
  const { viewMode, fetchTodoLists, currentTodoList, error } = useTaskStore();

  useEffect(() => {
    fetchTodoLists();
  }, [fetchTodoLists]);

  return (
    
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
        <Header />

        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-500 p-4 rounded mb-4">
                <div className="flex items-center">
                  <AlertCircle className="text-red-500 mr-2" size={20} />
                  <p className="text-red-700 dark:text-red-200">
                    Error: {error}
                  </p>
                </div>
              </div>
            )}

            <TodoListTabs />

            {currentTodoList ? (
              <>
                <TaskForm />
                <div className="mt-4">
                  {viewMode === "list" ? <TaskList /> : <TaskTextArea />}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Create a new list to get started
              </div>
            )}
          </div>
        </main>

        <footer className="bg-gray-800 dark:bg-gray-950 text-white text-center py-4 mt-auto">
          <p>&copy; {new Date().getFullYear()} TodoList App</p>
        </footer>
      </div>
    
  );
}

export default App;
