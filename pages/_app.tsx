import "leaflet/dist/leaflet.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { DarkModeToggler } from "@components/helpers/DarkMode";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@hooks/useAuth";
import { NotificationProvider } from "@hooks/useNotifications";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <AuthProvider>
        <NotificationProvider>
          <AnimatePresence onExitComplete={() => window.scrollTo(0, 0)}>
            <Component {...pageProps} />
            <DarkModeToggler />
          </AnimatePresence>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default MyApp;
