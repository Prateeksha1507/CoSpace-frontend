// src/api/eventsAPI.js

import { getEvents } from "../dummy/db"; // your dummy DB functions
import { verify } from "./authAPI"; // verifies JWT & returns user info

/**
 * Fetch all events (dummy backend version)
 * - In real backend, this will be replaced by a fetch('/api/events')
 */
export async function fetchAllEvents() {
  // You could filter future events if needed
  const events = getEvents();
  return events || [];
}

/**
 * Fetch only events from orgs that the logged-in user follows
 */
export async function fetchUserFeed() {
  const { user } = await verify();
  if (!user) return [];

  // For now, return all events — later filter by followed orgs
  const events = getEvents();
  return events || [];
}

/**
 * Fetch one specific event
 */
export async function fetchEventById(eventId) {
  const events = getEvents();
  return events.find(e => String(e.eventId) === String(eventId)) || null;
}
