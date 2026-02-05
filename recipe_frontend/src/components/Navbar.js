import React from "react";
import { Link, NavLink } from "react-router-dom";

/**
 * Top navigation bar with retro branding and auth entry points.
 */
// PUBLIC_INTERFACE
export default function Navbar({ theme, onToggleTheme }) {
  return (
    <header className="nav">
      <div className="nav__inner">
        <div className="nav__brand">
          <Link className="nav__logo" to="/">
            Recipe Hub
          </Link>
          <span className="nav__tag">RETRO EDITION</span>
        </div>

        <nav className="nav__links" aria-label="Primary">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav__link ${isActive ? "is-active" : ""}`
            }
          >
            Browse
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `nav__link ${isActive ? "is-active" : ""}`
            }
          >
            Favorites
          </NavLink>
        </nav>

        <div className="nav__actions">
          <Link className="btn btn--ghost" to="/login">
            Log in
          </Link>
          <Link className="btn btn--primary" to="/signup">
            Sign up
          </Link>
          <button
            className="btn btn--chip"
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>
        </div>
      </div>
    </header>
  );
}
