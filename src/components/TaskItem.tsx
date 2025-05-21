import React, { useState, useRef, useEffect } from "react";
import { Edit2, Trash2, Check, X } from "lucide-react";
import { useTaskStore } from "../store/taskStore";
import type { Task } from "../types";
import { useSync } from "../hooks/useSync";

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.text);
  const editInputRef = useRef<HTMLInputElement>(null);
  const {sendTasks} = useSync();

  const { toggleTask, deleteTask, editTask } = useTaskStore();

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleToggle = () => {
    toggleTask(task.id);
    sendTasks()
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    deleteTask(task.id);
    sendTasks()
  };

  const handleSave = async () => {
    if (editValue.trim() !== "") {
      await editTask(task.id, editValue);
      sendTasks()
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(task.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div
      className={`todo-card bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-3 fade-in ${
        task.completed ? "completed" : "pending"
      }`}
    >
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            ref={editInputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow p-2 border rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
            autoComplete="off"
          />
          <button
            onClick={handleSave}
            className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900 rounded-full transition-colors"
            aria-label="Save task"
          >
            <Check size={18} />
          </button>
          <button
            onClick={handleCancel}
            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-full transition-colors"
            aria-label="Cancel editing"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggle}
              className="task-checkbox w-5 h-5 rounded-full accent-blue-500 dark:accent-blue-400 cursor-pointer"
            />
            <span
              className={`task-text ${
                task.completed ? "completed" : ""
              } text-gray-900 dark:text-gray-100`}
            >
              {task.text}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-full transition-colors"
              aria-label="Edit task"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-full transition-colors"
              aria-label="Delete task"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
