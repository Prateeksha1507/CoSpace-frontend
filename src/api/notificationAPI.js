import { authFetch } from "./authAPI";

/**
 * GET /api/notifications
 * options:
 *  - page (default 1)
 *  - limit (default 20)
 *  - unreadOnly (default false)
 */
export async function fetchMyNotifications({
  page = 1,
  limit = 20,
  unreadOnly = false,
} = {}) {
  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("limit", String(limit));
  if (unreadOnly) qs.set("unreadOnly", "true");

  return await authFetch(`/api/notifications?${qs.toString()}`);
}

/**
 * PATCH /api/notifications/:id/read
 */
export async function markNotificationAsRead(id) {
  if (!id) throw new Error("notification id is required");
  return await authFetch(`/api/notifications/${id}/read`, {
    method: "PATCH",
  });
}

/**
 * PATCH /api/notifications/read-all
 */
export async function markAllNotificationsAsRead() {
  return await authFetch(`/api/notifications/read-all`, {
    method: "PATCH",
  });
}

/**
 * Convenience: get only unread notifications
 */
export async function fetchUnreadNotifications({ page = 1, limit = 50 } = {}) {
  return await fetchMyNotifications({ page, limit, unreadOnly: true });
}

/**
 * Convenience: unread count (client-side)
 */
export async function fetchUnreadCount() {
  const unread = await fetchUnreadNotifications({ page: 1, limit: 200 });
  return Array.isArray(unread) ? unread.length : unread?.items?.length || 0;
}
