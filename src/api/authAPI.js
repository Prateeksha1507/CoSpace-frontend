import { fetchOrgById } from "./orgAPI";
import {fetchUserById} from "./userAPI"

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
  window.location.href="/login"
}

/* ---------------- Core Fetch Helper ---------------- */
async function jsonFetch(path, { method = "GET", body, auth = false } = {}) {
  let headers = {};
  let finalBody = body;

  const isFormData = body instanceof FormData;

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

export async function signup(payload) {
  const data = await publicFetch('/api/auth/signup', {
    method: 'POST',
    body: payload,
  });

  const token = data?.token || data?.accessToken || data?.jwt;
  if (token) setToken(token);

  const actor = data?.user || null;
  return { token, actor };
}

export async function updateMyProfile(fields = {}) {
  const {name, username, bio, interests, headName, website, regId, affiliation, profileImage, currentPassword, newPassword, mission, type
  } = fields;


  let body;
    const fd = new FormData();
    if (name)     fd.append("name", name);
    if (username) fd.append("username", username);
    if (bio)      fd.append("bio", bio);
    if (interests) {
      const csv = Array.isArray(interests) ? interests.join(",") : String(interests);
      fd.append("interests", csv);
    }
    if (headName)     fd.append("headName", headName);
    if (website)      fd.append("website", website);
    if (regId)        fd.append("regId", regId);
    if (mission)      fd.append("mission", mission);
    if (affiliation)  fd.append("affiliation", affiliation);
    if (type)         fd.append("orgType", type);
    if (currentPassword) fd.append("currentPassword", currentPassword);
    if (newPassword)     fd.append("newPassword", newPassword);

    if (profileImage instanceof File || profileImage instanceof Blob) {
      fd.append("profileImage", profileImage);
    }
    body = fd;  

  // Backend: PUT /api/auth/me (with multer.single('profileImage') support)
  return await authFetch("/api/auth/update", {
    method: "PUT",
    body,
  });
}

export async function deleteMyProfile() {
  const res = await authFetch("/api/auth/delete", { method: "DELETE" });
  logout();
  return res;
}

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
export async function getCurrentActor() {
  const { actor } = await verify();
  return actor;
}

export async function getCurrentActorDocument() {
  const { actor } = await verify();
  if (!actor) return null;
  const doc =
    actor?.type === "org"
      ? await fetchOrgById(actor.id)
      : await fetchUserById(actor.id);
    console.log(doc)
  return { ...doc, type: actor?.type, id: actor?.id };
}
