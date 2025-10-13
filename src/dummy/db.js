// ====== Read-only dummy DB ======
const seedData = {
  users: [
    {
      userId: 1,
      name: "Alice Johnson",
      username: "alicej",
      email: "alice@example.com",
      passwordHash: "hashed_pw_1",
      dob: "1998-04-12",
      bio: "Love volunteering in community events.",
      interests: ["Environment", "Education"],
      profilePicture: "https://www.example.com/avatars/avatar1.jpg"
    },
    {
      userId: 2,
      name: "Ethan Carter",
      username: "ethanc",
      email: "ethan@example.com",
      passwordHash: "hashed_pw_2",
      dob: "1995-11-05",
      bio: "Passionate about food security projects.",
      interests: ["Education", "Health"],
      profilePicture: "https://www.example.com/avatars/avatar2.jpg"
    }
  ],

  orgs: [
    {
      orgId: 10,
      name: "Helping Hands Foundation",
      headName: "Sarah Chen",
      type: "Non-Profit",
      email: "contact@hhf.org",
      website: "helpinghands.org",
      regId: "HHF-2020",
      affiliation: "Local NGOs",
      username: "helpingHands",
      passwordHash: "hashed_pw_1",
      profilePicture: "https://www.example.com/avatars/avatar3.jpg"
    },
    {
      orgId: 11,
      name: "Green Earth Initiative",
      headName: "David Lee",
      type: "Non-Profit",
      email: "hello@greenearth.org",
      website: "greenearth.org",
      regId: "GEI-2015",
      affiliation: "International NGO Network",
      username: "greeney",
      passwordHash: "hashed_pw_2",
      profilePicture: "https://www.example.com/avatars/avatar4.jpg"
    }
  ],

  events: [
    {
      eventId: 101,
      name: "Community Cleanup Drive",
      description: "Join us to clean and green Central Park.",
      date: "2024-07-20",
      venue: "Central Park, NY",
      conductingOrgId: 10,
      collaboratingOrgId: null,
      totalAttending: 30
    },
    {
      eventId: 102,
      name: "Food Bank Assistance",
      description: "Assist with distributing meals at the downtown food bank.",
      date: "2026-06-15",
      venue: "Downtown Food Bank",
      conductingOrgId: 10,
      collaboratingOrgId: 11,
      totalAttending: 45
    },
    {
      eventId: 201,
      name: "Tree Planting Marathon",
      description: "Help plant 500+ trees by the riverside.",
      date: "2024-08-12",
      venue: "Riverside Park",
      conductingOrgId: 11,
      collaboratingOrgId: null,
      totalAttending: 60
    },
    {
      eventId: 202,
      name: "Recycling Awareness Workshop",
      description: "Learn and teach recycling techniques.",
      date: "2026-05-05",
      venue: "City Hall Auditorium",
      conductingOrgId: 11,
      collaboratingOrgId: null,
      totalAttending: 20
    }
  ],

  follows: [
    { userId: 1, orgId: 10 },     // Alice → Helping Hands
    { userId: 2, orgId: 10 },     // Ethan → Helping Hands
    { userId: 2, orgId: 11 }      // Ethan → Green Earth
  ],

// === Conversations & Messages ===
conversations: [
  {
    convoId: "cleanup",
    title: "Community Cleanup Drive",
    participants: [
      { id: 1, type: "user" },   // Alice
      { id: 10, type: "org" }    // Helping Hands
    ],
  },
  {
    convoId: "foodbank",
    title: "Food Bank Assistance",
    participants: [
      { id: 2, type: "user" },   // Ethan
      { id: 10, type: "org" }    // Helping Hands
    ],
  },
  {
    convoId: "green",
    title: "Tree Planting Marathon",
    participants: [
      { id: 2, type: "user" },
      { id: 11, type: "org" }
    ],
  },
],

messages: [
  { id: 1, convoId: "cleanup", from: { id: 10, type: "org" }, text: "Hi there!", time: "2024-07-18 09:00" },
  { id: 2, convoId: "cleanup", from: { id: 1, type: "user" }, text: "Hello! Excited to join the cleanup!", time: "2024-07-18 09:02" },

  { id: 3, convoId: "foodbank", from: { id: 10, type: "org" }, text: "Thanks for signing up, Ethan!", time: "2024-06-10 10:00" },
  { id: 4, convoId: "foodbank", from: { id: 2, type: "user" }, text: "Glad to help ", time: "2024-06-10 10:05" },
  { id: 5, convoId: "foodbank", from: { id: 2, type: "user" }, text: "😊", time: "2024-06-10 10:06" },

  { id: 5, convoId: "green", from: { id: 11, type: "org" }, text: "Welcome to Green Earth Initiative!", time: "2024-08-10 14:00" },
],



};

// ====== DB access ======
function db() {
  return seedData;
}

// ---- minimal helpers (Node+Browser safe) ----
const simpleHash = (s = "") => {
  // tiny non-crypto demo hash to match seeded hashed_pw_1/_2 for "demo"
  return s === "demo" ? "hashed_pw_1" : "hashed_pw_2";
};

// base64 encode/decode that works in browser and Node without deprecated APIs
const encode = (obj) => {
  const json = JSON.stringify(obj);
  if (typeof window !== "undefined" && window.btoa) {
    return window.btoa(json);
  }
  return Buffer.from(json, "utf8").toString("base64");
};
const decode = (tok) => {
  const json =
    typeof window !== "undefined" && window.atob
      ? window.atob(tok)
      : Buffer.from(tok, "base64").toString("utf8");
  return JSON.parse(json);
};

const now = () => Date.now();
const toNum = (v) => Number(v);
const isFiniteNum = (n) => Number.isFinite(n);

// ---- sorting helper: "date:asc" | "date:desc" | "name:asc" | "name:desc"
function sortItems(items, sort = "date:asc") {
  const [field, dir] = String(sort).split(":");
  const mult = dir === "desc" ? -1 : 1;
  if (field === "date") {
    return [...items].sort(
      (a, b) => (new Date(a.date) - new Date(b.date)) * mult
    );
  }
  if (field === "name") {
    return [...items].sort((a, b) =>
      String(a.name).localeCompare(String(b.name)) * mult
    );
  }
  return items;
}

// ---- pagination helper
function paginate(items, page = 1, limit = 20) {
  const p = Math.max(1, Number(page) || 1);
  const l = Math.min(100, Math.max(1, Number(limit) || 20));
  const start = (p - 1) * l;
  const end = start + l;
  return {
    items: items.slice(start, end),
    page: p,
    limit: l,
    total: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / l)),
  };
}

// --- Users ---
export function getUsers() {
  return [...db().users];
}
export function getUserById(id) {
  return db().users.find((u) => u.userId === toNum(id)) || null;
}

// --- Orgs ---
export function getOrgs() {
  return [...db().orgs];
}
export function getOrgById(id) {
  return db().orgs.find((o) => o.orgId === toNum(id)) || null;
}
export function getOrgByEmail(email) {
  const e = String(email || "").toLowerCase();
  return db().orgs.find((o) => o.email.toLowerCase() === e) || null;
}

// --- Events (raw) ---
export function getEvents() {
  return [...db().events];
}
export function getEventById(id) {
  return db().events.find((e) => e.eventId === toNum(id)) || null;
}
// Backend-style filter combining conducting + collaborating
export function getEventsByOrgId(orgId) {
  const id = toNum(orgId);
  const events = db().events || [];
  return events.filter(
    (e) => toNum(e.conductingOrgId) === id || toNum(e.collaboratingOrgId) === id
  );
}

// --- Follows ---
export function getFollows() {
  return [...db().follows];
}
export function getFollowingOrgs(userId) {
  const orgIds = (db().follows || [])
    .filter((f) => f.userId === toNum(userId))
    .map((f) => f.orgId);
  return (db().orgs || []).filter((o) => orgIds.includes(o.orgId));
}
export function getFollowersForOrg(orgId) {
  const userIds = (db().follows || [])
    .filter((f) => f.orgId === toNum(orgId))
    .map((f) => f.userId);
  return (db().users || []).filter((u) => userIds.includes(u.userId));
}
export function getFollowerCountForOrg(orgId) {
  return getFollowersForOrg(orgId).length;
}
export function isFollowing(userId, orgId) {
  return (db().follows || []).some(
    (f) => f.userId === toNum(userId) && f.orgId === toNum(orgId)
  );
}

// ===================== AUTH (dummy, stateless, no storage) =====================

// unified auth directory (users + orgs)
const AUTH_ACCOUNTS = [
  ...(db().users || []).map((u) => ({
    name: u.name,
    email: u.email,
    type: "user",
    passwordHash: u.passwordHash,
  })),
  ...(db().orgs || []).map((o) => ({
    name: o.name,
    email: o.email,
    type: "org",
    passwordHash: o.passwordHash,
  })),
];

function findAuthUserByEmail(email) {
  const e = String(email || "").toLowerCase();
  return AUTH_ACCOUNTS.find((u) => u.email.toLowerCase() === e) || null;
}

// ---- demo token (not a real JWT) ----
function issuePayload({ name, email, type }) {
  const iat = now();
  const exp = iat + 7 * 24 * 60 * 60 * 1000; // 7 days ms
  return { sub: email, name, email, type, iat, exp };
}

export function createJWT(payload) {
  return encode(issuePayload(payload));
}

export function decodeJWT(token) {
  if (!token) return null;
  try {
    return decode(token);
  } catch {
    return null;
  }
}

// ------ Auth endpoints (stateless) ------

// LOGIN: returns { token, user }
export async function login({ email, password }) {
  const user = findAuthUserByEmail(email);
  if (!user) throw new Error("User not found");
  if (user.passwordHash !== simpleHash(password)) {
    throw new Error("Invalid password (tip: use 'demo')");
  }
  const token = createJWT(user);
  return { token, user: { name: user.name, email: user.email, type: user.type } };
}

// VERIFY(token): returns { user } or { user: null }
export async function verify(token) {
  if (!token) return { user: null };
  const payload = decodeJWT(token);
  if (!payload) return { user: null };
  if (now() > payload.exp) return { user: null };
  const { name, email, type } = payload;
  return { user: { name, email, type } };
}

// --- "Backend-style" API facades (simulate REST endpoints) ---

/** GET /api/orgs/:id */
export async function apiGetOrgById(orgId) {
  const org = getOrgById(orgId);
  if (!org) throw new Error("Org not found");
  return org;
}

/** GET /api/me/org  (resolve current org from token) */
export async function apiGetMeOrg(token) {
  const { user } = await verify(token);
  if (!user || user.type !== "org") throw new Error("Unauthorized");
  const org = getOrgByEmail(user.email);
  if (!org) throw new Error("Org not found");
  return org;
}

/** GET /api/orgs/:id/events?role=&from=&to=&sort=&page=&limit= */
export async function apiGetOrgEvents(orgId, query = {}) {
  const {
    role,           // "conducting" | "collab" | undefined (both)
    from,           // ISO date inclusive
    to,             // ISO date inclusive
    sort = "date:asc",
    page = 1,
    limit = 20,
  } = query;

  const id = toNum(orgId);
  let items = getEventsByOrgId(id);

  // role filter
  if (role === "conducting") {
    items = items.filter((e) => toNum(e.conductingOrgId) === id);
  } else if (role === "collab") {
    items = items.filter((e) => toNum(e.collaboratingOrgId) === id);
  }

  // date window
  if (from) {
    const fromTs = new Date(from).getTime();
    if (Number.isFinite(fromTs)) items = items.filter((e) => new Date(e.date).getTime() >= fromTs);
  }
  if (to) {
    const toTs = new Date(to).getTime();
    if (Number.isFinite(toTs)) items = items.filter((e) => new Date(e.date).getTime() <= toTs);
  }

  // sort + paginate
  items = sortItems(items, sort);
  const pageObj = paginate(items, page, limit);
  return pageObj; // { items, page, limit, total, totalPages }
}

/** GET /api/orgs/:id/followers/count */
export async function apiGetOrgFollowerCount(orgId) {
  return { count: getFollowerCountForOrg(orgId) };
}

/** GET /api/orgs/:id/dashboard  (bundle) */
export async function apiGetOrgDashboard(orgId) {
  const org = await apiGetOrgById(orgId);
  const [{ items: upcoming }, { count }] = await Promise.all([
    apiGetOrgEvents(orgId, { from: new Date().toISOString(), sort: "date:asc", page: 1, limit: 100 }),
    apiGetOrgFollowerCount(orgId),
  ]);
  // You can add more aggregates if needed
  return {
    org,
    followerCount: count,
    upcomingEvents: upcoming,
    totals: {
      events: getEventsByOrgId(orgId).length,
      followers: count,
    },
  };
}

// --- Conversations ---
export function getConversations() {
  return db().conversations || [];
}

export function getConversationById(convoId) {
  return (db().conversations || []).find((c) => c.convoId === String(convoId)) || null;
}

// prefer participant-based queries; legacy getters returned nothing
export function getConversationsByUser(userId) {
  return getConversationsByParticipant({ id: userId, type: "user" });
}
export function getConversationsByOrg(orgId) {
  return getConversationsByParticipant({ id: orgId, type: "org" });
}

export function getConversationsByParticipant(participant) {
  const { id, type } = participant || {};
  return (db().conversations || []).filter((c) =>
    (c.participants || []).some(
      (p) => toNum(p.id) === toNum(id) && p.type === type
    )
  );
}

// --- Messages ---
export function getMessagesByConvo(convoId) {
  return (db().messages || []).filter(
    (m) => String(m.convoId) === String(convoId)
  );
}

export function appendMessage(convoId, message) {
  if (!getConversationById(convoId)) throw new Error("Conversation not found");
  if (!message?.from?.id || !message?.from?.type || !message?.text)
    throw new Error("Invalid message");
  const newMsg = {
    id: Date.now(),
    convoId: String(convoId),
    text: String(message.text),
    from: message.from, // { id, type }
    time: new Date().toISOString(),
  };
  db().messages.push(newMsg);
  return newMsg;
}

// Keep addMessage as alias to appendMessage (conversations don't have a messages array in seed)
export const addMessage = appendMessage;
