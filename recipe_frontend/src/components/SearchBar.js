import React, { useEffect, useMemo, useState } from "react";

/**
 * Controlled search bar with debounced change callback.
 */
// PUBLIC_INTERFACE
export default function SearchBar({
  initialQuery = "",
  onQueryChange,
  placeholder = "Search recipes (e.g. ramen, pancakes, tofu)...",
}) {
  const [query, setQuery] = useState(initialQuery);

  const trimmed = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      onQueryChange(trimmed);
    }, 250);
    return () => window.clearTimeout(t);
  }, [trimmed, onQueryChange]);

  return (
    <div className="search">
      <label className="search__label" htmlFor="recipe-search">
        Search
      </label>
      <div className="search__row">
        <input
          id="recipe-search"
          className="search__input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
        />
        <button
          className="btn btn--ghost"
          type="button"
          onClick={() => setQuery("")}
          disabled={!query}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
