// src/api/followAPI.js
import { authFetch, publicFetch } from './authAPI';

/* ---------- public ---------- */

// GET /org/:id/followers
export async function listFollowers(orgId) {
  return publicFetch(`/api/org/${encodeURIComponent(orgId)}/followers`);
}

// GET /user/:id/following
export async function listFollowing(userId) {
  return publicFetch(`/api/user/${encodeURIComponent(userId)}/following`);
}

/* ---------- protected ---------- */

// GET /follow/doIFollow/:orgId
export async function doIFollow(orgId) {
  return authFetch(`/api/follow/doIFollow/${encodeURIComponent(orgId)}`, { method: 'GET' });
}

// GET /follow/doesFollowMe/:userId
export async function doesFollowMe(userId) {
  return authFetch(`/api/follow/doesFollowMe/${encodeURIComponent(userId)}`, { method: 'GET' });
}

// POST /follow  { orgId }
export async function followOrg(orgId) {
  return authFetch(`/api/follow`, {
    method: 'POST',
    body: { orgId },
  });
}

// POST /unfollow  { orgId }
export async function unfollowOrg(orgId) {
  return authFetch(`/api/unfollow`, {
    method: 'POST',
    body: { orgId },
  });
}
