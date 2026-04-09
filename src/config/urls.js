function stripTrailingSlash(value) {
  if (!value) return value;
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function joinUrl(base, path) {
  const safeBase = stripTrailingSlash(base || "");
  const safePath = path?.startsWith("/") ? path : `/${path || ""}`;
  return `${safeBase}${safePath}`;
}

export const API_BASE_URL = stripTrailingSlash(import.meta.env.VITE_API_BASE_URL);

/** Origin that serves `/media/` etc. (strip trailing `/api` from API_BASE_URL when configured that way). */
export function backendOrigin() {
  if (!API_BASE_URL) return "";
  return stripTrailingSlash(API_BASE_URL.replace(/\/api\/?$/i, ""));
}
export const PUBLIC_SITE_ORIGIN = stripTrailingSlash(
  import.meta.env.VITE_PUBLIC_SITE_ORIGIN
);
export const APP_SITE_ORIGIN = stripTrailingSlash(
  import.meta.env.VITE_APP_SITE_ORIGIN
);

export const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL;
export const HELLO_EMAIL = import.meta.env.VITE_HELLO_EMAIL;

export const TESTIMONIALS_PUBLIC_ENDPOINT = joinUrl(
  API_BASE_URL,
  "/testimonials-public/"
);

export function testimonialsByCentreEndpoint(centreId) {
  return joinUrl(API_BASE_URL, `/testimonials/${centreId}/`);
}

export function publicSiteUrl(pathname) {
  return joinUrl(PUBLIC_SITE_ORIGIN, pathname);
}

export function appSiteUrl(pathname) {
  return joinUrl(APP_SITE_ORIGIN, pathname);
}

/** Turn stored logo paths into a usable URL (absolute, API-relative, or storage key handled on backend). */
export function resolveMediaUrl(url) {
  if (url == null || typeof url !== "string") return null;
  const u = url.trim();
  if (!u) return null;
  if (
    u.startsWith("http://") ||
    u.startsWith("https://") ||
    u.startsWith("//") ||
    u.startsWith("data:")
  ) {
    return u;
  }
  if (u.startsWith("/")) {
    return joinUrl(backendOrigin() || API_BASE_URL, u);
  }
  return u;
}
