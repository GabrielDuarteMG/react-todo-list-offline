import React, { useEffect, useMemo } from "react";
import { useTaskStore } from "../store/taskStore";
import TaskItem from "./TaskItem";
import { AlertCircle } from "lucide-react";

const TaskList: React.FC = () => {
  const { tasks, isLoading, error, fetchTasks, filterText, currentTodoList } =
    useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (filterText) {
      filtered = filtered.filter((task) =>
        task.text.toLowerCase().includes(filterText.toLowerCase())
      );
    }
    return filtered
      .slice()
      .sort((a, b) => Number(a.completed) - Number(b.completed))
      .filter((task) => task.todoListId === currentTodoList);
  }, [tasks, filterText, currentTodoList]);

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-pulse text-blue-500 dark:text-blue-400">
          Loading tasks...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-950 border-l-4 border-red-500 dark:border-red-700 p-4 rounded mb-4">
        <div className="flex items-center">
          <AlertCircle
            className="text-red-500 dark:text-red-400 mr-2"
            size={20}
          />
          <p className="text-red-700 dark:text-red-300">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
        {filterText ? (
          <p className="text-gray-500 dark:text-gray-400">
            No tasks match your search.
          </p>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No tasks yet. Add your first task above!
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 fade-in overflow-auto max-h-[calc(100dvh-400px)]">
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
