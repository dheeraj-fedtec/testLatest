// app/routes/callback.ts
import { LoaderFunction, redirect } from "@remix-run/node";
import { getSession, sessionStorage } from "~/src/services/sessions";
import { getBackendUrl } from "~/config";

// After Auth redirects back to our app, we land here at callback.

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  const backendUrl = await getBackendUrl();
  const tokenResponse = await fetch(
    `${backendUrl}/realms/react-template/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code || "",
        client_id: `${import.meta.env.VITE_KEYCLOAK_CLIENT_ID}`,
        // Optional: include if the client requires it
        // client_secret: "your-client-secret",
        redirect_uri: `${import.meta.env.VITE_URL}/callback`,
      }),
    }
  );

  const tokenData = await tokenResponse.json();

  const session = await sessionStorage.getSession();
  session.set("access_token", tokenData.access_token);

  return redirect("/home/dashboard", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
};
