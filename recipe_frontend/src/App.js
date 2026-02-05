import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import RecipesPage from "./pages/RecipesPage";
import RecipeDetailsPage from "./pages/RecipeDetailsPage";
import FavoritesPage from "./pages/FavoritesPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFoundPage from "./pages/NotFoundPage";

/**
 * Persisted theme hook (light/dark) using localStorage.
 * @returns {{theme: string, toggleTheme: () => void}}
 */
function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const raw = localStorage.getItem("recipehub:theme");
      return raw === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("recipehub:theme", theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
}

// PUBLIC_INTERFACE
function App() {
  /** Recipe Hub application root. */
  const { theme, toggleTheme } = useTheme();

  const appClass = useMemo(() => `App theme-${theme}`, [theme]);

  return (
    <div className={appClass}>
      <BrowserRouter>
        <Navbar theme={theme} onToggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<RecipesPage />} />
          <Route path="/recipes/:recipeId" element={<RecipeDetailsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <footer className="footer">
          <div className="footer__inner">
            <span className="footer__left">Recipe Hub • Retro Theme</span>
            <span className="footer__right">
              API:{" "}
              <code className="code">
                {process.env.REACT_APP_API_BASE ||
                  process.env.REACT_APP_BACKEND_URL ||
                  "(not set)"}
              </code>
            </span>
          </div>
        </footer>
      </BrowserRouter>
    </div>
  );
}

export default App;
