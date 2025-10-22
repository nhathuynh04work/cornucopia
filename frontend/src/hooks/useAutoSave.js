import { useEffect } from "react";
import { AUTOSAVE_MS } from "../lib/editor";

export function useAutoSave({
  enabled,
  deps = [],
  saveFn,
  delay = AUTOSAVE_MS,
}) {
  useEffect(() => {
    if (!enabled) return;
    const t = setTimeout(() => saveFn(), delay);
    return () => clearTimeout(t);
  }, [enabled, delay, saveFn, ...deps]);
}
