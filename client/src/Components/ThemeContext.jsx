// ThemeContext.js
import { useEffect } from "react";
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const theme = localStorage.getItem("theme");
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    if (theme === "dark") {
      setDarkMode(true);
    }
  }, []);

  // Initialize dark mode based on user's preference or system settings
  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
