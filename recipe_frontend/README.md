# Recipe Hub Frontend

A retro-themed React application for browsing, searching, and saving recipes. Built with React 18.3.1 and integrates with the Recipe Hub backend API.

## Features

- **Browse Recipes**: View all available recipes with beautiful retro styling
- **Search**: Real-time search across recipe titles, descriptions, cuisines, and tags
- **Recipe Details**: View full recipe information including ingredients and step-by-step instructions
- **Favorites**: Save favorite recipes locally (persisted in localStorage)
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Graceful Degradation**: Falls back to demo data if backend is unavailable
- **Dark/Light Theme**: Toggle between retro-themed dark and light modes

## Tech Stack

- **React**: 18.3.1 (functional components with hooks)
- **React Router**: 6.22.3 (client-side routing)
- **Styling**: Vanilla CSS with CSS variables (no UI framework dependencies)
- **State Management**: React hooks (useState, useEffect, useCallback, useMemo)
- **API Integration**: Native fetch API with custom client

## Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Backend API running (see BACKEND_INTEGRATION.md)

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Update .env with your backend URL
# REACT_APP_API_BASE=http://localhost:8000
```

### Development

In the project directory, you can run:

#### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

The page will reload when you make changes. You may also see lint errors in the console.

#### `npm test`

Launches the test runner in interactive watch mode. See [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include hashes. Your app is ready to be deployed!

## Backend Integration

This frontend integrates with the Recipe Hub backend API. See **[BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)** for detailed integration documentation.

### Quick Integration Check

1. Ensure backend is running:
   ```bash
   curl http://localhost:8000/healthz
   ```

2. Update `.env` with backend URL:
   ```env
   REACT_APP_API_BASE=http://localhost:8000
   ```

3. Start the frontend:
   ```bash
   npm start
   ```

4. Verify integration:
   - Browse page should load recipes without "Demo data" badge
   - Search should return filtered results
   - Recipe details should show full information
   - Favorites should persist and hydrate from API

### Fallback Behavior

The app is designed to work even when the backend is unavailable:
- ✅ Displays demo recipes with clear "Demo data" indicators
- ✅ Shows user-friendly error messages
- ✅ All UI features remain functional
- ✅ Favorites work offline using localStorage

## Environment Variables

The following environment variables are required:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `REACT_APP_API_BASE` | Yes | Backend API base URL | `http://localhost:8000` |
| `REACT_APP_BACKEND_URL` | No | Alternative API URL | `http://localhost:8000` |
| `REACT_APP_HEALTHCHECK_PATH` | No | Health endpoint path | `/healthz` |

See `.env.example` for a complete list of configuration options.

**Important**: Changes to `.env` require restarting the development server.

## Project Structure

```
recipe_frontend/
├── public/               # Static assets
│   ├── index.html       # HTML template
│   └── manifest.json    # PWA manifest
├── src/
│   ├── api/
│   │   └── client.js    # API client with backend integration
│   ├── components/
│   │   ├── Navbar.js    # Top navigation with theme toggle
│   │   ├── RecipeCard.js     # Recipe preview card
│   │   └── SearchBar.js      # Debounced search input
│   ├── pages/
│   │   ├── RecipesPage.js         # Browse/search recipes
│   │   ├── RecipeDetailsPage.js   # Recipe details view
│   │   ├── FavoritesPage.js       # Saved favorites
│   │   ├── LoginPage.js           # Login UI (not yet connected)
│   │   ├── SignupPage.js          # Signup UI (not yet connected)
│   │   └── NotFoundPage.js        # 404 page
│   ├── utils/
│   │   └── favorites.js  # localStorage favorites manager
│   ├── App.js           # Root component with routing
│   ├── App.css          # Retro theme styles
│   └── index.js         # React DOM entry point
├── .env                 # Environment variables (not in git)
├── .env.example         # Environment template
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Key Features Explained

### API Client (`src/api/client.js`)

Handles all backend communication with automatic fallback:

```javascript
// Uses REACT_APP_API_BASE or REACT_APP_BACKEND_URL
const API_BASE = process.env.REACT_APP_API_BASE || 
                 process.env.REACT_APP_BACKEND_URL || "";

// Public functions:
await searchRecipes({ q: "ramen", limit: 24 });
await getRecipeById("pixel-ramen");
await getHealth();
```

### Favorites System (`src/utils/favorites.js`)

Persistent favorites using localStorage:

```javascript
toggleFavorite(recipeId);    // Add or remove
getFavoriteIds();            // Get all saved IDs
isFavorite(recipeId);        // Check status
clearFavorites();            // Remove all
```

### Theme System

Persisted theme preference with CSS variables:

- **Dark mode**: Deep blue background with neon accents
- **Light mode**: Clean white surfaces with blue highlights
- Stored in localStorage as `recipehub:theme`

## Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | RecipesPage | Browse and search recipes |
| `/recipes/:recipeId` | RecipeDetailsPage | View recipe details |
| `/favorites` | FavoritesPage | View saved favorites |
| `/login` | LoginPage | Login UI (placeholder) |
| `/signup` | SignupPage | Signup UI (placeholder) |
| `*` | NotFoundPage | 404 page |

## Styling

### Theme Customization

Colors are defined as CSS variables in `src/App.css`:

```css
:root {
  --bg: #0b1020;           /* Background */
  --surface: #121a33;       /* Card surfaces */
  --text: #eaf0ff;          /* Text color */
  --primary: #3b82f6;       /* Primary blue */
  --primary-2: #06b6d4;     /* Secondary cyan */
  --warn: #f59e0b;          /* Warning/favorite color */
  --danger: #ef4444;        /* Error color */
}
```

Light theme is available via `.theme-light` class.

### Component Styles

Pure CSS components (no framework dependencies):

- **Buttons**: `.btn`, `.btn--primary`, `.btn--ghost`, `.btn--chip`
- **Cards**: `.card`, `.panel`, `.detail`
- **Navigation**: `.nav`, `.nav__link`, `.nav__brand`
- **Forms**: `.form`, `.form__input`, `.search__input`
- **Pills/Badges**: `.pill`, `.pill--warn`

All styles use CSS variables for easy theming.

## Testing

### Manual Testing Checklist

- [ ] Browse page loads recipes from backend
- [ ] Search filters recipes correctly
- [ ] Recipe details page shows ingredients and instructions
- [ ] Favorites can be added and removed
- [ ] Favorites persist after page refresh
- [ ] Theme toggle works and persists
- [ ] All routes are accessible
- [ ] 404 page shows for invalid routes
- [ ] App works offline with demo fallback
- [ ] Error messages are user-friendly

### Automated Tests

Run tests with:

```bash
npm test
```

Current test coverage:
- ✅ App renders with correct brand name
- ✅ Navigation links are accessible

**Note**: Additional test coverage planned for components and API integration.

## Known Issues & Limitations

1. **Authentication**: Login and signup are UI placeholders only. Backend auth integration is not yet implemented.
2. **User Recipes**: Users cannot create or submit recipes yet (feature planned).
3. **Pagination**: Browse page shows all results (backend supports `limit` parameter for future pagination).
4. **Image Hosting**: Recipe images reference `/assets/` paths that may need CDN integration.
5. **Real-time Updates**: No WebSocket integration yet (WS URL in .env is for future use).

## Troubleshooting

### Backend Connection Issues

**Problem**: All pages show "Demo data" badge

**Solutions**:
1. Verify backend is running: `curl http://localhost:8000/healthz`
2. Check `.env` has correct `REACT_APP_API_BASE` value
3. Look for CORS errors in browser console
4. Restart frontend after changing `.env`

### Favorites Not Persisting

**Problem**: Saved favorites disappear after closing browser

**Solutions**:
1. Check browser allows localStorage (not in private/incognito mode)
2. Check browser console for storage quota errors
3. Clear browser cache and try again

### Build Errors

**Problem**: `npm start` or `npm run build` fails

**Solutions**:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Ensure Node.js version is 16 or higher
4. Check for port conflicts (port 3000)

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Environment Variables for Production

Set these in your hosting platform (Vercel, Netlify, etc.):

```env
REACT_APP_API_BASE=https://your-backend-api.com
REACT_APP_FRONTEND_URL=https://your-frontend-domain.com
```

### Deployment Platforms

Compatible with:
- **Vercel**: Zero-config deployment for React apps
- **Netlify**: Continuous deployment from Git
- **AWS S3 + CloudFront**: Static hosting with CDN
- **GitHub Pages**: Free hosting for static sites

See [Create React App deployment docs](https://create-react-app.dev/docs/deployment/) for platform-specific instructions.

## Contributing

When contributing to the frontend:

1. **Follow React Hooks best practices**: Use functional components only
2. **Maintain styling consistency**: Use existing CSS variables and classes
3. **Update documentation**: Keep README and BACKEND_INTEGRATION.md current
4. **Test integration**: Verify changes work with backend API
5. **Handle errors gracefully**: Always provide fallback behavior

## Resources

- **Backend Integration**: See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)
- **React Documentation**: [https://react.dev/](https://react.dev/)
- **React Router**: [https://reactrouter.com/](https://reactrouter.com/)
- **Create React App**: [https://create-react-app.dev/](https://create-react-app.dev/)
- **Backend API Docs**: http://localhost:8000/docs (when backend is running)

## License

This project is part of the Recipe Hub application suite.

---

**Frontend Status**: ✅ Fully integrated with backend API
**Theme**: Retro (dark/light modes)
**Framework**: React 18.3.1
**Last Updated**: Current session
