## gsc_plus_2d_ui (TTT Gaming Frontend)

A React + Vite frontend for a gaming portal with multi-language support, authenticated game launching, marketing banners, and 2D bet slip viewing for morning and evening sessions.

### Features

- Multi-language content via `LanguageContext`
- Auth token management with periodic profile/balance refresh via `AuthContext`
- Game catalog by type and provider with hot games via `GameContext`
- Seamless game launching (server returns a URL or HTML content)
- Morning and Evening 2D bet slip list and detail views
- Marketing: banners, popup ads, promotions, contact info
- Mobile-friendly layout with fixed bottom navigation for logged-in users

### Tech Stack

- React 18, React Router v6
- Vite 6, `@vitejs/plugin-react`
- Tailwind CSS v4 (via `@tailwindcss/vite`) + custom CSS
- Axios/fetch, react-hot-toast, react-toastify
- Bootstrap/React-Bootstrap (optional components)
- Swiper, react-icons, lucide-react

### Prerequisites

- Node.js 18+ (recommended 18 or 20)
- npm 9+

### Getting Started

1) Install dependencies

```bash
npm install
```

2) Configure API base URL

- Current code uses `src/hooks/baseUrl.jsx`:

```js
// src/hooks/baseUrl.jsx
// const BASE_URL = 'https://your-prod-domain/api'
const BASE_URL = 'https://www.delightmyanmar99.pro/api'
export default BASE_URL
```

- Recommended: use environment variable instead of a hardcoded URL. Create `.env` at the project root:

```env
VITE_API_BASE_URL=https://www.delightmyanmar99.pro/api
```

Then update `src/hooks/baseUrl.jsx` to:

```js
const BASE_URL = import.meta.env.VITE_API_BASE_URL
export default BASE_URL
```

3) Run the app

```bash
npm run dev
```

4) Build and preview

```bash
npm run build
npm run preview
```

Build output goes to `a3h1_ttt_build/` (configured in `vite.config.js`).

### Scripts

- `npm run dev` – start Vite dev server
- `npm run build` – production build → `a3h1_ttt_build/`
- `npm run preview` – run a local server for the production build
- `npm run lint` – run ESLint

### App Structure (key parts)

```
src/
  main.jsx                 # Root render with Router and Language provider
  routes/index.jsx         # Route definitions
  components/
    Layout.jsx             # Wraps pages with Auth/General/Game providers, NavBar, BottomMenu
    MorningBetSlipDisplay.jsx
    EveningBtSlipDisplay.jsx
    MorninBetSlipDetailComponent.jsx
    desktop/ ...           # Desktop UI components (NavBar, tabs, etc.)
    mobile/ ...            # Mobile UI components (BottomMenu, Carousel, etc.)
  contexts/
    AuthContext.jsx        # Token/profile, 5s polling for /user, logout
    GeneralContext.jsx     # Banners, ads, promotions, contacts
    GameContext.jsx        # Types/providers/game lists, hot games
    LanguageContext.jsx    # Translations/content
  hooks/
    useFetch.jsx           # Fetch with auth header and basic 401 handling
    baseUrl.jsx            # API root (see env recommendation)
  pages/                   # Home, Games, 2D pages, Wallet, etc.
  assets/                  # Images, sounds, css
```

### Routing

- Defined in `src/routes/index.jsx` using React Router v6 nested routes.
- `Layout` wraps main routes (Navbar + Outlet + mobile BottomMenu).
- SPA fallback for deployment is configured in `vercel.json`.

### Data Flow Overview

- Auth: `AuthContext` keeps `token` and `userProfile` (localStorage). If authenticated, polls `GET /user` every 5s to refresh balances and handle 401s by logging out and redirecting to `/?type=all`.
- General: `GeneralContext` fetches `GET /banner`, `/popup-ads-banner`, `/banner_Text`, `/promotion`, `/contact`.
- Games: `GameContext` reads `type`/`provider` from the URL and fetches:
  - `GET /game_types`
  - `GET /providers/:gameTypeCode`
  - `GET /game_lists/:typeId/:providerId` (when both are selected)
  - `GET /hot_game_lists`

### 2D Bet Slips (Morning/Evening)

- Morning list + detail:
  - List endpoint: `GET /twod-bet-slips`
  - Component: `src/components/MorningBetSlipDisplay.jsx`
  - Detail component: `src/components/MorninBetSlipDetailComponent.jsx`

- Evening list + detail:
  - List endpoint: `GET /evening-twod-bet-slips`
  - Component: `src/components/EveningBtSlipDisplay.jsx`
  - Detail component: `src/components/MorninBetSlipDetailComponent.jsx` (shared)

Behavior:
- Shows a list of slips prioritized by `slip_no`. Clicking a slip renders detailed info including `two_bets` and a Back button to return to the list.

### Game Launch Flow

- `POST /seamless/launch-game` with `game_code`, `product_code`, and `game_type`.
- If server returns `url`, the app redirects the current window (works in Telegram in-app browser).
- If server returns `content`, the app writes to a popup window (desktop fallback). Users may need to allow popups.

### Deployment

- Vercel: the included `vercel.json` rewrites all routes to `/` for SPA routing.
- Ensure environment variables (e.g., `VITE_API_BASE_URL`) are set in your hosting provider.

### Notes & Recommendations

- Centralize API base URL with an env variable (see above).
- Avoid leaving debug `console.log` in production; guard with `if (import.meta.env.DEV)`.
- React Router paths are case-sensitive; keep route links consistent with definitions.
- The mobile BottomMenu is shown only when `user` exists.

### Troubleshooting

- 401 on API calls: token likely expired or missing. The app will remove the token and navigate to `/?type=all`.
- CORS errors: configure your backend to allow the frontend origin.
- Game popup blocked: allow popups or ensure the server returns a direct URL for in-app browsers.

### License

Proprietary – All rights reserved.
