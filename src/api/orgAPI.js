// src/api/orgAPI.js

import {
  getOrgs,
  getOrgById,
  getEventsByOrg,
  getFollowersForOrg,
} from "../dummy/db";
import { verify } from "./authAPI";

/**
 * Fetch the currently logged-in organization using JWT.
 */
export async function fetchCurrentOrg() {
  const { user } = await verify();
  if (!user || user.type !== "org") return null;

  // Try to find the org by email
  const org = getOrgs().find((o) => o.email === user.email);
  return org || null;
}

/**
 * Fetch all events created by the logged-in organization.
 */
export async function fetchOrgEvents() {
  const org = await fetchCurrentOrg();
  if (!org) return [];

  return getEventsByOrg(org.orgId);
}

/**
 * Fetch data for the org’s dashboard — events, stats, followers.
 */
export async function fetchOrgDashboardData() {
  const org = await fetchCurrentOrg();
  if (!org) throw new Error("Organization not found or not logged in");

  const events = getEventsByOrg(org.orgId);
  const followers = getFollowersForOrg(org.orgId);

  const stats = [
    { label: "Total Followers", value: followers.length },
    { label: "Total Events", value: events.length },
    {
      label: "Active Events",
      value: events.filter((e) => new Date(e.date) > new Date()).length,
    },
  ];

  return { org, events, stats };
}

/**
 * Fetch an org by its ID.
 */
export function fetchOrgById(id) {
  return getOrgById(Number(id));
}

/**
 * Fetch all organizations (e.g., for Explore Orgs page).
 */
export function fetchAllOrgs() {
  return getOrgs();
}
