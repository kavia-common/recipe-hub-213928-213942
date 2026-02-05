import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFavoriteIds, toggleFavorite } from "../utils/favorites";
import { getRecipeById } from "../api/client";
import RecipeCard from "../components/RecipeCard";

/**
 * Favorites page: lists saved recipe ids and tries to hydrate details from API.
 */
// PUBLIC_INTERFACE
export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState(() => getFavoriteIds());
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    let mounted = true;

    async function run() {
      const ids = Array.from(getFavoriteIds());
      setLoading(true);
      try {
        // Try to fetch recipe details for each favorite. If API doesn't support it,
        // keep lightweight objects so user can still navigate.
        const hydrated = await Promise.all(
          ids.map(async (id) => {
            try {
              const data = await getRecipeById(id);
              return data;
            } catch {
              return { id, title: String(id), description: "Saved favorite." };
            }
          })
        );
        if (mounted) setRecipes(hydrated);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [favoriteIds]);

  const empty = favoriteIds.size === 0;

  return (
    <main className="page">
      <section className="hero">
        <h1 className="hero__title">Favorites</h1>
        <p className="hero__subtitle">
          Your saved recipes, ready for instant nostalgia.
        </p>
      </section>

      {empty ? (
        <div className="callout">
          <p className="callout__title">No favorites yet</p>
          <p>
            Go to <Link to="/">Browse</Link> and tap the star on a recipe to save
            it here.
          </p>
          <Link className="btn btn--primary" to="/">
            Browse recipes
          </Link>
        </div>
      ) : null}

      {loading ? <div className="callout">Loading favorites…</div> : null}

      {!empty ? (
        <section className="grid" aria-label="Favorite recipes">
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
      ) : null}
    </main>
  );
}
