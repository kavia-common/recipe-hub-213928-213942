import React from "react";
import { Link } from "react-router-dom";

/**
 * Compact recipe preview tile.
 */
// PUBLIC_INTERFACE
export default function RecipeCard({ recipe, isFav, onToggleFav }) {
  const id = recipe.id ?? recipe.recipe_id ?? recipe.slug ?? recipe.name;

  return (
    <article className="card">
      <div className="card__top">
        <h3 className="card__title">
          <Link className="card__titleLink" to={`/recipes/${encodeURIComponent(String(id))}`}>
            {recipe.title || recipe.name || "Untitled Recipe"}
          </Link>
        </h3>
        <button
          className={`fav ${isFav ? "is-on" : ""}`}
          type="button"
          onClick={() => onToggleFav(id)}
          aria-label={isFav ? "Remove from favorites" : "Save to favorites"}
          title={isFav ? "Unfavorite" : "Favorite"}
        >
          {isFav ? "★" : "☆"}
        </button>
      </div>

      <p className="card__meta">
        {recipe.category ? <span>{recipe.category}</span> : <span>Classic</span>}
        <span className="dot">•</span>
        <span>{recipe.time_minutes ? `${recipe.time_minutes} min` : "Quick"}</span>
        <span className="dot">•</span>
        <span>{recipe.difficulty || "Easy"}</span>
      </p>

      {recipe.description ? (
        <p className="card__desc">{recipe.description}</p>
      ) : (
        <p className="card__desc card__desc--muted">
          A tasty recipe from the vault. Open for ingredients and instructions.
        </p>
      )}

      <div className="card__actions">
        <Link className="btn btn--primary btn--small" to={`/recipes/${encodeURIComponent(String(id))}`}>
          View
        </Link>
      </div>
    </article>
  );
}
