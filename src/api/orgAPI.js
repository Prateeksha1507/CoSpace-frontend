// src/api/orgAPI.js
import { authFetch, publicFetch, verify } from './authAPI';

/* -------------- helpers -------------- */
async function getCurrentOrgActor() {
  const { actor } = await verify();         // verify() should normalize to { actor } = user || org
  if (!actor || actor.type !== 'org') throw new Error('Unauthorized (org only)');
  // actor has: { email, type: 'org', id, username, ... }
  return actor;
}

/* -------------- by-ID endpoints -------------- */

export async function fetchOrgById(id) {
  return publicFetch(`/api/orgs/${encodeURIComponent(id)}`);
}

export async function fetchOrgEventsById(orgId, { role, from, to, sort = 'date:asc', page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams({ sort, page, limit });
  if (role) params.set('role', role);
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  const qs = params.toString() ? `?${params.toString()}` : '';
  return publicFetch(`/api/events/org/${encodeURIComponent(orgId)}${qs}`);
}

// Followers — your follow routes are under /api/follow
// GET /api/follow/org/:id/followers
export async function fetchOrgFollowers(orgId) {
  return publicFetch(`/api/org/${encodeURIComponent(orgId)}/followers`);
}

export async function fetchOrgFollowerCount(orgId) {
  const followers = await fetchOrgFollowers(orgId);
  return Array.isArray(followers) ? followers.length : (followers?.count ?? 0);
}

// If you really have: GET /api/orgs/:id/dashboard (protected)
export async function fetchOrgDashboardData(orgId) {
  return authFetch(`/api/orgs/${encodeURIComponent(orgId)}/dashboard`);
}

// GET /api/orgs
export async function fetchAllOrgs() {
  return publicFetch('/api/orgs');
}

/* -------------- current-org shortcuts -------------- */

export async function fetchCurrentOrg() {
  const actor = await getCurrentOrgActor();
  return actor;
}

export async function fetchMyOrgEvents(opts = {}) {
  const actor = await getCurrentOrgActor();
  return fetchOrgEventsById(actor.id, opts);
}

export async function fetchMyOrgFollowerCount() {
  const actor = await getCurrentOrgActor();
  return fetchOrgFollowerCount(actor.id);
}

// Preferred: you implemented GET /api/orgs/me/dashboard
export async function fetchMyOrgDashboard() {
  return authFetch('/api/orgs/dashboard');
}
