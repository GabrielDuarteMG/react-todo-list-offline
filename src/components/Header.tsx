import React from "react";
import { ListChecks } from "lucide-react";
import { useTaskStore } from "../store/taskStore";

const Header: React.FC = () => {
  const { viewMode, setViewMode, exportTasks, importTasks } = useTaskStore();

  const handleViewToggle = async () => {
    setViewMode(viewMode === "list" ? "text" : "list");
  };
  const [url, setUrl] = React.useState("");

  const handleImport = async () => {
    try {
      importTasks(url);
      setUrl("");
    } catch (error) {
      console.error("Error importing tasks:", error);
    }
  };
  return (
    <header className="bg-gradient-to-r from-blue-500 to-teal-400 p-4 shadow-md">
      <div className=" mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ListChecks size={28} className="text-white" />
            <h1 className="text-2xl font-bold text-white m-0">TodoList</h1>
          </div>

          <div className="flex gap-3">
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
            <div>
              <input
                type="text"
                placeholder="Import via URL"
                className="bg-white text-blue-500 px-4 py-2 rounded-md shadow-sm font-medium transition-all"
                aria-label="Import via URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleImport();
                  }
                }}
              />
              <button
                onClick={handleImport}
                className="bg-white text-green-500 hover:bg-blue-50 px-4 py-2 rounded-md shadow-sm font-medium transition-all ml-2"
                aria-label="Import via URL"
              >
                Import
              </button>
              <button
                onClick={() => {
                  exportTasks();
                }}
                className="bg-white text-orange-500 hover:bg-blue-50 px-4 py-2 rounded-md shadow-sm font-medium transition-all ml-2"
                aria-label="Import via URL"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
