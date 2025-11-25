import { authFetch } from "./authAPI";

/**
 * Admin-only:
 * GET /api/admin/orgs/unverified
 */
export async function viewUnverifiedOrgs() {
  return await authFetch("/api/admin/orgs/unverified", {
    method: "GET",
  });
}

/**
 * Admin-only:
 * GET /api/admin/orgs/:orgId/docs
 */
export async function viewOrgDocs(orgId) {
  if (!orgId) throw new Error("orgId is required");
  return await authFetch(`/api/admin/orgs/${orgId}/docs`, {
    method: "GET",
  });
}

/**
 * Admin-only:
 * PATCH /api/admin/orgs/:orgId/verify
 */
export async function verifyOrg(orgId) {
  if (!orgId) throw new Error("orgId is required");
  return await authFetch(`/api/admin/orgs/${orgId}/verify`, {
    method: "PATCH",
  });
}
