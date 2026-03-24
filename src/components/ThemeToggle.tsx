"use client";

import { useTheme } from "./ThemeProvider";
import {
  WeatherSunny24Regular,
  WeatherMoon24Regular,
} from "@fluentui/react-icons";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-md p-2 text-foreground/70 transition-colors hover:text-foreground"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <WeatherSunny24Regular />
      ) : (
        <WeatherMoon24Regular />
      )}
    </button>
  );
}
