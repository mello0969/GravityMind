import { isCurrentStorageKey, storageKey } from "@/lib/brand";

export function collectLocalData(storage: Storage): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (!key || !isCurrentStorageKey(key)) continue;
    const raw = storage.getItem(key);
    try {
      data[key] = JSON.parse(raw ?? "null");
    } catch {
      data[key] = raw;
    }
  }
  return data;
}

export function exportLocalData() {
  const blob = new Blob([JSON.stringify(collectLocalData(window.localStorage), null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = `gravitymind-dados-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function resetCookieConsent() {
  window.localStorage.removeItem(storageKey("cookie-consent"));
  window.location.reload();
}
