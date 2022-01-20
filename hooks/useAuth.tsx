import { fetchRSR } from "@utils/fetchRSR";
import { useRouter } from "next/router";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
const AuthContext = createContext({});

/**
 * Provider that handles authentication with Gardian
 *
 * Returns children if logged in, otherwise returns NotLogged
 *
 * @param {Object} props
 * @returns {JSX.Element}
 */
function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [cookie, setCookie, removeCookie] = useCookies(["user"]);
  const [user, setUser] = useState<any | null>(cookie.user || null);
  const [history, setHistory] = useState([]);
  const router = useRouter();

  const getLastUrl = (): string => {
    const lastUrl: string =
      history.length > 1 ? history[history.length - 1] : "/";
    return lastUrl;
  };

  const signIn = async (email: string, password: string) => {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        appsource: "web",
      },
      body: JSON.stringify({ email, password }),
    });
    const body = await response.json();
    if (response.ok && body.session && body.data) {
      setCookie("user", JSON.stringify(body), {
        path: "/",
        maxAge: 3600 * 24, // Expires after 1day
        sameSite: true,
      });
      setUser(body);
      router.push(getLastUrl());
    } else setUser(null);
  };

  const signOut = async () => {
    const response = await fetchRSR("/api/auth/revoke", user.session, {
      method: "POST",
    });
    const body = await response.json();
    if (body.error) {
      removeCookie("user", { path: "/" });
      setUser(null);
      router.push("/");
    }

    if (response.ok) {
      removeCookie("user", { path: "/" });
      setUser(null);
      router.push("/");
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    birthDate: string
  ) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        appsource: "web",
      },
      body: JSON.stringify({ email, password, fullName, birthDate }),
    });
    const body = await response.json();
    if (response.ok && body.session && body.data) {
      setUser(body);
      setCookie("user", JSON.stringify(body), {
        path: "/",
        maxAge: 3600 * 24, // Expires after 1day
        sameSite: true,
      });
      router.push(getLastUrl());
    } else setUser(null);
  };

  const removeUser = (redirect = "/", flash?: string) => {
    removeCookie("user", { path: "/" });
    setUser(null);
    router.push(redirect);
  };

  const changePicture = async (picture: string) => {
    setUser({
      ...user,
      data: { ...user.data, photoURL: `${picture}?${Date.now()}` },
    });
    setCookie(
      "user",
      JSON.stringify({ ...user, photoURL: `${picture}?${Date.now()}` }),
      {
        path: "/",
        maxAge: 3600 * 24, // Expires after 1day
        sameSite: true,
      }
    );
  };

  useEffect(() => {
    setHistory((oldHistory) => [...oldHistory, window.location.pathname]);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut, register, removeUser, changePicture }}
    >
      {children}
    </AuthContext.Provider>
  );
}

interface AuthContextType {
  user: any;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  register: (
    email: string,
    password: string,
    fullName: string,
    birthDate: string
  ) => void;
  removeUser: (redirect: string, flash?: string) => void;
  changePicture: (picture: string) => void;
}

/**
 * Get auth credentials with the use of the react context
 *
 * @returns context
 */
const useAuth = () => useContext(AuthContext) as AuthContextType;

export { AuthProvider, useAuth };

const NotLogged = () => {
  return <div>Not logged in</div>;
};
