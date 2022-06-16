import "leaflet/dist/leaflet.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { DarkModeToggler } from "@components/Helper/DarkModeToggler";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@hooks/useAuth";
import { NotificationProvider } from "@hooks/useNotifications";
import { Fragment } from "react";
import { GetStarted } from "@components/UI/GetStarted";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <AuthProvider>
        <NotificationProvider>
          <AnimatePresence onExitComplete={() => window.scrollTo(0, 0)}>
            <Fragment key={"app"}>
              <Component {...pageProps} />
              <DarkModeToggler />
              <GetStarted />
            </Fragment>
          </AnimatePresence>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default MyApp;
