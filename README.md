# recipe-hub-213928-213942

Recipe Hub - A retro-themed recipe browsing application with React frontend and FastAPI backend.

## Project Structure

```
recipe-hub-213928-213942/
├── recipe_frontend/          # React 18.3.1 frontend application
│   ├── src/                  # Source code
│   ├── public/               # Static assets
│   ├── .env                  # Environment configuration
│   ├── .env.example          # Environment template
│   ├── package.json          # Dependencies
│   ├── README.md             # Frontend documentation
│   ├── BACKEND_INTEGRATION.md    # Integration guide
│   ├── INTEGRATION_CHECKLIST.md  # Verification checklist
│   └── INTEGRATION_COMPLETE.md   # Integration summary
└── README.md                 # This file
```

## Quick Start

### Frontend

```bash
cd recipe_frontend
npm install
cp .env.example .env  # Update with backend URL
npm start             # Runs on http://localhost:3000
```

See `recipe_frontend/README.md` for detailed frontend documentation.

## Integration Status

✅ **Frontend-Backend Integration: COMPLETE**

The frontend is fully integrated with the recipe_backend API:

- ✅ Environment variables configured
- ✅ API client connects to backend endpoints
- ✅ Browse/search recipes from live API
- ✅ Recipe details loaded from live API  
- ✅ Favorites work with API hydration
- ✅ Graceful fallback to demo data when backend unavailable
- ✅ CORS configured correctly

See `recipe_frontend/INTEGRATION_COMPLETE.md` for full details.

## Features

- **Browse Recipes**: View all available recipes with retro styling
- **Search**: Real-time search across titles, descriptions, cuisines, and tags
- **Recipe Details**: Full ingredient lists and step-by-step instructions
- **Favorites**: Save and persist favorite recipes (localStorage)
- **Themes**: Toggle between retro dark and light modes
- **Responsive**: Works on desktop, tablet, and mobile

## Documentation

- **Frontend README**: `recipe_frontend/README.md`
- **Backend Integration**: `recipe_frontend/BACKEND_INTEGRATION.md`
- **Integration Checklist**: `recipe_frontend/INTEGRATION_CHECKLIST.md`
- **Integration Summary**: `recipe_frontend/INTEGRATION_COMPLETE.md`
- **Environment Template**: `recipe_frontend/.env.example`

## Technology Stack

### Frontend
- React 18.3.1
- React Router 6.22.3
- Vanilla CSS (no framework dependencies)
- Native Fetch API

### Backend (separate workspace)
- FastAPI
- Python 3.x
- OpenAPI/Swagger docs

## Environment Variables

Frontend requires these environment variables (see `recipe_frontend/.env.example`):

```env
REACT_APP_API_BASE=http://localhost:8000
REACT_APP_BACKEND_URL=http://localhost:8000
REACT_APP_HEALTHCHECK_PATH=/healthz
```

## Testing

```bash
# Frontend tests
cd recipe_frontend
npm test
```

Manual testing checklist available in `recipe_frontend/INTEGRATION_CHECKLIST.md`.

## Deployment

The frontend can be deployed to any static hosting platform:
- Vercel
- Netlify  
- AWS S3 + CloudFront
- GitHub Pages

See `recipe_frontend/README.md` for deployment instructions.

## License

Recipe Hub Application - Part of the Kavia platform ecosystem.