export const BRAND_NAME = "GRAVITYMIND";
export const STORAGE_PREFIX = "gravitymind:";
const LEGACY_STORAGE_PREFIX = "fisicafacil:";
export const PROGRESS_EVENT = "gravitymind:progress-updated";

export function storageKey(suffix: string) {
  return `${STORAGE_PREFIX}${suffix}`;
}

export function migrateLegacyStorage() {
  if (typeof window === "undefined") return;

  const legacyKeys: string[] = [];
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (key?.startsWith(LEGACY_STORAGE_PREFIX)) legacyKeys.push(key);
  }

  for (const legacyKey of legacyKeys) {
    const nextKey = legacyKey.replace(LEGACY_STORAGE_PREFIX, STORAGE_PREFIX);
    if (window.localStorage.getItem(nextKey) !== null) continue;
    const value = window.localStorage.getItem(legacyKey);
    if (value !== null) window.localStorage.setItem(nextKey, value);
  }
}

export function emitProgressUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PROGRESS_EVENT));
}
