import { useContext } from "react";
import SyncContext from "../context/SyncContext";

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error("useSyncContext must be used within a SyncProvider");
  }
  return context;
};
