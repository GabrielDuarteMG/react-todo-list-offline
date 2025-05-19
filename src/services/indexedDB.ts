import type { Task, TodoList } from "../types";

const DB_NAME = "todo-list-db";
const DB_VERSION = 3;
const TASK_STORE = "tasks";
const TODO_LIST_STORE = "todoLists";

let dbInstance: IDBDatabase | null = null;

export const initDB = async (): Promise<IDBDatabase> => {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      const oldVersion = event.oldVersion;

      try {
        if (oldVersion < 1) {
          const taskStore = db.createObjectStore(TASK_STORE, { keyPath: "id" });
          taskStore.createIndex("createdAt", "createdAt");
          taskStore.createIndex("completed", "completed");
          taskStore.createIndex("todoListId", "todoListId");
        }
        if (oldVersion < 2) {
          const todoListStore = db.createObjectStore(TODO_LIST_STORE, {
            keyPath: "id",
          });
          todoListStore.createIndex("createdAt", "createdAt");
        }
        if (oldVersion < 3) {
          if (!db.objectStoreNames.contains(TASK_STORE)) {
            const taskStore = db.createObjectStore(TASK_STORE, {
              keyPath: "id",
            });
            taskStore.createIndex("createdAt", "createdAt");
            taskStore.createIndex("completed", "completed");
            taskStore.createIndex("todoListId", "todoListId");
          } else {
            const transaction = request.transaction;
            if (transaction) {
              const taskStore = transaction.objectStore(TASK_STORE);
              if (!Array.from(taskStore.indexNames).includes("todoListId")) {
                taskStore.createIndex("todoListId", "todoListId");
              }
            }
          }
        }
      } catch (error) {
        console.error("Error during database upgrade:", error);
        reject(error);
      }
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onerror = () => {
      console.error("Error initializing database:", request.error);
      reject(request.error);
    };
  });
};

const getDB = async () => {
  if (dbInstance) return dbInstance;
  return await initDB();
};

// Helper for transaction
function tx<T>(
  storeName: string,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => Promise<T>
): Promise<T> {
  return getDB().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        fn(store)
          .then((result) => {
            transaction.oncomplete = () => resolve(result);
            transaction.onerror = () => reject(transaction.error);
          })
          .catch(reject);
      })
  );
}

// TodoList operations
export const getAllTodoLists = async (retryCount = 3): Promise<TodoList[]> => {
  try {
    return await tx<TodoList[]>(TODO_LIST_STORE, "readonly", (store) => {
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result as TodoList[]);
        request.onerror = () => reject(request.error);
      });
    });
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "InvalidStateError" &&
      retryCount > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return getAllTodoLists(retryCount - 1);
    }
    console.error("Error getting todo lists:", error);
    throw error;
  }
};

export const addTodoList = async (todoList: TodoList): Promise<TodoList> => {
  try {
    await tx<void>(TODO_LIST_STORE, "readwrite", (store) => {
      return new Promise((resolve, reject) => {
        const request = store.add(todoList);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
    return todoList;
  } catch (error) {
    console.error("Error adding todo list:", error);
    throw error;
  }
};

export const updateTodoList = async (todoList: TodoList): Promise<TodoList> => {
  try {
    await tx<void>(TODO_LIST_STORE, "readwrite", (store) => {
      return new Promise((resolve, reject) => {
        const request = store.put(todoList);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
    return todoList;
  } catch (error) {
    console.error("Error updating todo list:", error);
    throw error;
  }
};

export const deleteTodoList = async (id: string): Promise<void> => {
  try {
    await tx<void>(TODO_LIST_STORE, "readwrite", (store) => {
      return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });

    // Delete all tasks associated with this todo list
    await tx<void>(TASK_STORE, "readwrite", (store) => {
      return new Promise((resolve, reject) => {
        const index = store.index("todoListId");
        const keyRange = IDBKeyRange.only(id);
        const request = index.openCursor(keyRange);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          } else {
            resolve();
          }
        };
      });
    });
  } catch (error) {
    console.error("Error deleting todo list:", error);
    throw error;
  }
};

// Task operations
export const getAllTasks = async (
  todoListId: string,
  retryCount = 3
): Promise<Task[]> => {
  try {
    return await tx<Task[]>(TASK_STORE, "readonly", (store) => {
      return new Promise((resolve, reject) => {
        const index = store.index("todoListId");
        const request = index.getAll(IDBKeyRange.only(todoListId));
        request.onsuccess = () => resolve(request.result as Task[]);
        request.onerror = () => reject(request.error);
      });
    });
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "InvalidStateError" &&
      retryCount > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return getAllTasks(todoListId, retryCount - 1);
    }
    console.error("Error getting tasks:", error);
    throw error;
  }
};

export const addTask = async (task: Task): Promise<Task> => {
  try {
    await tx<void>(TASK_STORE, "readwrite", (store) => {
      return new Promise((resolve, reject) => {
        const request = store.add(task);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
    return task;
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

export const updateTask = async (task: Task): Promise<Task> => {
  try {
    await tx<void>(TASK_STORE, "readwrite", (store) => {
      return new Promise((resolve, reject) => {
        const request = store.put(task);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
    return task;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  try {
    await tx<void>(TASK_STORE, "readwrite", (store) => {
      return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export const exportAllDataToJSON = async (): Promise<string> => {
  try {
    const todoLists = await getAllTodoLists();
    const tasks = await Promise.all(
      todoLists.map((list) => getAllTasks(list.id))
    );

    const data = {
      todoLists,
      tasks: tasks.flat(),
    };

    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error("Error exporting data:", error);
    throw error;
  }
};

export const importDataFromJSON = async (json: string): Promise<void> => {
  try {
    const data = JSON.parse(json);
    const { todoLists, tasks } = data;

    await tx<void>(TODO_LIST_STORE, "readwrite", (store) => {
      return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
    await tx<void>(TASK_STORE, "readwrite", (store) => {
      return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });

    await Promise.all(todoLists.map((list: TodoList) => addTodoList(list)));
    await Promise.all(tasks.map((task: Task) => addTask(task)));
  } catch (error) {
    console.error("Error importing data:", error);
    throw error;
  }
};
