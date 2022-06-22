import "leaflet/dist/leaflet.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { DarkModeToggler } from "@components/Helper/DarkModeToggler";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@hooks/useAuth";
import { NotificationProvider } from "@hooks/useNotifications";
import { GetStarted } from "@components/Helper/GetStarted";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <AuthProvider>
        <NotificationProvider>
          <AnimatePresence onExitComplete={() => window.scrollTo(0, 0)}>
            <div className="relative" key={"app"}>
              <Component {...pageProps} />
              <DarkModeToggler />
              <GetStarted />
            </div>
          </AnimatePresence>
        </NotificationProvider>
      </AuthProvider>
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}
export default MyApp;
