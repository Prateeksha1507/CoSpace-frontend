// src/api/orgAPI.js

import {
  // raw lists for explore
  getOrgs,
  getOrgByEmail,

  // backend-style facades
  apiGetOrgById,               // GET /orgs/:id
  apiGetOrgEvents,             // GET /orgs/:id/events?...
  apiGetOrgFollowerCount,      // GET /orgs/:id/followers/count
  apiGetOrgDashboard,          // GET /orgs/:id/dashboard
} from "../dummy/db";

import { verify } from "./authAPI"; // <- uses cospace_auth_token internally

/* ---------------- helpers ---------------- */

async function resolveCurrentOrg() {
  // ask authAPI to verify the stored token; it returns { user } or { user: null }
  const { user } = await verify();
  if (!user || user.type !== "org") {
    throw new Error("Unauthorized"); // consistent with your dummy backend
  }
  const org = getOrgByEmail(user.email);
  if (!org) throw new Error("Org not found");
  return org;
}

/* ---------------- by-ID endpoints (routing-friendly) ---------------- */

/** Get an org by ID (async). */
export async function fetchOrgById(id) {
  return apiGetOrgById(Number(id));
}

/** Get events for a specific orgId (paged). */
export async function fetchOrgEventsById(
  orgId,
  {
    role,            // "conducting" | "collab" | undefined (both)
    from,            // ISO inclusive
    to,              // ISO inclusive
    sort = "date:asc",
    page = 1,
    limit = 20,
  } = {}
) {
  return apiGetOrgEvents(Number(orgId), { role, from, to, sort, page, limit });
}

/** Get follower count for an orgId. */
export async function fetchOrgFollowerCount(orgId) {
  const { count } = await apiGetOrgFollowerCount(Number(orgId));
  return count;
}

/** Dashboard bundle by orgId. */
export async function fetchOrgDashboardData(orgId) {
  return apiGetOrgDashboard(Number(orgId));
}

/** Explore/Directory: list all orgs. */
export function fetchAllOrgs() {
  return getOrgs() || [];
}

/* ---------------- current-org endpoints (resolve via token) ---------------- */

/** Current org (derived from stored token). */
export async function fetchCurrentOrg() {
  return resolveCurrentOrg();
}

/** Current org's events (paged). */
export async function fetchMyOrgEvents(opts = {}) {
  const org = await resolveCurrentOrg();
  return apiGetOrgEvents(org.orgId, opts);
}

/** Current org's follower count. */
export async function fetchMyOrgFollowerCount() {
  const org = await resolveCurrentOrg();
  const { count } = await apiGetOrgFollowerCount(org.orgId);
  return count;
}

/** Current org dashboard bundle. */
export async function fetchMyOrgDashboard() {
  const org = await resolveCurrentOrg();
  return apiGetOrgDashboard(org.orgId);
}
