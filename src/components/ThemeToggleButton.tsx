import { useTheme } from "../hooks/useTheme";

const ThemeToggleButton = () => {
  const { toggleDarkMode } = useTheme();

  return (
    <button
      onClick={() => {
        toggleDarkMode();
      }}
      className="view-toggle-btn bg-white text-blue-500 hover:bg-blue-50 dark:bg-gray-900 dark:text-teal-300 dark:hover:bg-gray-800 px-4 py-2 rounded-md shadow-sm font-medium transition-all"
    >
      Alternar Tema
    </button>
  );
};

export default ThemeToggleButton;
