import { fetchRSR } from "@utils/fetchRSR";
import { useRouter } from "next/router";
import React, { createContext, useContext, useState, useEffect } from "react";
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
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();

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
      setUser(body);
      router.push("/");
    } else setUser(null);
  };

  const signOut = async () => {
    const response = await fetchRSR("/api/auth/revoke", user.session, {
      method: "POST",
      headers: { appsource: "web" },
    });
    if (response.ok) {
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
      router.push("/");
    } else setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, register }}>
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
