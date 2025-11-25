import { authFetch } from "./authAPI";

/**
 * Org-only:
 * POST /api/org-docs/submit
 * form-data:
 *  - registrationCertificate (file)
 *  - taxExemptionCertificate (file)
 *  - legalIdentification (file)
 */
export async function submitOrgDocs({
  registrationCertificate,
  taxExemptionCertificate,
  legalIdentification,
} = {}) {
  const fd = new FormData();

  if (registrationCertificate instanceof File || registrationCertificate instanceof Blob) {
    fd.append("registrationCertificate", registrationCertificate);
  }
  if (taxExemptionCertificate instanceof File || taxExemptionCertificate instanceof Blob) {
    fd.append("taxExemptionCertificate", taxExemptionCertificate);
  }
  if (legalIdentification instanceof File || legalIdentification instanceof Blob) {
    fd.append("legalIdentification", legalIdentification);
  }

  return await authFetch("/api/org-docs/submit", {
    method: "POST",
    body: fd,
  });
}
