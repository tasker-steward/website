// Adds people who asked for the newsletter to the Resend "Newsletter" segment.
// Only ever called for someone who opted in themselves (sign-up box or the
// newsletter checkbox on the Role Report form). Never for leads or prospects.

const API = "https://api.resend.com";
export const NEWSLETTER_NAME = "Tasker & Steward Monthly";

export async function subscribeToNewsletter(email: string, firstName?: string): Promise<boolean> {
  const key = process.env.RESEND_CONTACTS_API_KEY;
  const segment = process.env.RESEND_NEWSLETTER_SEGMENT_ID || "38cc868d-e90d-4038-b8c4-8e6bc0571cd2";
  if (!key) {
    console.error("newsletter: RESEND_CONTACTS_API_KEY is not set");
    return false;
  }
  const headers = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
  const addr = email.trim().toLowerCase();

  const created = await fetch(`${API}/contacts`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email: addr,
      ...(firstName ? { first_name: firstName } : {}),
      unsubscribed: false,
      segments: [{ id: segment }],
    }),
  });
  if (created.ok) return true;

  // Already a contact: they just asked again, so resubscribe and make sure they're in the segment.
  const path = encodeURIComponent(addr);
  const updated = await fetch(`${API}/contacts/${path}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ unsubscribed: false, ...(firstName ? { first_name: firstName } : {}) }),
  });
  const added = await fetch(`${API}/contacts/${path}/segments/${segment}`, { method: "POST", headers });
  if (!updated.ok || !added.ok) {
    console.error("newsletter: subscribe failed", created.status, updated.status, added.status);
    return false;
  }
  return true;
}
