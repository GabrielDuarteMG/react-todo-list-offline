import React from "react";
import { ListChecks } from "lucide-react";
import { useTaskStore } from "../store/taskStore";

const Header: React.FC = () => {
  const { viewMode, setViewMode, printAllActions } = useTaskStore();

  const handleViewToggle = async () => {
    await printAllActions();
    setViewMode(viewMode === "list" ? "text" : "list");
  };

  return (
    <header className="bg-gradient-to-r from-blue-500 to-teal-400 p-4 shadow-md">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ListChecks size={28} className="text-white" />
            <h1 className="text-2xl font-bold text-white m-0">TodoList</h1>
          </div>

          <button
            onClick={handleViewToggle}
            className="view-toggle-btn bg-white text-blue-500 hover:bg-blue-50 px-4 py-2 rounded-md shadow-sm font-medium transition-all"
            aria-label={
              viewMode === "list"
                ? "Switch to text view"
                : "Switch to list view"
            }
          >
            {viewMode === "list" ? "Text View" : "List View"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
