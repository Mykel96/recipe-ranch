interface CookieOptions {
  maxAge?: number;
  path?: string;
  sameSite?: "Lax" | "Strict" | "None";
}

export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof document === "undefined") return;

  const encodedName = encodeURIComponent(name);
  const encodedValue = encodeURIComponent(value);

  const parts: string[] = [`${encodedName}=${encodedValue}`];

  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${options.maxAge}`);
  }

  parts.push(`Path=${options.path ?? "/"}`);
  parts.push(`SameSite=${options.sameSite ?? "Lax"}`);

  document.cookie = parts.join("; ");
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const encodedName = encodeURIComponent(name) + "=";
  const cookies = document.cookie ? document.cookie.split(";") : [];

  for (const rawCookie of cookies) {
    const cookie = rawCookie.trim();
    if (cookie.startsWith(encodedName)) {
      return decodeURIComponent(cookie.substring(encodedName.length));
    }
  }

  return null;
}

