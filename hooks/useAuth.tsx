import { fetchRSR } from "@utils/fetchRSR";
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
  const [user, setUser] = useState<object | null>(null);

  const signIn = async (email: string, password: string) => {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        appsource: "web",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok && data.user) setUser(data);
    else setUser(null);
  };

  const signOut = async () => {
    const response = await fetchRSR("/api/auth/revoke", user, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        appsource: "web",
      },
    });
    if (response.ok) setUser(null);
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
    const data = await response.json();
    if (response.ok && data.user) setUser(data);
    else setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, register }}>
      {children}
    </AuthContext.Provider>
  );
}

interface AuthContextType {
  user: any;
  signIn: () => void;
  signOut: () => void;
  register: () => void;
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
