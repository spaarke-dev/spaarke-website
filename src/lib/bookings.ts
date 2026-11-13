/**
 * The Microsoft Bookings page embedded on /meet.
 *
 * The URL is the BOOKINGS_PAGE_URL app setting, read at request time, so the
 * booking page can be changed (or the embed replaced) without a deploy. Only
 * Microsoft's Bookings hosts are accepted: the value ends up as an iframe src,
 * and a mistyped or tampered setting should fall back to the contact route
 * rather than frame an arbitrary site.
 */
const BOOKINGS_HOSTS = new Set([
  // Current Bookings links: https://bookings.cloud.microsoft/book/<page>/
  "bookings.cloud.microsoft",
  // Older links, still issued by some tenants.
  "outlook.office.com",
  "outlook.office365.com",
]);

export function getBookingsPageUrl(): string | null {
  const raw = process.env.BOOKINGS_PAGE_URL?.trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || !BOOKINGS_HOSTS.has(url.hostname)) {
      console.warn("[bookings] BOOKINGS_PAGE_URL is not a Bookings URL; ignoring.");
      return null;
    }
    return url.toString();
  } catch {
    console.warn("[bookings] BOOKINGS_PAGE_URL is not a valid URL; ignoring.");
    return null;
  }
}
