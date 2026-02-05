# Backend Integration Documentation

## Overview

The Recipe Hub frontend is integrated with the recipe_backend API. This document describes the integration configuration, API endpoints, and implementation details.

---

## Environment Configuration

The frontend `.env` file is configured with the following backend-related variables:

```env
REACT_APP_API_BASE=https://vscode-internal-11487-qa.qa01.cloud.kavia.ai:8000
REACT_APP_BACKEND_URL=https://vscode-internal-11487-qa.qa01.cloud.kavia.ai:8000
REACT_APP_HEALTHCHECK_PATH=/healthz
```

### Local Development

For local development, update `.env` to:
```env
REACT_APP_API_BASE=http://localhost:8000
REACT_APP_BACKEND_URL=http://localhost:8000
```

---

## API Client Implementation

Location: `src/api/client.js`

The API client provides three main functions:

### 1. `getHealth()`
- **Endpoint**: `GET /healthz`
- **Purpose**: Health check to verify backend availability
- **Response**: `{ status: "healthy", service: "recipe-backend" }`

### 2. `searchRecipes({ q, limit })`
- **Endpoint**: `GET /recipes?q={query}&limit={limit}`
- **Purpose**: Browse and search recipes
- **Parameters**:
  - `q` (optional): Search query string
  - `limit` (optional): Max results (1-100, default: 24)
- **Response**: 
  ```json
  {
    "recipes": [...],
    "total": 15
  }
  ```

### 3. `getRecipeById(id)`
- **Endpoint**: `GET /recipes/{id}`
- **Purpose**: Fetch detailed recipe information
- **Parameters**:
  - `id`: Recipe identifier (e.g., "pixel-ramen")
- **Response**: Single recipe object

---

## Backend Recipe Schema

The backend returns recipes with this schema:

```javascript
{
  id: string,              // Unique identifier
  title: string,           // Recipe name
  description: string,     // Brief description
  cuisine: string,         // Cuisine type (e.g., "Japanese")
  difficulty: string,      // "Easy", "Medium", or "Hard"
  prepTime: string,        // e.g., "15 min"
  cookTime: string,        // e.g., "20 min"
  servings: number,        // Number of servings
  ingredients: string[],   // List of ingredients
  instructions: string[],  // Step-by-step instructions
  imageUrl: string,        // Image path/URL
  tags: string[]          // Category tags
}
```

---

## Frontend-Backend Field Mapping

The frontend components expect certain field names. The backend schema is already compatible:

| Frontend Expected | Backend Provides | Mapping Required |
|------------------|------------------|------------------|
| `id` | `id` | ✅ Direct match |
| `title` | `title` | ✅ Direct match |
| `description` | `description` | ✅ Direct match |
| `category` | `cuisine` | ⚠️ Use `cuisine` as fallback |
| `time_minutes` | `prepTime` + `cookTime` | ⚠️ Display separately |
| `difficulty` | `difficulty` | ✅ Direct match |
| `ingredients` | `ingredients` | ✅ Direct match |
| `instructions` | `instructions` | ✅ Direct match |

---

## Integration Points

### 1. RecipesPage (`src/pages/RecipesPage.js`)

**Status**: ✅ Integrated with demo fallback

- Calls `searchRecipes({ q, limit: 24 })` on mount and when search query changes
- Extracts recipes from `data.recipes` array
- Falls back to demo data if backend is unavailable
- Displays error banner when using demo data

**Fallback Behavior**:
```javascript
try {
  const data = await searchRecipes({ q: query, limit: 24 });
  const list = data?.recipes || [];
  setRecipes(list);
} catch (e) {
  setUsingDemo(true);
  setRecipes(DEMO_RECIPES.filter(...));
  setError(`Could not load from API. Using demo data.`);
}
```

### 2. RecipeDetailsPage (`src/pages/RecipeDetailsPage.js`)

**Status**: ✅ Integrated with demo fallback

- Calls `getRecipeById(recipeId)` on mount
- Displays recipe details including ingredients and instructions
- Falls back to demo recipe if backend returns 404
- Shows error banner when using demo data

**Fallback Behavior**:
```javascript
try {
  const data = await getRecipeById(recipeId);
  setRecipe(data);
} catch (e) {
  const demo = DEMO_BY_ID[recipeId];
  if (demo) {
    setUsingDemo(true);
    setRecipe(demo);
    setError(`Could not load from API. Showing demo recipe.`);
  }
}
```

### 3. FavoritesPage (`src/pages/FavoritesPage.js`)

**Status**: ✅ Integrated with fallback

- Reads favorite IDs from localStorage
- Calls `getRecipeById(id)` for each saved favorite
- Creates minimal placeholder if API call fails
- Allows navigation to detail pages even with failed API calls

**Fallback Behavior**:
```javascript
const hydrated = await Promise.all(
  ids.map(async (id) => {
    try {
      return await getRecipeById(id);
    } catch {
      return { id, title: String(id), description: "Saved favorite." };
    }
  })
);
```

---

## Demo Data

The frontend includes demo recipes that match the backend's seeded data:

1. **pixel-ramen** - 8-Bit Pixel Ramen
2. **arcade-pancakes** - Arcade Token Pancakes
3. **cassette-salad** - Mixtape Cassette Salad

These IDs are guaranteed to exist in the backend, allowing seamless testing.

---

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000` (local development)
- `https://vscode-internal-11487-qa.qa01.cloud.kavia.ai:3000` (deployment)

No additional frontend configuration is required.

---

## Testing the Integration

### 1. Verify Backend is Running

```bash
curl https://vscode-internal-11487-qa.qa01.cloud.kavia.ai:8000/healthz
```

Expected response:
```json
{"status":"healthy","service":"recipe-backend"}
```

### 2. Test Recipe Browsing

1. Navigate to `/` (Browse page)
2. Verify recipes load from API (no "Demo data" badge)
3. Test search functionality with query "ramen"
4. Verify results update dynamically

### 3. Test Recipe Details

1. Click on any recipe card
2. Verify details page shows ingredients and instructions
3. Verify no "Demo" badge appears
4. Test with known IDs: `pixel-ramen`, `arcade-pancakes`, `cassette-salad`

### 4. Test Favorites

1. Click star icon on a recipe to save it
2. Navigate to `/favorites`
3. Verify saved recipes load from API
4. Verify favorites persist across page refreshes

### 5. Test Offline Behavior

1. Stop the backend server
2. Refresh the frontend
3. Verify demo fallback works
4. Verify error messages are shown
5. Verify app remains functional with demo data

---

## Known Behaviors

### Graceful Degradation

The frontend is designed to work with or without the backend:

- ✅ **Backend Available**: Uses live API data
- ✅ **Backend Unavailable**: Falls back to demo data with warnings
- ✅ **Partial Failure**: Individual recipe fetches fail gracefully

### Field Compatibility

Some frontend components expect fields that differ from backend schema:

- `category` vs `cuisine`: Components accept both
- `time_minutes` vs separate `prepTime`/`cookTime`: Components display what's available
- `recipe_id` vs `id`: Components check multiple field names

This flexible approach ensures compatibility across different data sources.

---

## Environment Variables Reference

| Variable | Purpose | Default |
|----------|---------|---------|
| `REACT_APP_API_BASE` | Primary API base URL | (none) |
| `REACT_APP_BACKEND_URL` | Alternative API base URL | (none) |
| `REACT_APP_HEALTHCHECK_PATH` | Health check endpoint path | `/healthz` |

The API client uses `REACT_APP_API_BASE` or `REACT_APP_BACKEND_URL` (in that order) to construct API URLs.

---

## Troubleshooting

### Issue: All pages show "Demo data" badge

**Cause**: Backend is not reachable or returning errors

**Solution**:
1. Check backend is running: `curl http://localhost:8000/healthz`
2. Verify `.env` has correct `REACT_APP_API_BASE` URL
3. Check browser console for CORS or network errors
4. Restart frontend: `npm start`

### Issue: Recipes load but show incorrect fields

**Cause**: Backend schema doesn't match expected frontend fields

**Solution**:
1. Check backend response in browser DevTools Network tab
2. Update RecipeCard component to handle backend field names
3. Verify backend is using correct schema (see OpenAPI spec)

### Issue: Favorites don't persist

**Cause**: localStorage issue (unrelated to backend)

**Solution**:
1. Check browser allows localStorage
2. Verify no privacy/incognito mode restrictions
3. Check `utils/favorites.js` for errors

---

## API Documentation

Interactive API documentation is available when backend is running:

- **Swagger UI**: https://vscode-internal-11487-qa.qa01.cloud.kavia.ai:8000/docs
- **ReDoc**: https://vscode-internal-11487-qa.qa01.cloud.kavia.ai:8000/redoc
- **OpenAPI JSON**: `/home/kavia/workspace/code-generation/recipe_backend_workspace/recipe_backend/interfaces/openapi.json`

---

## Integration Status

| Feature | Status | Notes |
|---------|--------|-------|
| Browse recipes | ✅ Live API | Demo fallback available |
| Search recipes | ✅ Live API | Query parameter working |
| View recipe details | ✅ Live API | Demo fallback available |
| Save favorites | ✅ Working | Uses localStorage, API hydration |
| Health check | ✅ Implemented | Used by API client |
| CORS | ✅ Configured | Deployment URL whitelisted |
| Error handling | ✅ Robust | Graceful degradation |

---

## Next Steps for Future Development

1. **Remove Demo Fallback** (optional): Once backend is stable, remove demo data arrays
2. **Add Pagination**: Backend supports `limit` parameter, frontend could add page navigation
3. **Add Sorting**: Implement sort options (by difficulty, time, etc.)
4. **User Authentication**: Integrate with auth backend to sync favorites across devices
5. **Recipe Creation**: Add POST endpoints for user-submitted recipes

---

**Last Updated**: Current session
**Integration Version**: 1.0
**Status**: ✅ Fully integrated and tested
