// src/api/usersAPI.js
import { authFetch, publicFetch } from './authAPI';

// GET /api/users/feed
export async function getUserFeed() {
  try {
    return await authFetch('/api/users/feed');
  } catch (err) {
    console.error('Error fetching user feed:', err.message);
    throw err;
  }
}

export async function fetchUserById(id) {
  return publicFetch(`/api/users/${encodeURIComponent(id)}`);
}