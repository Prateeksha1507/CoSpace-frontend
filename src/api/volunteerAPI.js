import { authFetch, publicFetch } from "./authAPI";

export async function volunteer(eventId) {
  return await authFetch(`/api/volunteer/volunteer/${eventId}`, {
    method: "POST",
  });
}

export async function unvolunteer(eventId) {
  return await authFetch(`/api/volunteer/unvolunteer/${eventId}`, {
    method: "POST",
  });
}

export async function listVolunteers(eventId) {
  return await authFetch(`/api/volunteer/volunteers/${eventId}`);
}

export async function listUserVolunteered(userId) {
  return await authFetch(`/api/volunteer/volunteered/${userId}`);
}

export async function approveVolunteer(eventId, userId) {
  return await authFetch(`/api/volunteer/approve/${eventId}/${userId}`, {
    method: "POST",
  });
}

export async function rejectVolunteer(eventId, userId) {
  return await authFetch(`/api/volunteer/reject/${eventId}/${userId}`, {
    method: "POST",
  });
}

export const isMeVolunteering = async (eventId) => {
  const res = await authFetch(`/api/volunteer/isMeVolunteering/${eventId}`);
  return res.data;
};