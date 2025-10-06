// chatsAPI.js
import {
  getConversationsByParticipant,
  getMessagesByConvo,
  appendMessage,
  getUsers,
  getOrgs,
} from "../dummy/db";
import { verify } from "./authAPI";

function resolveParticipantFromUser(user) {
  if (!user) return null;
  if (user.type === "user") {
    const u = (getUsers() || []).find(x => x.email === user.email);
    return u ? { id: u.userId, type: "user", name: u.name } : null;
  }
  if (user.type === "org") {
    const o = (getOrgs() || []).find(x => x.email === user.email);
    return o ? { id: o.orgId, type: "org", name: o.name } : null;
  }
  return null;
}

export async function getMyParticipant() {
  const { user } = await verify();
  return resolveParticipantFromUser(user);
}

export async function fetchMyConversations() {
  const me = await getMyParticipant();
  if (!me) return [];
  return getConversationsByParticipant(me);
}

export function fetchRecentMessages(convoId, limit = 10) {
  const all = (getMessagesByConvo(convoId) || []).sort(
    (a, b) => new Date(a.time) - new Date(b.time)
  );
  return all.slice(-limit);
}

export async function sendMessage(convoId, text) {
  const me = await getMyParticipant();
  if (!me) throw new Error("Not authenticated");
  return appendMessage(convoId, { from: { id: me.id, type: me.type }, text: String(text || "") });
}


export function getCounterparty(convo, me) {
  if (!convo || !me) return null;
  const other = (convo.participants || []).find(
    p => !(p.id === me.id && p.type === me.type)
  );
  if (!other) return null;

  if (other.type === "user") {
    const u = (getUsers() || []).find(x => x.userId === other.id);
    return { ...other, name: u?.name || "User", avatar: u?.avatar || null };
  }
  if (other.type === "org") {
    const o = (getOrgs() || []).find(x => x.orgId === other.id);
    return { ...other, name: o?.name || "Organization", avatar: o?.logo || null };
  }
  return other;
}