export const PUBLIC_PATH_PREFIXES = ["/auth", "/look", "/api", "/_next", "/favicon.ico"];

export const PROTECTED_PATH_PREFIXES = ["/feed", "/saved", "/profile", "/trends", "/admin"];

export function isProtectedPath(pathname: string) {
  return PROTECTED_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function isPublicPath(pathname: string) {
  return PUBLIC_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function isAdminEmail(email: string | undefined) {
  if (!email) return false;
  const allowList = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return allowList.includes(email.toLowerCase());
}
