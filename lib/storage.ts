const memoryStorage = new Map<string, string>();

export const noopStorage: Storage = {
  get length() {
    return memoryStorage.size;
  },
  clear() {
    memoryStorage.clear();
  },
  getItem(key: string) {
    return memoryStorage.get(key) ?? null;
  },
  key(index: number) {
    return Array.from(memoryStorage.keys())[index] ?? null;
  },
  removeItem(key: string) {
    memoryStorage.delete(key);
  },
  setItem(key: string, value: string) {
    memoryStorage.set(key, value);
  }
};

export function getClientStorage(): Storage {
  if (typeof window === "undefined") {
    return noopStorage;
  }

  return window.localStorage;
}

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const value = getClientStorage().getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T) {
  try {
    getClientStorage().setItem(key, JSON.stringify(value));
  } catch {
    // Some browsers can block storage in private contexts.
  }
}

export function removeFromStorage(key: string) {
  try {
    getClientStorage().removeItem(key);
  } catch {
    // Ignore storage errors so the MVP remains usable without persistence.
  }
}
