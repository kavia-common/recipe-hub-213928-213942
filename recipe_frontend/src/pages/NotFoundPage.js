import React from "react";
import { Link } from "react-router-dom";

/**
 * 404 page.
 */
// PUBLIC_INTERFACE
export default function NotFoundPage() {
  return (
    <main className="page">
      <div className="callout callout--warn">
        <p className="callout__title">404 — Page not found</p>
        <p>The recipe gremlins hid this page.</p>
        <Link className="btn btn--primary" to="/">
          Back to browse
        </Link>
      </div>
    </main>
  );
}
