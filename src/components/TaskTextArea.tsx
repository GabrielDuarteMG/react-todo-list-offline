import React, { useState, useEffect } from "react";
import { useTaskStore } from "../store/taskStore";
import type { Task } from "../types";

const TaskTextArea: React.FC = () => {
  const { tasks, filterText, addTask, toggleTask, deleteTask } = useTaskStore();
  const [textValue, setTextValue] = useState("");

  const filteredTasks = React.useMemo(() => {
    if (!filterText) return tasks;
    return tasks.filter((task) =>
      task.text.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [tasks, filterText]);

  useEffect(() => {
    const tasksAsText = filteredTasks
      .map((task) => `${task.completed ? "# " : "@ "}${task.text}`)
      .join("\n");
    setTextValue(tasksAsText);
  }, [filteredTasks]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.target.value);
  };

  const handleTextBlur = async () => {
    const currentLines = textValue
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const currentTasks = new Map<string, Task>();

    filteredTasks.forEach((task) => {
      currentTasks.set(task.text, task);
    });

    for (const line of currentLines) {
      const isCompleted = line.startsWith("#");
      const taskText = line.replace(/^[#@]\s*/, "").trim();

      if (!taskText) continue;

      const existingTask = Array.from(currentTasks.values()).find(
        (task) => task.text.toLowerCase() === taskText.toLowerCase()
      );

      if (existingTask) {
        if (existingTask.completed !== isCompleted) {
          await toggleTask(existingTask.id);
        }
        currentTasks.delete(existingTask.text);
      } else {
        await addTask(taskText);
        if (isCompleted) {
          const newlyAddedTask = tasks.find((t) => t.text === taskText);
          if (newlyAddedTask) {
            await toggleTask(newlyAddedTask.id);
          }
        }
      }
    }

    if (filterText === "") {
      for (const task of currentTasks.values()) {
        await deleteTask(task.id);
      }
    }
  };

  return (
    <div className="fade-in">
      <textarea
        value={textValue}
        onChange={handleTextChange}
        onBlur={handleTextBlur}
        className="w-full h-[400px] p-4 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
        placeholder="# Completed task&#10;@ Pending task"
      />
      <div className="mt-3 text-sm text-gray-500">
        <p>
          Use <code className="bg-gray-100 px-1 rounded">#</code> for completed
          tasks and <code className="bg-gray-100 px-1 rounded">@</code> for
          pending tasks.
        </p>
        <p className="mt-1">
          Changes are saved when you click outside the text area.
        </p>
      </div>
    </div>
  );
};

export default TaskTextArea;
