import { LoaderFunction, redirect } from "@remix-run/node";
import { getSession } from "~/src/services/sessions";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  const token = session.get("access_token");

  if (!token) return redirect("/login");
  return null;
};

export default function Dashboard() {
  return (
    <>
      <h1>DASHBOARD</h1>
    </>
  );
}
