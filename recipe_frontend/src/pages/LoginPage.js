import React, { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Login entry point (UI-only; backend integration can be added later).
 */
// PUBLIC_INTERFACE
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    // Placeholder: backend auth not specified in this work item.
    // Keep as an entry point for future integration.
    // eslint-disable-next-line no-alert
    alert("Login is a UI entry point in this build. Hook it to backend auth when available.");
  }

  return (
    <main className="page">
      <section className="hero">
        <h1 className="hero__title">Log in</h1>
        <p className="hero__subtitle">
          Welcome back. Enter the kitchen (authentication integration pending).
        </p>
      </section>

      <form className="form" onSubmit={onSubmit}>
        <label className="form__label" htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          className="form__input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <label className="form__label" htmlFor="login-password">
          Password
        </label>
        <input
          id="login-password"
          className="form__input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <button className="btn btn--primary btn--wide" type="submit">
          Log in
        </button>

        <p className="muted">
          No account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </main>
  );
}
