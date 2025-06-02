// app/sessions.ts
import { createCookieSessionStorage } from "@remix-run/node";

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secrets: [import.meta.env.SESSION_SECRET || "default-dev-secret"],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: import.meta.env.NODE_ENV === "production",
  },
});

export const getSession = (request: Request) => sessionStorage.getSession(request.headers.get("Cookie"));

export async function destroyUserSession(request: Request) {
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    return await sessionStorage.destroySession(session);
  }