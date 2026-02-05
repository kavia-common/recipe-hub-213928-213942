/**
 * Favorites persistence using localStorage.
 */

const STORAGE_KEY = "recipehub:favorites:v1";

/**
 * @returns {Set<string>}
 */
function readIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.map(String));
  } catch {
    return new Set();
  }
}

/**
 * @param {Set<string>} ids
 */
function writeIds(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // ignore storage quota / privacy mode failures
  }
}

// PUBLIC_INTERFACE
export function getFavoriteIds() {
  /** Get favorite recipe ids. */
  return readIds();
}

// PUBLIC_INTERFACE
export function isFavorite(id) {
  /** Check favorite status for a recipe id. */
  return readIds().has(String(id));
}

// PUBLIC_INTERFACE
export function toggleFavorite(id) {
  /** Toggle favorite status for a recipe id; returns the new boolean status. */
  const ids = readIds();
  const key = String(id);
  if (ids.has(key)) {
    ids.delete(key);
    writeIds(ids);
    return false;
  }
  ids.add(key);
  writeIds(ids);
  return true;
}

// PUBLIC_INTERFACE
export function clearFavorites() {
  /** Remove all favorites. */
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
