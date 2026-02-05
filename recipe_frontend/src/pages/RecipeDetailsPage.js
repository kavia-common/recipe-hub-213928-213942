import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getRecipeById } from "../api/client";
import { getFavoriteIds, toggleFavorite } from "../utils/favorites";

const DEMO_BY_ID = {
  "pixel-ramen": {
    id: "pixel-ramen",
    title: "Pixel Ramen",
    category: "Noodles",
    time_minutes: 20,
    difficulty: "Easy",
    description: "A neon broth with crunchy nostalgia.",
    ingredients: ["Noodles", "Broth", "Egg", "Scallions"],
    instructions: ["Boil noodles", "Heat broth", "Assemble", "Slurp responsibly"],
  },
  "arcade-pancakes": {
    id: "arcade-pancakes",
    title: "Arcade Pancakes",
    category: "Breakfast",
    time_minutes: 15,
    difficulty: "Easy",
    description: "Fluffy stacks worthy of a high score.",
    ingredients: ["Flour", "Milk", "Egg", "Butter", "Maple syrup"],
    instructions: ["Mix batter", "Cook on skillet", "Stack", "Serve"],
  },
  "cassette-salad": {
    id: "cassette-salad",
    title: "Cassette Tape Salad",
    category: "Salad",
    time_minutes: 10,
    difficulty: "Easy",
    description: "Fresh greens with a rewind-worthy crunch.",
    ingredients: ["Greens", "Cucumber", "Tomato", "Vinaigrette"],
    instructions: ["Chop", "Toss", "Dress", "Enjoy"],
  },
};

/**
 * View recipe details with ingredients and instructions.
 */
// PUBLIC_INTERFACE
export default function RecipeDetailsPage() {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [usingDemo, setUsingDemo] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(() => getFavoriteIds());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isFav = useMemo(
    () => favoriteIds.has(String(recipeId)),
    [favoriteIds, recipeId]
  );

  const refreshFavorites = useCallback(() => {
    setFavoriteIds(getFavoriteIds());
  }, []);

  const onToggleFav = useCallback(() => {
    toggleFavorite(recipeId);
    refreshFavorites();
  }, [recipeId, refreshFavorites]);

  useEffect(() => {
    let mounted = true;

    async function run() {
      setLoading(true);
      setError("");
      setUsingDemo(false);
      try {
        const data = await getRecipeById(recipeId);
        if (!mounted) return;
        setRecipe(data);
      } catch (e) {
        if (!mounted) return;
        const demo = DEMO_BY_ID[String(recipeId)];
        if (demo) {
          setUsingDemo(true);
          setRecipe(demo);
          setError(
            `Could not load recipe from API (${e?.message || "unknown error"}). Showing demo recipe instead.`
          );
        } else {
          setRecipe(null);
          setError(e?.message || "Recipe not found.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [recipeId]);

  if (loading) {
    return (
      <main className="page">
        <div className="callout">Loading recipe…</div>
      </main>
    );
  }

  if (!recipe) {
    return (
      <main className="page">
        <div className="callout callout--warn">
          <p className="callout__title">Missing recipe</p>
          <p>{error || "We couldn't find that recipe."}</p>
          <Link className="btn btn--primary" to="/">
            Back to browse
          </Link>
        </div>
      </main>
    );
  }

  const title = recipe.title || recipe.name || "Untitled Recipe";
  const ingredients = recipe.ingredients || recipe.ingredient_list || [];
  const instructions = recipe.instructions || recipe.steps || [];

  return (
    <main className="page">
      <div className="crumbs">
        <Link className="crumbs__link" to="/">
          ← Browse
        </Link>
        <span className="crumbs__sep">/</span>
        <span className="crumbs__current">{title}</span>
      </div>

      {error ? <div className="callout callout--warn">{error}</div> : null}

      <section className="detail">
        <div className="detail__header">
          <h1 className="detail__title">{title}</h1>
          <button
            className={`btn btn--chip ${isFav ? "is-active" : ""}`}
            type="button"
            onClick={onToggleFav}
          >
            {isFav ? "★ Favorited" : "☆ Save"}
          </button>
        </div>

        <p className="detail__meta">
          <span className="pill">{recipe.category || "Classic"}</span>
          <span className="pill">{recipe.time_minutes ? `${recipe.time_minutes} min` : "Quick"}</span>
          <span className="pill">{recipe.difficulty || "Easy"}</span>
          {usingDemo ? <span className="pill pill--warn">Demo</span> : null}
        </p>

        {recipe.description ? (
          <p className="detail__desc">{recipe.description}</p>
        ) : null}

        <div className="cols">
          <section className="box" aria-label="Ingredients">
            <h2 className="box__title">Ingredients</h2>
            {ingredients.length ? (
              <ul className="list">
                {ingredients.map((ing, i) => (
                  <li key={`${String(ing)}-${i}`}>{String(ing)}</li>
                ))}
              </ul>
            ) : (
              <p className="muted">No ingredients listed.</p>
            )}
          </section>

          <section className="box" aria-label="Instructions">
            <h2 className="box__title">Instructions</h2>
            {instructions.length ? (
              <ol className="list list--ordered">
                {instructions.map((step, i) => (
                  <li key={`${String(step)}-${i}`}>{String(step)}</li>
                ))}
              </ol>
            ) : (
              <p className="muted">No instructions listed.</p>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
