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
import { ReportProvider } from "@hooks/useReport";
import { NextIntlProvider } from "next-intl";
import { Logger } from "@components/Helper/Logger";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <NextIntlProvider messages={pageProps.i18n}>
        <AuthProvider>
          <NotificationProvider>
            <ReportProvider>
              <AnimatePresence onExitComplete={() => window.scrollTo(0, 0)}>
                <div className="relative" key={"app"}>
                  <Component {...pageProps} />
                  <DarkModeToggler />
                  <GetStarted />
                </div>
              </AnimatePresence>
            </ReportProvider>
          </NotificationProvider>
        </AuthProvider>
        <Logger />
        <Toaster position="bottom-right" />
      </NextIntlProvider>
    </ThemeProvider>
  );
}

export default MyApp;
