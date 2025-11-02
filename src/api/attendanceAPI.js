import { authFetch, publicFetch } from "./authAPI";

export async function attend(eventId) {
  return await authFetch(`/api/attendance/attend/${eventId}`, {
    method: "POST",
  });
}

export async function unattend(eventId) {
  return await authFetch(`/api/attendance/unattend/${eventId}`, {
    method: "POST",
  });
}

export async function isMeAttending(eventId) {
  return await authFetch(`/api/attendance/isMeAttending/${eventId}`);
}

export async function getAttendeeDetails(eventId) {
  return await authFetch(`/api/attendance/${eventId}/details`);
}

export async function getAttendingDetails(userId) {
  return await authFetch(`/api/attendance/user/${userId}`);
}