import { authFetch, publicFetch } from "./authAPI";

/* ---------- PUBLIC ROUTES ---------- */

// GET /api/events
export async function fetchAllEvents(query = "") {
  const q = query ? `?q=${encodeURIComponent(query)}` : "";
  return await publicFetch(`/api/events${q}`);
}

// GET /api/events/:id
export async function fetchEventById(id) {
  return await publicFetch(`/api/events/${id}`);
}

// GET /api/events/org/:orgId
export async function fetchEventsByOrg(orgId) {
  return await publicFetch(`/api/events/org/${orgId}`);
}

/* ---------- PROTECTED ROUTES ---------- */

// POST /api/events/create
export async function createEvent(form) {
  const data = new FormData();

  data.append("name", form.name);
  data.append("description", form.description || "");
  data.append("date", form.date);
  data.append("time", form.time);
  data.append("venue", form.venue || "");
  data.append("isVirtual", form.isVirtual ? "true" : "false");

  const skills =
    Array.isArray(form.skills) ? form.skills.join(",") : form.skills || "";
  data.append("skills", skills);

  if (form.image) data.append("image", form.image);

  return await authFetch("/api/events/create", {
    method: "POST",
    body: data,
  });
}

// PUT /api/events/update/:id
export async function updateEvent(id, form) {
  const data =
    form instanceof FormData
      ? form
      : new FormData(
          Object.entries(form).map(([k, v]) => [k, v ?? ""])
        );

  return await authFetch(`/api/events/update/${id}`, {
    method: "PUT",
    body: data,
  });
}

// DELETE /api/events/:id
export async function deleteEvent(id) {
  return await authFetch(`/api/events/${id}`, {
    method: "DELETE",
  });
}
