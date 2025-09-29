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
      date: "2024-06-15",
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
      date: "2024-05-05",
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
  ]
};

function db() {
  return seedData;
}

// ---- minimal helpers ----
const simpleHash = (s) => (String(s));
const encode = (obj) => btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
const decode = (tok) => JSON.parse(decodeURIComponent(escape(atob(tok))));
const now = () => Date.now();

// --- Users ---
export function getUsers() {
  return db().users;
}
export function getUserById(id) {
  return db().users.find(u => u.userId === Number(id)) || null;
}

// --- Orgs ---
export function getOrgs() {
  return db().orgs;
}
export function getOrgById(id) {
  return db().orgs.find(o => o.orgId === Number(id)) || null;
}

// --- Events ---
export function getEvents() {
  return db().events;
}
export function getEventById(id) {
  return db().events.find(e => e.eventId === Number(id)) || null;
}
export function getEventsByOrg(orgId) {
  return db().events.filter(e => e.conductingOrgId === Number(orgId));
}

// --- Follows ---
export function getFollows() {
  return db().follows;
}
export function getFollowingOrgs(userId) {
  const orgIds = db().follows.filter(f => f.userId === Number(userId)).map(f => f.orgId);
  return db().orgs.filter(o => orgIds.includes(o.orgId));
}
export function getFollowersForOrg(orgId) {
  const userIds = db().follows.filter(f => f.orgId === Number(orgId)).map(f => f.userId);
  return db().users.filter(u => userIds.includes(u.userId));
}
export function isFollowing(userId, orgId) {
  return db().follows.some(f => f.userId === Number(userId) && f.orgId === Number(orgId));
}

// ===================== AUTH (dummy, stateless, no storage) =====================

// Build a unified auth directory from seedData (users + orgs)
const AUTH_ACCOUNTS = [
  ...(db().users || []).map(u => ({
    name: u.name,
    email: u.email,
    type: "user",
    passwordHash: u.passwordHash
  })),
  ...(db().orgs || []).map(o => ({
    name: o.name,
    email: o.email,
    type: "org",
    passwordHash: o.passwordHash
  }))
];


function findAuthUserByEmail(email) {
  const e = String(email || "").toLowerCase();
  return AUTH_ACCOUNTS.find(u => u.email.toLowerCase() === e) || null;
}

// ---- JWT creators/parsers (dev) ----
function issuePayload({ name, email, type }) {
  const iat = now();
  const exp = iat + 7 * 24 * 60 * 60 * 1000; // 7 days
  return { sub: email, name, email, type, iat, exp };
}

export function createJWT(payload) {
  // payload must include { name, email, type }
  return encode(issuePayload(payload));
}

export function decodeJWT(token) {
  if (!token) return null;
  try { return decode(token); } catch { return null; }
}

// ------ Auth endpoints (stateless) ------

// LOGIN: returns { token, user } — caller keeps token in state; no localStorage here.
export async function login({ email, password }) {
  const user = findAuthUserByEmail(email);
  if (!user) throw new Error("User not found");
  if (user.passwordHash !== simpleHash(password)) {
    throw new Error("Invalid password (tip: seeded accounts use 'demo')");
  }
  const token = createJWT(user);
  return { token, user: { name: user.name, email: user.email, type: user.type } };
}

// VERIFY: pass token in; returns { user } or { user: null }
export async function verify(token) {
  if (!token) return { user: null };
  const payload = decodeJWT(token);
  if (!payload) return { user: null };
  if (now() > payload.exp) return { user: null };
  const { name, email, type } = payload;
  return { user: { name, email, type } };
}
