import { LogBody, LogOptions } from "@definitions/Log";
import toast from "react-hot-toast";

const HOST_URL = process.env.HOST_URL || "http://localhost:3000";
const LOG_END_POINT = "/api/log";
const EXCEPTIONS_END_POINTS = ["notifications", "revalidate"];

/**
 * It fetches a resource from the RSR API.
 *
 * TODO: add revalidate jwt method if (response === 401 || response === 403)
 * TODO: mutate user object when refreshing token
 *
 * @param {string} url - The URL to fetch.
 * @param {any} session - the session object that contains the token and uid
 * @param {any} [options] - any
 * @returns A promise that resolves to a response object.
 */
export const fetchRSR = async (
  url: string,
  session: {
    token: string;
    uid: string;
  },
  options?: any
): Promise<Response> => {
  if (!url) throw new Error("url is required");
  if (!session) throw new Error("session is required");
  if (!session.token) throw new Error("session.token is required");
  if (!session.uid) throw new Error("session.uid is required");

  // logging

  if (!EXCEPTIONS_END_POINTS.some((endpoint) => url.includes(endpoint))) {
    await fetch(
      (typeof window !== "undefined" ? window.location.origin : HOST_URL) +
        LOG_END_POINT,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: options?.method ?? "GET",
          location:
            typeof window !== "undefined" ? window?.location.pathname : "",
          user: {
            uid: session.uid,
          },
          url: url,
          type: "fetch",
        } as LogBody),
      } as LogOptions
    );
  }

  return fetch(url, {
    ...options,
    headers: {
      Authorization: "Bearer " + session.token,
      ...options?.headers,
      appsource: "web",
      "Content-Type": "application/json",
      uid: session.uid,
    },
  })
    .then((res) => {
      if (res.status === 401 || res.status === 403) {
        toast.error("Votre session a expiré, veuillez vous reconnecter");
      }

      if (res.ok) {
        return Promise.resolve(res);
      } else {
        if (!url.includes("/notifications")) {
          toast.error(
            (res as unknown as { error: { client: string } })?.error?.client ||
              "Une erreur est survenue"
          );
        }
      }
    })
    .catch((err) => {
      toast.error(err.message);
      return Promise.reject({
        error: {
          message: err.message,
          location: "fetchRSR",
        },
      });
    });
};
