import { create } from "zustand";
import {
  getAllTasks,
  addTask as addTaskToDB,
  updateTask,
  deleteTask as deleteTaskFromDB,
  getAllTodoLists,
  addTodoList as addTodoListToDB,
  updateTodoList,
  deleteTodoList as deleteTodoListFromDB,
  exportAllDataToJSON,
  importDataFromJSON,
} from "../services/indexedDB";
import type { Task, TaskStore, TodoList } from "../types";
import { Utils } from "../Utils/Utils";

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  todoLists: [],
  currentTodoList: null,
  isLoading: false,
  error: null,
  viewMode: "list",
  filterText: "",

  fetchTodoLists: async () => {
    set({ isLoading: true, error: null });
    try {
      const todoLists = await getAllTodoLists();
      set({ todoLists, isLoading: false });

      const { currentTodoList } = get();
      if (!currentTodoList && todoLists.length > 0) {
        set({ currentTodoList: todoLists[0].id });
        get().fetchTasks();
      }
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch todo lists",
        isLoading: false,
      });
    }
  },

  addTodoList: async (title: string) => {
    set({ isLoading: true, error: null });
    try {
      const newTodoList: TodoList = {
        id: crypto.randomUUID(),
        title,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await addTodoListToDB(newTodoList);
      set((state) => ({
        todoLists: [...state.todoLists, newTodoList],
        currentTodoList: newTodoList.id,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to add todo list",
        isLoading: false,
      });
    }
  },

  editTodoList: async (id: string, title: string) => {
    set({ isLoading: true, error: null });
    try {
      const { todoLists } = get();
      const todoListIndex = todoLists.findIndex((list) => list.id === id);

      if (todoListIndex !== -1) {
        const updatedTodoList = {
          ...todoLists[todoListIndex],
          title,
          updatedAt: Date.now(),
        };

        await updateTodoList(updatedTodoList);

        const updatedTodoLists = [...todoLists];
        updatedTodoLists[todoListIndex] = updatedTodoList;

        set({ todoLists: updatedTodoLists, isLoading: false });
      }
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to edit todo list",
        isLoading: false,
      });
    }
  },

  deleteTodoList: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteTodoListFromDB(id);
      set((state) => {
        const updatedTodoLists = state.todoLists.filter(
          (list) => list.id !== id
        );
        return {
          todoLists: updatedTodoLists,
          currentTodoList:
            updatedTodoLists.length > 0 ? updatedTodoLists[0].id : null,
          tasks: state.currentTodoList === id ? [] : state.tasks,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete todo list",
        isLoading: false,
      });
    }
  },

  setCurrentTodoList: (id: string | null) => {
    set({ currentTodoList: id });
    if (id) {
      get().fetchTasks();
    }
  },

  // Task actions
  fetchTasks: async () => {
    const { currentTodoList } = get();
    if (!currentTodoList) return;

    set({ isLoading: true, error: null });
    try {
      const tasks = await getAllTasks(currentTodoList);
      set({ tasks, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch tasks",
        isLoading: false,
      });
    }
  },

  addTask: async (text: string) => {
    const { currentTodoList } = get();
    if (!currentTodoList) return;

    set({ isLoading: true, error: null });
    try {
      const newTask: Task = {
        id: crypto.randomUUID(),
        text,
        completed: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        todoListId: currentTodoList,
      };
      await addTaskToDB(newTask);
      set((state) => ({
        tasks: [newTask, ...state.tasks],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to add task",
        isLoading: false,
      });
    }
  },

  editTask: async (id: string, text: string) => {
    set({ isLoading: true, error: null });
    try {
      const { tasks } = get();
      const taskIndex = tasks.findIndex((task) => task.id === id);

      if (taskIndex !== -1) {
        const updatedTask = {
          ...tasks[taskIndex],
          text,
          updatedAt: Date.now(),
        };

        await updateTask(updatedTask);

        const updatedTasks = [...tasks];
        updatedTasks[taskIndex] = updatedTask;

        set({ tasks: updatedTasks, isLoading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to edit task",
        isLoading: false,
      });
    }
  },

  toggleTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { tasks } = get();
      const taskIndex = tasks.findIndex((task) => task.id === id);

      if (taskIndex !== -1) {
        const updatedTask = {
          ...tasks[taskIndex],
          completed: !tasks[taskIndex].completed,
          updatedAt: Date.now(),
        };

        await updateTask(updatedTask);

        const updatedTasks = [...tasks];
        updatedTasks[taskIndex] = updatedTask;

        set({ tasks: updatedTasks, isLoading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to toggle task",
        isLoading: false,
      });
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteTaskFromDB(id);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete task",
        isLoading: false,
      });
    }
  },

  setViewMode: (mode: "list" | "text") => {
    set({ viewMode: mode });
  },

  setFilterText: (text: string) => {
    set({ filterText: text });
  },

  exportTasks: async () => {
    // await exportAllDataToJSON() copia para o clipboard
    const data = await exportAllDataToJSON();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  importTasks: async (url: string) => {
    if (url.includes("gist.github.com")) {
      const gistId = url.split("/").pop();
      get().importFromGist(gistId!);
      return;
    }
    const data = await (await fetch(url)).text();
    await importDataFromJSON(data);
    const parsedData = JSON.parse(data);
    const { todoLists, tasks } = parsedData;
    set({ todoLists, tasks });
    const { currentTodoList } = get();
    if (!currentTodoList && todoLists.length > 0) {
      set({ currentTodoList: todoLists[0].id });
      get().fetchTasks();
    }
  },

  importFromGist: async (gistId: string) => {
    fetch(`https://api.github.com/gists/${gistId}`)
      .then((response) => response.json())
      .then(async (data) => {
        const gistContent = data.files["tasks.json"].content;

        await importDataFromJSON(gistContent);
        const parsedData = JSON.parse(gistContent);
        const { todoLists, tasks } = parsedData;
        set({ todoLists, tasks });
        const { currentTodoList } = get();
        if (!currentTodoList && todoLists.length > 0) {
          set({ currentTodoList: todoLists[0].id });
          get().fetchTasks();
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar o gist:", error);
      });
  },

  exportTasksToGist: async () => {
    const githubToken = localStorage.getItem("githubToken");
    const gistUrl = localStorage.getItem("gistId");
    if (Utils.checkGithubToken(githubToken) && gistUrl) {
      const data = await exportAllDataToJSON();
      fetch(`https://api.github.com/gists/${Utils.getGistIdByUrl(gistUrl)}`, {
        method: "PATCH",
        headers: {
          Authorization: `token ${githubToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: {
            "tasks.json": {
              content: data,
            },
          },
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Gist atualizado com sucesso:", data);
        })
        .catch((error) => {
          console.error("Erro ao atualizar o gist:", error);
        });
    }
  },
}));
