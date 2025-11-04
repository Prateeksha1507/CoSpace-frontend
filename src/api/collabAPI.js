// collabAPI.js
import { authFetch } from "./authAPI";

const COLLAB_BASE = "/api/collab";

/**
 * Canonical status values returned by the backend
 */
export const COLLAB_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
  BLOCKED: "blocked_by_existing_collab",
  NOT_REQUESTED: "not_requested",
};

/**
 * Helper: given a status, can this org create a new collab request?
 * (UI sugar; final authority is backend validation.)
 */
export function canRequestFromStatus(status) {
  return (
    status === COLLAB_STATUS.NOT_REQUESTED ||
    status === COLLAB_STATUS.REJECTED ||
    status === COLLAB_STATUS.CANCELLED
  );
}

/**
 * POST /api/collab/:eventId/requests
 * Body: { note?: string }
 * Creates a collaboration request for the current org.
 */
export async function requestCollab(eventId, { note } = {}) {
  if (!eventId) throw new Error("eventId is required");
  return await authFetch(`${COLLAB_BASE}/${eventId}/requests`, {
    method: "POST",
    body: note ? { note } : {},
  });
}

/**
 * GET /api/collab/:eventId/requests/me
 * Returns: { status: 'pending'|'accepted'|'rejected'|'cancelled'|'blocked_by_existing_collab'|'not_requested', request?: {...} }
 */
export async function getMyCollabStatus(eventId) {
  if (!eventId) throw new Error("eventId is required");
  return await authFetch(`${COLLAB_BASE}/${eventId}/requests/me`);
}

/**
 * GET /api/collab/:eventId/requests
 * Conducting org only. Optionally supports pagination if backend adds it.
 * Returns: { items: Array<CollabRequest> }
 */
export async function listCollabRequests(eventId, { page, limit } = {}) {
  if (!eventId) throw new Error("eventId is required");
  const params = new URLSearchParams();
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  const qs = params.toString() ? `?${params.toString()}` : "";
  return await authFetch(`${COLLAB_BASE}/${eventId}/requests${qs}`);
}

/**
 * POST /api/collab/:eventId/requests/:requestId/accept
 * Conducting org only.
 */
export async function acceptCollabRequest(eventId, requestId) {
  if (!eventId) throw new Error("eventId is required");
  if (!requestId) throw new Error("requestId is required");
  return await authFetch(`${COLLAB_BASE}/${eventId}/requests/${requestId}/accept`, {
    method: "POST",
  });
}

/**
 * POST /api/collab/:eventId/requests/:requestId/reject
 * Conducting org only.
 */
export async function rejectCollabRequest(eventId, requestId) {
  if (!eventId) throw new Error("eventId is required");
  if (!requestId) throw new Error("requestId is required");
  return await authFetch(`${COLLAB_BASE}/${eventId}/requests/${requestId}/reject`, {
    method: "POST",
  });
}

/**
 * DELETE /api/collab/:eventId/requests/:requestId
 * Requesting org can cancel its own pending request.
 */
export async function cancelMyCollabRequest(eventId, requestId) {
  if (!eventId) throw new Error("eventId is required");
  if (!requestId) throw new Error("requestId is required");
  return await authFetch(`${COLLAB_BASE}/${eventId}/requests/${requestId}`, {
    method: "DELETE",
  });
}
