import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useAuth } from "@hooks/useAuth";
import { LogBody, LogOptions } from "@definitions/Log";

const LOG_END_POINT = "/api/log";
/**
 * Log provider component that push the userdata into the database each router.pathname change
 *
 * @returns {JSX.Element}
 */
export const Logger = (): JSX.Element => {
  const router = useRouter();
  const { user } = useAuth();

  const log = useCallback(async () => {
    if (user)
      await fetch(LOG_END_POINT, {
        method: "POST",
        body: JSON.stringify({
          location: router.pathname,
          method: "GET",
          user: {
            uid: user.data.uid,
            fullName: user.data.fullName,
            photoURL: user.data.photoURL,
          },
          type: "next",
          url: router.pathname,
        } as LogBody),
      } as LogOptions);
  }, [router, user]);

  useEffect(() => {
    log();
  }, [router.pathname, log]);

  return <>log</>;
};
