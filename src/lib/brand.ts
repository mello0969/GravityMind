export const BRAND_NAME = "GRAVITYMIND";
export const STORAGE_PREFIX = "gravitymind:";
const LEGACY_STORAGE_PREFIX = "fisicafacil:";
export const PROGRESS_EVENT = "gravitymind:progress-updated";
let activeAccountId: string | null = null;
const DEVICE_KEYS = new Set(["settings", "cookie-consent"]);

export function setLocalAccount(userId: string | null) {
  if (typeof window !== "undefined") activeAccountId = userId;
}

export function localAccountId() {
  return activeAccountId;
}

export function isCurrentStorageKey(key: string) {
  if (!key.startsWith(STORAGE_PREFIX)) return false;
  if ([...DEVICE_KEYS].some((suffix) => key === STORAGE_PREFIX + suffix)) return true;
  return activeAccountId
    ? key.startsWith(`${STORAGE_PREFIX}account:${activeAccountId}:`)
    : !key.startsWith(`${STORAGE_PREFIX}account:`);
}

export function storageKey(suffix: string) {
  const owner = activeAccountId && !DEVICE_KEYS.has(suffix) ? `account:${activeAccountId}:` : "";
  return `${STORAGE_PREFIX}${owner}${suffix}`;
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
