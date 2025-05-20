import React, { createContext, useEffect, useRef, useState } from "react";
import { useTaskStore } from "../store/taskStore";
import { Utils } from "../Utils/Utils";

interface SyncContextProps {
  hasChanged: boolean;
  setChanged: (changed: boolean) => void;
  sendTasks: () => Promise<void>;
}

const SyncContext = createContext<SyncContextProps | undefined>(undefined);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hasChanged, setHasChanged] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const [debounceTimeout, setDebounceTimeout] = useState(0);
  const { importTasks, exportTasksToGist } = useTaskStore();

  const sendTasks = async () => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    setHasChanged(true);
    const timeout = setTimeout(() => {
      exportTasksToGist()
        .then(() => {
          console.log("Tasks exported successfully");
        })
        .catch((error) => {
          console.error("Error exporting tasks:", error);
        });
    }, 10000);
    setDebounceTimeout(timeout as unknown as number);
  };
  useEffect(() => {
    function loop() {
      timeoutRef.current = setTimeout(() => {
        if (hasChanged) {
          setHasChanged(false);
        } else {
          if (
            localStorage.getItem("gistId") &&
            Utils.checkGithubToken(localStorage.getItem("githubToken")) &&
            localStorage.getItem("autoImportExport") === "true"
          ) {
            importTasks(localStorage.getItem("gistId") as string).catch(
              (error) => {
                console.error("Error importing tasks:", error);
              }
            );
          }
        }
        loop();
      }, 10000);
    }
    loop();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [hasChanged, importTasks]);

  return (
    <SyncContext.Provider
      value={{ hasChanged, setChanged: setHasChanged, sendTasks }}
    >
      {children}
    </SyncContext.Provider>
  );
};

export default SyncContext;
