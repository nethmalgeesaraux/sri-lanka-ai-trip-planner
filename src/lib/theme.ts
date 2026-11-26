"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "lankatrails-theme";
const EVENT_NAME = "lankatrails-theme-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT_NAME, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT_NAME, callback);
  };
}

function getSnapshot(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "dark";
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

export function useDarkMode() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function setDarkMode(next: boolean) {
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
      window.dispatchEvent(new Event(EVENT_NAME));
    } catch {
      // ignore storage quota errors
    }
  }

  return [dark, setDarkMode] as const;
}
