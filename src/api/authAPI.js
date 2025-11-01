const TOKEN_KEY = "cospace_auth_token";
const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

/* ---------------- Token utils ---------------- */
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || null;
  } catch {
    return null;
  }
}

export function setToken(t) {
  try {
    t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

export function logout() {
  setToken(null);
}

/* ---------------- Core Fetch Helper ---------------- */
async function jsonFetch(path, { method = "GET", body, auth = false } = {}) {
  let headers = {};
  let finalBody = body;

  // ✅ Detect FormData automatically
  const isFormData = body instanceof FormData;

  // Set JSON header only if not FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // Add Authorization header if needed
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  // JSON.stringify only non-FormData bodies
  if (body && !isFormData) {
    finalBody = JSON.stringify(body);
  }

  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    method,
    headers,
    body: finalBody,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // ignore non-JSON responses
  }

  if (!res.ok) {
    if (res.status === 401) logout();
    throw new Error(data?.message || `HTTP ${res.status}`);
  }

  return data;
}

/* ---------------- Authenticated / Public Fetch ---------------- */
export async function authFetch(path, options = {}) {
  return await jsonFetch(path, { ...options, auth: true });
}

export async function publicFetch(path, options = {}) {
  return await jsonFetch(path, options);
}

/* ---------------- Auth APIs ---------------- */

// POST /api/auth/login
export async function login({ email, password }) {
  const data = await jsonFetch("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });

  const token = data?.token || data?.accessToken || data?.jwt;
  if (token) setToken(token);

  return { user: data?.user ?? null };
}

// GET /api/auth/verify
export async function verify() {
  const token = getToken();
  if (!token) return { actor: null };

  try {
    const data = await jsonFetch("/api/auth/verify", { auth: true });
    const actor = data?.user || data?.org || null;
    return { actor };
  } catch (err) {
    console.warn("verify failed:", err.message);
    logout();
    return { actor: null };
  }
}

// Shortcut to get current user/org
export async function getCurrentUser() {
  const { actor } = await verify();
  return actor;
}
