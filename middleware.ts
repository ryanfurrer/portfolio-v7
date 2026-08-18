import { next, rewrite } from "@vercel/edge";

// Serve the Hearth landing at the hearth.ryanfurrer.com root while keeping the
// URL on the subdomain. vercel.json rewrites can't do this with Astro — they
// only apply as a filesystem fallback, so "/" resolves to the static homepage
// first (and Vercel documents vercel.json rewrites as unsupported for Astro).
// Vercel Routing Middleware runs before the filesystem, so it wins. Scoped to
// "/" so no other request pays for this.
export const config = {
  matcher: "/",
};

export default function middleware(request: Request) {
  const { hostname, origin } = new URL(request.url);
  if (hostname === "hearth.ryanfurrer.com") {
    return rewrite(`${origin}/hearth`);
  }
  return next();
}
