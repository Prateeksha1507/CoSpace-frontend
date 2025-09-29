import { login as dummyLogin, verify as dummyVerify } from "../dummy/db"; 

const TOKEN_KEY = "cospace_auth_token";

// --- Token utils ---
export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || null;
}
export function setToken(t) {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}
export function logout() {
  setToken(null);
}

export async function login({ email, password }) {
  const { token, user } = await dummyLogin({ email, password });
  setToken(token);
  return { user };
}

// Verify: check stored token with backend, return user or null
export async function verify() {
  const token = getToken();
  if (!token) return { user: null };
  const { user } = await dummyVerify(token);
  return { user };
}

// Current user info (shortcut)
export async function getCurrentUser() {
  const { user } = await verify();
  return user;
}
