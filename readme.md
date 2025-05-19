# TodoList App

A feature-rich task management application built with React and TypeScript that works offline with local data storage.

## Features

- ✅ Create multiple todo lists to organize different types of tasks
- ✅ Add, edit, and delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Toggle between list view and text view modes
- ✅ Filter tasks with real-time search
- ✅ Offline support with IndexedDB storage
- ✅ Responsive design for all devices

## Installation

```bash
# Clone the repository
git clone https://github.com/GabrielDuarteMG/react-todo-list-offline

# Navigate to project directory
cd todo-list

# Install dependencies
npm install

# Start development server
npm run dev
```

## Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## Usage

### Creating Todo Lists
- Click "New List" button
- Enter a name and save

### Managing Tasks
- Add tasks using the input field at the top
- Edit tasks by clicking the pencil icon
- Delete tasks using the trash icon
- Mark tasks complete by checking the checkbox

### View Modes
- **List View**: Classic task list with checkboxes
- **Text View**: Alternative text-based interface where:
  - `#` prefix indicates completed tasks
  - `@` prefix indicates pending tasks

## Technology Stack

- **Frontend**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Storage**: IndexedDB for offline data persistence
- **UI Components**: Custom components with [Lucide Icons](https://lucide.dev/)

## Project Structure

```
src/
├── components/         # UI components
│   ├── Header.tsx
│   ├── TaskForm.tsx
│   ├── TaskItem.tsx
│   ├── TaskList.tsx
│   ├── TaskTextArea.tsx
│   └── TodoListTabs.tsx
├── services/           # Data services
│   └── indexedDB.ts
├── store/              # State management
│   └── taskStore.ts
└── types/              # TypeScript types
    └── index.ts
```

## License

MIT