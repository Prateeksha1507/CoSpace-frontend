import { publicFetch } from "./authAPI";

/**
 * Build a query string from an object, skipping null/undefined/empty.
 */
function buildQuery(params = {}) {
  const qp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === null || v === undefined) return;
    if (Array.isArray(v)) {
      if (!v.length) return;
      qp.set(k, v.join(","));
    } else {
      const sv = String(v).trim();
      if (!sv) return;
      qp.set(k, sv);
    }
  });
  const s = qp.toString();
  return s ? `?${s}` : "";
}

/**
 * GET /api/search
 * Unified search across orgs + events.
 *
 * @param {Object} opts
 * @param {string} opts.q                 - query string
 * @param {'all'|'org'|'event'} [opts.type='all']
 * @param {number} [opts.limit=8]         - max items per facet
 * @param {string} [opts.from]            - YYYY-MM-DD (events filter)
 * @param {string} [opts.to]              - YYYY-MM-DD (events filter)
 * @param {string|string[]} [opts.skills] - event skills filter
 * @param {string} [opts.orgType]         - organization type filter
 * @returns {Promise<{query:string,type:string,limit:number,filters:Object,results:{orgs:Array,events:Array}}>}
 */
export async function searchAll(opts = {}) {
  const {
    q,
    type = "all",
    limit = 8,
    from,
    to,
    skills,
    orgType,
  } = opts;

  const qs = buildQuery({ q, type, limit, from, to, skills, orgType });
  return await publicFetch(`/api/search${qs}`);
}

/**
 * GET /api/search/suggest
 * Lightweight suggestions for the header dropdown.
 *
 * @param {string} q
 * @param {number} [limit=5]
 * @returns {Promise<{query:string, suggestions:Array<{kind:'org'|'event', id:string, label:string, sub?:string}>}>}
 */
export async function suggestSearch(q, limit = 5) {
  const qs = buildQuery({ q, limit });
  return await publicFetch(`/api/search/suggest${qs}`);
}

/* ---------------- Optional helpers for the UI ---------------- */

/**
 * Normalize unified results to a flat list with a `kind` tag.
 * Handy if your results page wants a single array instead of facets.
 */
export function flattenResults(unified) {
  if (!unified || !unified.results) return [];
  const { orgs = [], events = [] } = unified.results;
  return [
    ...orgs.map(o => ({ kind: "org", ...o })),
    ...events.map(e => ({ kind: "event", ...e })),
  ];
}


export function isEmptyQuery(q) {
  return !q || !String(q).trim();
}
