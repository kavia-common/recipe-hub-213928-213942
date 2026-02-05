import React, { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Signup entry point (UI-only; backend integration can be added later).
 */
// PUBLIC_INTERFACE
export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    // Placeholder: backend auth not specified in this work item.
    // eslint-disable-next-line no-alert
    alert("Signup is a UI entry point in this build. Hook it to backend auth when available.");
  }

  return (
    <main className="page">
      <section className="hero">
        <h1 className="hero__title">Sign up</h1>
        <p className="hero__subtitle">
          Create an account to keep your retro favorites synced (integration pending).
        </p>
      </section>

      <form className="form" onSubmit={onSubmit}>
        <label className="form__label" htmlFor="signup-name">
          Display name
        </label>
        <input
          id="signup-name"
          className="form__input"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="e.g. Chef C64"
          required
        />

        <label className="form__label" htmlFor="signup-email">
          Email
        </label>
        <input
          id="signup-email"
          className="form__input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <label className="form__label" htmlFor="signup-password">
          Password
        </label>
        <input
          id="signup-password"
          className="form__input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        <button className="btn btn--primary btn--wide" type="submit">
          Create account
        </button>

        <p className="muted">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </main>
  );
}
