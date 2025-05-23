import { useEffect } from "react";
import { useGlobalStore } from "@/stores/global-store";
import { useShallow } from "zustand/react/shallow";

export const usePreferredTheme = () => {
  const { theme, setTheme } = useGlobalStore(
    useShallow((state) => ({
      theme: state.theme,
      setTheme: state.setTheme,
    })),
  );

  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = () => {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        document.documentElement.className = systemTheme;
      };

      handleChange();
      mediaQuery.addEventListener("change", handleChange);

      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      document.documentElement.className = theme;
    }
  }, [setTheme, theme]);
};
