import { useEffect } from "react";
import { Button } from "@trussworks/react-uswds";
import { useFetcher, useNavigate } from "@remix-run/react";

type SessionData = {
  authenticated: boolean;
};

export default function LoginButton() {
  const fetcher = useFetcher<SessionData>();
  const navigate = useNavigate();

  // only load once if not already loaded
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data === undefined) {
      fetcher.load("/auth/sessions");
    }
  }, [fetcher]);

  const authenticated = fetcher.data?.authenticated;

  return authenticated ? (
    <Button
      onClick={() => navigate("/logout")}
      type="button"
      style={{
        textWrap: "nowrap",
        marginTop: 0,
        height: "2rem",
        paddingTop: "8px",
        marginRight: "0px",
        marginLeft: "8px",
      }}
    >
      Log Out
    </Button>
  ) : (
    <Button
      onClick={() => navigate("/login")}
      type="button"
      style={{
        textWrap: "nowrap",
        marginTop: 0,
        height: "2rem",
        paddingTop: "8px",
        marginRight: "0px",
        marginLeft: "8px",
      }}
    >
      Sign In
    </Button>
  );
}
