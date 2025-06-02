import { LoaderFunction, redirect } from "@remix-run/node";
import { destroyUserSession } from "~/src/services/sessions";

export const loader: LoaderFunction = async ({ request }) => {
  const destroyedSessionCookie = await destroyUserSession(request);

  const keycloakLogoutUrl =
    `${
      import.meta.env.VITE_KEYCLOAK_CLIENT_URL
    }/realms/react-template/protocol/openid-connect/logout?` +
    new URLSearchParams({
      client_id: `${import.meta.env.VITE_KEYCLOAK_CLIENT_ID}`,
      post_logout_redirect_uri: `${import.meta.env.VITE_URL}/home`,
    }).toString();

  return redirect(keycloakLogoutUrl, {
    headers: {
      "Set-Cookie": destroyedSessionCookie,
    },
  });
};
