import React from "react";
import { ListChecks } from "lucide-react";
import { useTaskStore } from "../store/taskStore";
import ThemeToggleButton from "./ThemeToggleButton";
import { Settings } from "lucide-react";

const Header: React.FC = () => {
  const { viewMode, setViewMode, exportTasks, importTasks } = useTaskStore();
  const [showConfig, setShowConfig] = React.useState(false);

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
    <header className="bg-gradient-to-r from-blue-500 to-teal-400 dark:from-gray-900 dark:to-gray-800 p-4 shadow-md">
      <div className="mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ListChecks size={28} className="text-white dark:text-teal-300" />
            <h1 className="text-2xl font-bold text-white dark:text-teal-200 m-0">
              TodoList
            </h1>
          </div>

          <div className="flex gap-3 items-center">
            <button
              onClick={handleViewToggle}
              className="view-toggle-btn bg-white text-blue-500 hover:bg-blue-50 dark:bg-gray-900 dark:text-teal-300 dark:hover:bg-gray-800 px-4 py-2 rounded-md shadow-sm font-medium transition-all"
              aria-label={
                viewMode === "list"
                  ? "Switch to text view"
                  : "Switch to list view"
              }
            >
              {viewMode === "list" ? "Text View" : "List View"}
            </button>
            <ThemeToggleButton />

            <div className="relative">
              <button
                onClick={() => setShowConfig((prev) => !prev)}
                className="bg-white text-gray-700 hover:bg-blue-50 px-2 py-2 rounded-md shadow-sm font-medium transition-all ml-2 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center justify-center"
                aria-label="Show configuration"
              >
                <Settings size={20} />
              </button>
              {showConfig && (
                <div className="absolute right-0 mt-2  bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-4 z-50">
                  <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-teal-200">
                    Configuration
                  </h2>
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex items-center">
                      <input
                        type="text"
                        placeholder="Import via URL"
                        className=" flex-1 bg-white text-blue-500 px-4 py-2 rounded-md shadow-sm font-medium transition-all dark:bg-gray-900 dark:text-teal-300 dark:placeholder:text-teal-400"
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
                        className="bg-white text-green-500 hover:bg-blue-50 px-4 py-2 rounded-md shadow-sm font-medium transition-all ml-2 dark:bg-gray-900 dark:text-green-400 dark:hover:bg-gray-800"
                        aria-label="Import via URL"
                      >
                        Import
                      </button>
                      <button
                        onClick={() => {
                          exportTasks();
                        }}
                        className="bg-white text-orange-500 hover:bg-blue-50 px-4 py-2 rounded-md shadow-sm font-medium transition-all ml-2 dark:bg-gray-900 dark:text-orange-400 dark:hover:bg-gray-800"
                        aria-label="Export tasks"
                      >
                        Export
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    {/* GIST ID */}
                    <input
                      type="text"
                      placeholder="https://gist.github.com/{USER}/{GIST_ID}"
                      className="bg-white text-blue-500 px-4 py-2 rounded-md shadow-sm font-medium transition-all dark:bg-gray-900 dark:text-teal-300 dark:placeholder:text-teal-400"
                      aria-label="Gist URL"
                      onChange={(e) => {
                        localStorage.setItem("gistId", e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          localStorage.setItem("gistId", e.currentTarget.value);
                        }
                      }}
                      defaultValue={localStorage.getItem("gistId") || ""}
                    />
                    <input
                      type="text"
                      placeholder="GitHub Token"
                      className="bg-white text-blue-500 px-4 py-2 rounded-md shadow-sm font-medium transition-all dark:bg-gray-900 dark:text-teal-300 dark:placeholder:text-teal-400"
                      aria-label="GitHub Token"
                      onChange={(e) => {
                        localStorage.setItem("githubToken", e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          localStorage.setItem(
                            "githubToken",
                            e.currentTarget.value
                          );
                        }
                      }}
                      defaultValue={localStorage.getItem("githubToken") || ""}
                    />
                  </div>
                  <div className="flex items-center mt-2 justify-end">
                    <input
                      type="checkbox"
                      id="auto-import-export"
                      className="form-checkbox h-5 w-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700"
                      onChange={(e) => {
                        localStorage.setItem(
                          "autoImportExport",
                          String(e.target.checked)
                        );
                      }}
                      defaultChecked={
                        localStorage.getItem("autoImportExport") === "true"
                      }
                    />
                    <label
                      htmlFor="auto-import-export"
                      className="text-gray-800 ml-2 dark:text-teal-200"
                    >
                      Auto Import/Export
                    </label>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowConfig(false)}
                      className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-all "
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
