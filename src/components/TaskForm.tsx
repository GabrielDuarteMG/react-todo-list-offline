import React, { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { useTaskStore } from "../store/taskStore";
import { useSync } from "../hooks/useSync";

const TaskForm: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { addTask, setFilterText } = useTaskStore();
  const {sendTasks} = useSync();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const text = inputValue.trim();
    if (text) {
      await addTask(text);
      sendTasks()
      setInputValue("");
      setFilterText("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setFilterText(value);
    sendTasks()
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-6 fade-in">
      <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Add a new task or filter existing tasks..."
          className="flex-grow py-3 px-4 outline-none text-gray-700 dark:text-gray-100 bg-transparent"
          aria-label="Add or filter tasks"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white p-3 transition-colors"
          aria-label="Add task"
          disabled={!inputValue.trim()}
        >
          <Plus size={24} />
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
