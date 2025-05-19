import React, { useMemo, useState } from "react";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";
import { useTaskStore } from "../store/taskStore";

const TodoListTabs: React.FC = () => {
  const {
    todoLists,
    currentTodoList,
    addTodoList,
    editTodoList,
    deleteTodoList,
    setCurrentTodoList,
  } = useTaskStore();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newListTitle, setNewListTitle] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListTitle.trim()) {
      addTodoList(newListTitle.trim());
      setNewListTitle("");
      setIsAddingNew(false);
      setCurrentTodoList(newListTitle.trim());
    }
  };

  const todoListsRender = useMemo(() => {
    return todoLists.sort((a, b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    }).reverse()
  }, [todoLists]);

  const handleEdit = (id: string, currentTitle: string) => {
    setIsEditing(id);
    setEditValue(currentTitle);
  };

  const handleSaveEdit = async (id: string) => {
    if (editValue.trim() !== "") {
      await editTodoList(id, editValue.trim());
    }
    setIsEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this list and all its tasks?"
      )
    ) {
      await deleteTodoList(id);
      setCurrentTodoList(null);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center overflow-auto gap-2 mb-4 w-full">
        {isAddingNew ? (
          <form onSubmit={handleAddNew} className="flex items-center gap-2">
            <input
              type="text"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              placeholder="List name"
              className="px-3 py-2 border rounded-lg text-sm w-40"
              autoFocus
            />
            <button
              type="submit"
              className="p-2 text-green-500 hover:text-green-600"
              disabled={!newListTitle.trim()}
            >
              <Check size={20} />
            </button>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="p-2 text-red-500 hover:text-red-600"
            >
              <X size={20} />
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            New List
          </button>
        )}
        {todoListsRender.map((list) => (
          <div
            key={list.id}
            className={`relative group ${
              currentTodoList === list.id
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } rounded-lg shadow-sm transition-all duration-200 pr-4 pl-4`}
          >
            {isEditing === list.id ? (
              <div className="flex items-center p-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="px-2 py-1 text-gray-700 border rounded-md text-sm w-32"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(list.id);
                    if (e.key === "Escape") setIsEditing(null);
                  }}
                  autoFocus
                />
                <button
                  onClick={() => handleSaveEdit(list.id)}
                  className="p-1 text-green-500 hover:text-green-600"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => setIsEditing(null)}
                  className="p-1 text-red-500 hover:text-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentTodoList(list.id)}
                className="px-4 py-2 text-sm font-medium"
              >
                {list.title}
              </button>
            )}

            {!isEditing && currentTodoList === list.id && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 justify-between w-full">
                <button
                  onClick={() => handleEdit(list.id, list.title)}
                  className="p-1 text-white hover:text-blue-100 transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(list.id)}
                  className="p-1 text-white hover:text-blue-100 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoListTabs;
