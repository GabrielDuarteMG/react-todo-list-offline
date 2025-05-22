import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  const [errorOnSync, setErrorOnSync] = useState(false);

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
          setErrorOnSync(true);
          console.error("Error exporting tasks:", error);
        });
    }, 5000);
    setDebounceTimeout(timeout as unknown as number);
  };

  const syncActive = () => {
    return (
      localStorage.getItem("gistId") &&
      Utils.checkGithubToken(localStorage.getItem("githubToken")) &&
      localStorage.getItem("autoImportExport") === "true"
    );
  };

  useEffect(() => {
    if (syncActive())
      importTasks(localStorage.getItem("gistId") as string).catch((error) => {
        console.warn(error);

        setErrorOnSync(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    function loop() {
      timeoutRef.current = setTimeout(async () => {
        if (errorOnSync) return;
        if (hasChanged) {
          setHasChanged(false);
        } else {
          if (syncActive()) {
            try {
              await importTasks(localStorage.getItem("gistId") as string);
            } catch {
              setErrorOnSync(true);
            }
          }
        }
        loop();
      }, 10000);
    }
    loop();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [errorOnSync, hasChanged, importTasks]);

  const onSyncActive = useMemo(() => {
    return syncActive() && !hasChanged && !errorOnSync;
  }, [errorOnSync, hasChanged]);

  const onChangeActive = useMemo(() => {
    return syncActive() && hasChanged && !errorOnSync;
  }, [errorOnSync, hasChanged]);
  return (
    <SyncContext.Provider
      value={{ hasChanged, setChanged: setHasChanged, sendTasks }}
    >
      {onSyncActive ? (
        <div className="fixed bottom-14 right-0 p-2 bg-green-500 text-white dark:bg-green-700 opacity-85 w-full">
          Sync is active
        </div>
      ) : (
        <></>
      )}
      {onChangeActive ? (
        <div className="fixed bottom-14 right-0 p-2 bg-orange-500 text-white dark:bg-orange-700 opacity-85 w-full">
          Sync is active, but there are unsaved changes
        </div>
      ) : (
        <></>
      )}
      {errorOnSync ? (
        <div className="fixed bottom-14 right-0 p-2 bg-red-500 text-white dark:bg-red-700 opacity-85 w-full">
          Error on sync, please check your connection, Gist ID or GitHub token
          <button
            className="ml-2 text-white underline"
            onClick={() => {
              setErrorOnSync(false);
            }}
          >
            Dismiss
          </button>
        </div>
      ) : (
        <></>
      )}
      {children}
    </SyncContext.Provider>
  );
};

export default SyncContext;
