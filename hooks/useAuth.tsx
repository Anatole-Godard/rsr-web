import { fetchRSR } from "libs/fetchRSR";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";
const AuthContext = createContext({});

/**
 * React component that wraps around the children and provides them with the AuthContext
 * @param  - `children`: The children of the component.
 * @returns The AuthProvider component is returning the AuthContext.Provider component.
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

  const t = useTranslations("useAuth");

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
        maxAge: 3600 * 3, // Expires after 3 hour
        sameSite: true,
      });
      setUser(body);
      router.push(getLastUrl());
    } else {
      toast.error(body?.error?.client);
      setUser(null);
    }
  };

  const signOut = async () => {
    try {
      const response = await fetchRSR("/api/auth/revoke", user.session, {
        method: "POST",
      });
      const body = await response.json();
      if (body.error) {
        toast.error(body?.error?.client);
        removeCookie("user", { path: "/" });
        setUser(null);
        router.push("/");
      }

      if (response.ok) {
        toast.success(t("signout-toast-success"));
        removeCookie("user", { path: "/" });
        setUser(null);
        router.push("/");
      }
    } catch (e) {
      toast.success(t("signout-toast-success"));
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
    } else {
      toast.error(body?.error?.client);
      setUser(null);
    }
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
 * It returns the AuthContextType from the AuthContext.
 */
const useAuth = () => useContext(AuthContext) as AuthContextType;

export { AuthProvider, useAuth };
