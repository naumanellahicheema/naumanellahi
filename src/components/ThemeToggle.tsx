import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check stored preference or default to dark
    const stored = localStorage.getItem("theme");
    const prefersDark = stored === "dark" || (!stored && true);
    setIsDark(prefersDark);
    updateTheme(prefersDark);
  }, []);

  const updateTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
    localStorage.setItem("theme", dark ? "dark" : "light");
  };

  const toggleTheme = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    updateTheme(newValue);
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed top-24 right-6 z-50 p-3 rounded-full bg-secondary border border-border shadow-lg hover:scale-110 transition-transform"
      whileTap={{ scale: 0.9 }}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun size={20} className="text-foreground" />
      ) : (
        <Moon size={20} className="text-foreground" />
      )}
    </motion.button>
  );
}
