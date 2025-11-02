import { authFetch, publicFetch } from "./authAPI";

export async function createDonation(donationData) {
  return await authFetch(`/api/donation`, {
    method: "POST",
    body: donationData,
  });
}

export async function getDonations(eventId) {
  return await authFetch(`/api/donation/${eventId}`);
}

export async function getUserDonations(userId) {
  return await authFetch(`/api/donation/user/${userId}`);
}
