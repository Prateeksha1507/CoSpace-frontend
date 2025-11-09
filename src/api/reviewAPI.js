import { authFetch, publicFetch, getToken } from './authAPI';

/**
 * Add a review for an event.
 * Endpoint: POST /api/reviews/:eventId
 * Auth: user required
 */
export async function addReview(eventId, { rating, comment }) {
  if (!eventId) throw new Error('eventId is required');
  const payload = {
    rating: Number(rating),
    ...(comment ? { comment } : {}),
  };
  return await authFetch(`/api/reviews/${encodeURIComponent(eventId)}`, {
    method: 'POST',
    body: payload,
  });
}

/**
 * Get a single review by its ID.
 * Endpoint: GET /api/reviews/:id
 * Auth: public
 */
export async function fetchReviewById(id) {
  if (!id) throw new Error('review id is required');
  return await publicFetch(`/api/reviews/${encodeURIComponent(id)}`);
}

/**
 * Delete a review by its ID (only author).
 * Endpoint: DELETE /api/reviews/:id
 * Auth: user required
 */
export async function deleteReview(id) {
  if (!id) throw new Error('review id is required');
  return await authFetch(`/api/reviews/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

/**
 * Get all reviews for an event, split by role.
 * Endpoint: GET /api/reviews/event/:eventId/by-role
 * Auth: public — anyone can view reviews after the event has passed.
 * If a user token is provided, backend will include { viewerEligible: true } if they can post.
 * Returns: { volunteers: Review[], participants: Review[], donors: Review[], viewerEligible: boolean }
 */
export async function fetchEventReviewsByRole(eventId) {
  if (!eventId) throw new Error('eventId is required');

  // include token if available, for viewer eligibility
  const token = getToken();
  if (token) {
    return await authFetch(`/api/reviews/event/${encodeURIComponent(eventId)}/by-role`);
  } else {
    return await publicFetch(`/api/reviews/event/${encodeURIComponent(eventId)}/by-role`);
  }
}
