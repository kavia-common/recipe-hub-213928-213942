/**
 * Minimal API client for Recipe Hub.
 * Uses env vars injected by CRA at build time.
 */

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_BACKEND_URL ||
  "";

/**
 * Normalize base URL by removing trailing slash.
 * @param {string} baseUrl
 * @returns {string}
 */
function normalizeBase(baseUrl) {
  return String(baseUrl || "").replace(/\/+$/, "");
}

/**
 * Build a complete URL from base + path.
 * @param {string} path
 * @returns {string}
 */
function buildUrl(path) {
  const base = normalizeBase(API_BASE);
  const p = String(path || "");
  if (!base) return p;
  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  return `${base}${p.startsWith("/") ? "" : "/"}${p}`;
}

/**
 * Safely parse JSON if possible.
 * @param {Response} res
 * @returns {Promise<any>}
 */
async function parseJsonSafe(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

/**
 * Core request helper.
 * @param {string} path
 * @param {RequestInit} [options]
 * @returns {Promise<any>}
 */
async function request(path, options = {}) {
  const res = await fetch(buildUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    const message =
      (data && (data.detail || data.message)) ||
      `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

// PUBLIC_INTERFACE
export async function searchRecipes({ q, limit = 24 } = {}) {
  /**
   * Search recipes via backend if available.
   * Fallback handling is performed in the UI if endpoint is missing.
   */
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (limit) params.set("limit", String(limit));
  const qs = params.toString();
  return request(`/recipes${qs ? `?${qs}` : ""}`, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function getRecipeById(id) {
  /** Fetch a single recipe by id. */
  return request(`/recipes/${encodeURIComponent(id)}`, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function getHealth() {
  /** Health check (path comes from REACT_APP_HEALTHCHECK_PATH if configured). */
  const path = process.env.REACT_APP_HEALTHCHECK_PATH || "/healthz";
  return request(path, { method: "GET" });
}
