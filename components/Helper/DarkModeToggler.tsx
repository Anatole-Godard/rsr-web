import { useEventListener } from "@hooks/useEventListener.js";
import { useTheme } from "next-themes";

export const DarkModeToggler = () => {
  const { theme, setTheme } = useTheme();
  useEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "d" && e.ctrlKey === true) {
      e.preventDefault();
      setTheme(theme === "dark" ? "light" : "dark");
    }
  });
  return null;
};