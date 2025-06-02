// app/routes/auth/session.tsx
import { LoaderFunction } from "@remix-run/node";
import { getSession } from "~/src/services/sessions";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  const token = session.get("access_token");
  return Response.json({ authenticated: !!token });
};
