import { useEffect, useReducer, useRef, useState } from "react";

interface State<T> {
  data?: T;
  error?: Error;
  loading: boolean;
  revalidate: () => void;
}

type Cache<T> = { [url: string]: T };

// discriminated union type
type Action<T> =
  | { type: "loading" }
  | { type: "fetched"; payload: T }
  | { type: "error"; payload: Error };

function useFetchRSR<T = unknown>(
  propsURL?: string,
  options?: RequestInit
): State<T> {
  const [url, setUrl] = useState(propsURL);
  const cache = useRef<Cache<T>>({});

  // Used to prevent state update if the component is unmounted
  const cancelRequest = useRef<boolean>(false);

  const initialState: State<T> = {
    error: undefined,
    data: undefined,
    loading: true,
    revalidate: () => console.log("nothing to fetch"),
  };
  const [revalidate, setRevalidate] = useState(false);

  // Keep state logic separated
  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case "loading":
        return { ...initialState, loading: true };
      case "fetched":
        return {
          ...initialState,
          data: action.payload,
          loading: false,
          revalidate: () => setRevalidate(true),
        };
      case "error":
        return {
          ...initialState,
          error: action.payload,
          loading: false,
          revalidate: () => setRevalidate(true),
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    // Do nothing if the url is not given
    if (!url) return;

    const fetchData = async () => {
      dispatch({ type: "loading" });

      // If a cache exists for this url, return it
      if (cache.current[url]) {
        dispatch({ type: "fetched", payload: cache.current[url] });
        return;
      }

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = (await response.json()) as T;
        cache.current[url] = data;

        dispatch({ type: "fetched", payload: data });
        if (cancelRequest.current) return;
      } catch (error) {
        dispatch({ type: "error", payload: error as Error });
        if (cancelRequest.current) return;
      }
    };

    void fetchData();

    // Use the cleanup function for avoiding a possibly...
    // ...state update after the component was unmounted
    return () => {
      cancelRequest.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => {
    if (revalidate === true) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setUrl(`${propsURL}?revalidate=${Date.now()}`);
      setRevalidate(false);
    }
  }, [propsURL, revalidate, url]);

  return state;
}

export default useFetchRSR;
