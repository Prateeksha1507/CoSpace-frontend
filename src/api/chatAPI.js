// chatAPI.js
import { authFetch, getCurrentActor } from './authAPI';
import { fetchUserById } from './userAPI';
import { fetchOrgById } from './orgAPI';

const BASE = '/api/chats';

/**
 * GET /api/chats
 * Returns last message only (per your controller's projection) + participants + lastActivityAt
 * @param {Object} [opts]
 * @param {boolean} [opts.hydrate=false] - If true, fetches full docs for participants
 */
export async function listMyConversations(opts = {}) {
  const { hydrate = false } = opts;
  const items = await authFetch(`${BASE}`);

  if (!hydrate) return items;

  const me = await getCurrentActor();
  return await hydrateParticipantsForChats(items, me);
}

/**
 * GET /api/chats/:convoId
 * Full chat document (includes entire messages array)
 * @param {string} convoId
 * @param {Object} [opts]
 * @param {boolean} [opts.hydrate=false]
 */
export async function getConversation(convoId, opts = {}) {
  const { hydrate = false } = opts;
  const chat = await authFetch(`${BASE}/${encodeURIComponent(convoId)}`);

  if (!hydrate) return chat;

  const me = await getCurrentActor();
  const [withHydration] = await hydrateParticipantsForChats([chat], me);
  return withHydration;
}

/**
 * GET /api/chats/:convoId/messages?before=&limit=
 * Paginates messages (server sorts desc, we return as-is)
 * @param {string} convoId
 * @param {Object} [params]
 * @param {string|Date} [params.before] - fetch messages strictly before this timestamp
 * @param {number} [params.limit=30]
 */
export async function listMessages(convoId, params = {}) {
  const q = new URLSearchParams();
  if (params.before) q.set('before', new Date(params.before).toISOString());
  if (params.limit) q.set('limit', String(params.limit));

  const qs = q.toString() ? `?${q.toString()}` : '';
  return await authFetch(`${BASE}/${encodeURIComponent(convoId)}/messages${qs}`);
}

/**
 * POST /api/chats/:convoId/messages
 * @param {string} convoId
 * @param {{ text: string }} payload
 */
export async function sendMessage(convoId, { text }) {
  return await authFetch(`${BASE}/${encodeURIComponent(convoId)}/messages`, {
    method: 'POST',
    body: { text },
  });
}

/* ---------------- Convenience helpers ---------------- */

/**
 * Returns the "other" participant (not the current actor)
 * @param {Object} chat - chat doc with participants: [{kind, ref, lastReadAt}]
 * @param {Object} me   - current actor from getCurrentActor()
 * @returns {Object|null} participant
 */
export function getOtherParticipant(chat, me) {
  if (!chat?.participants || !me) return null;
  const myKind = me.type === 'org' ? 'Organization' : 'User';
  return chat.participants.find(p => !(p.kind === myKind && String(p.ref) === String(me.id))) || null;
}

/**
 * Hydrate participants to include minimal profile display data.
 * Adds `participantsDetailed: [{ kind, ref, lastReadAt, profile }]`
 * where `profile` is a User/Org document result.
 */
async function hydrateParticipantsForChats(chats, me) {
  return await Promise.all(
    chats.map(async (chat) => {
      const enriched = { ...chat };
      if (!Array.isArray(chat.participants)) {
        enriched.participantsDetailed = [];
        return enriched;
      }

      const detailed = await Promise.all(
        chat.participants.map(async (p) => {
          const id = String(p.ref);
          const profile = p.kind === 'Organization' ? await fetchOrgById(id) : await fetchUserById(id);
          return { ...p, profile };
        })
      );

      enriched.participantsDetailed = detailed;
      enriched.otherParticipant = getOtherParticipant(enriched, me);
      return enriched;
    })
  );
}

/* ---------------- Optional client-side pagination utility ---------------- */

/**
 * Cursor loader for messages:
 * Usage:
 *   const pager = createMessagePager(convoId, { pageSize: 30 });
 *   const first = await pager.next(); // [{...}, ...] (desc by time)
 *   const next  = await pager.next(); // older
 */
export function createMessagePager(convoId, { pageSize = 30 } = {}) {
  let before = null;
  let exhausted = false;

  return {
    async next() {
      if (exhausted) return [];
      const batch = await listMessages(convoId, { before, limit: pageSize });
      if (!batch.length) {
        exhausted = true;
        return [];
      }
      // server returns newest->oldest; advance cursor to oldest.at in this batch
      const oldest = batch[batch.length - 1];
      before = oldest.at;
      return batch;
    },
    hasMore() {
      return !exhausted;
    },
    reset() {
      before = null;
      exhausted = false;
    },
  };
}


export async function createOrGetChat({ recipientKind, recipientId }) {
  // recipientKind: 'Organization' | 'User'
  return await authFetch(`/api/chats`, {
    method: 'POST',
    body: { recipientKind, recipientId },
  });
}
