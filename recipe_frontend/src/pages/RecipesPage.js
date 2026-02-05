import React, { useCallback, useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";
import { searchRecipes } from "../api/client";
import { getFavoriteIds, toggleFavorite } from "../utils/favorites";

const DEMO_RECIPES = [
  {
    id: "pixel-ramen",
    title: "Pixel Ramen",
    category: "Noodles",
    time_minutes: 20,
    difficulty: "Easy",
    description: "A neon broth with crunchy nostalgia.",
    ingredients: ["Noodles", "Broth", "Egg", "Scallions"],
    instructions: ["Boil noodles", "Heat broth", "Assemble", "Slurp responsibly"],
  },
  {
    id: "arcade-pancakes",
    title: "Arcade Pancakes",
    category: "Breakfast",
    time_minutes: 15,
    difficulty: "Easy",
    description: "Fluffy stacks worthy of a high score.",
    ingredients: ["Flour", "Milk", "Egg", "Butter", "Maple syrup"],
    instructions: ["Mix batter", "Cook on skillet", "Stack", "Serve"],
  },
  {
    id: "cassette-salad",
    title: "Cassette Tape Salad",
    category: "Salad",
    time_minutes: 10,
    difficulty: "Easy",
    description: "Fresh greens with a rewind-worthy crunch.",
    ingredients: ["Greens", "Cucumber", "Tomato", "Vinaigrette"],
    instructions: ["Chop", "Toss", "Dress", "Enjoy"],
  },
];

/**
 * Browse and search recipes.
 */
// PUBLIC_INTERFACE
export default function RecipesPage() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [usingDemo, setUsingDemo] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(() => getFavoriteIds());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshFavorites = useCallback(() => {
    setFavoriteIds(getFavoriteIds());
  }, []);

  const onToggleFav = useCallback(
    (id) => {
      toggleFavorite(id);
      refreshFavorites();
    },
    [refreshFavorites]
  );

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError("");
    setUsingDemo(false);

    try {
      const data = await searchRecipes({ q: query, limit: 24 });

      // Accept a few common response shapes:
      const list =
        (Array.isArray(data) && data) ||
        data?.items ||
        data?.recipes ||
        data?.results ||
        [];

      if (!Array.isArray(list)) {
        throw new Error("Unexpected API response shape.");
      }

      setRecipes(list);
    } catch (e) {
      // If backend isn't implemented yet, fall back to demo recipes.
      setUsingDemo(true);
      setRecipes(
        DEMO_RECIPES.filter((r) =>
          !query
            ? true
            : `${r.title} ${r.category} ${r.description}`
                .toLowerCase()
                .includes(query.toLowerCase())
        )
      );
      setError(
        `Could not load recipes from API (${e?.message || "unknown error"}). Showing demo recipes instead.`
      );
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const title = useMemo(() => {
    if (usingDemo) return "Browse Recipes (Demo)";
    return "Browse Recipes";
  }, [usingDemo]);

  return (
    <main className="page">
      <section className="hero">
        <h1 className="hero__title">{title}</h1>
        <p className="hero__subtitle">
          Search, open details, and save favorites. Retro flavor, modern UI.
        </p>
      </section>

      <section className="panel">
        <SearchBar initialQuery={query} onQueryChange={setQuery} />
        <div className="panel__status" role="status" aria-live="polite">
          {loading ? (
            <span className="pill">Loading…</span>
          ) : (
            <span className="pill">
              {recipes.length} result{recipes.length === 1 ? "" : "s"}
            </span>
          )}
          {usingDemo ? <span className="pill pill--warn">Demo data</span> : null}
        </div>
        {error ? <div className="callout callout--warn">{error}</div> : null}
      </section>

      <section className="grid" aria-label="Recipe results">
        {recipes.map((r, idx) => {
          const id = r.id ?? r.recipe_id ?? r.slug ?? r.name ?? String(idx);
          return (
            <RecipeCard
              key={String(id)}
              recipe={r}
              isFav={favoriteIds.has(String(id))}
              onToggleFav={onToggleFav}
            />
          );
        })}
      </section>
    </main>
  );
}
