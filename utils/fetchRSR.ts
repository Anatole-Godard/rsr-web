/**
 * TODO: add revalidate jwt method if (response === 401 || response === 403)
 * TODO: mutate user object when refreshing token
 *
 * @param url
 * @param user
 * @param options
 */
export const fetchRSR = async (
  url: string,
  session: any, // TODO: check if we can only define one part of the type here
  options?: any
): Promise<Response> => {
  try {
    return fetch(url, {
      ...options,
      headers: {
        Authorization: "Bearer " + session.token,
        ...options?.headers,
        appsource: "web",
        "Content-Type": "application/json",
        uid: session.uid,
      },
    });
  } catch (err) {
    return Promise.reject({
      error: {
        message: err.message,
        location: "fetchRSR",
      },
    });
  }
};
