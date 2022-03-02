import { Notification } from "@definitions/Notification";
import { fetchRSR } from "@utils/fetchRSR";
import { useRouter } from "next/router";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./useAuth";
const NotificationContext = createContext({});

/**
 * TODO: improve this by using sockets instead of polling
 *
 *
 */
function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const router = useRouter();

  const removeNotification = (id: string) => {
    fetchRSR(
      `/api/user/${user.data.uid.toString()}/notifications?id=${id}`,
      user.session,
      {
        method: "DELETE",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          console.log(res.error);
        } else {
          setNotifications(res.data.attributes);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (user) {
      const poll = setInterval(() => {
        fetchRSR(
          `/api/user/${user.data.uid.toString()}/notifications`,
          user.session
        )
          .then((res) => res.json())
          .then((res) => {
            if (res.error) {
              if (res.error.name === "TokenExpiredError") {
                console.log("Token expired, logging out");
                signOut();
              }
            } else {
              setNotifications(res.data.attributes);
            }
          })
          .catch((err) => {
            if (err.name === "TokenExpiredError") {
              console.log("Token expired, logging out");
              signOut();
              router.push("/auth/login");
            }
          });
      }, 5000);

      return () => clearInterval(poll);
    }
  }, [user, signOut]);

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

interface NotificationContextType {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  removeNotification: (id: string) => void;
}

const useNotifications = () =>
  useContext(NotificationContext) as NotificationContextType;

export { NotificationProvider, useNotifications };
