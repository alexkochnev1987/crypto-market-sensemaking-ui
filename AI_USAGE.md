# AI Usage

## Tools Used

I used OpenAI Codex as the AI coding assistant during planning, implementation, documentation, and verification.

## What I Asked AI First

The first AI-assisted step was to analyze the assignment and create a plan for a crypto market sensemaking UI. The focus was on product judgment, market signals, data states, fallback behavior, performance, and required documentation.

## How The Direction Changed

The initial plan included a broader scope, including a theme toggle and possible watchlist. During planning, the direction narrowed to a more useful MVP:

- Top 100 assets only.
- No watchlist.
- No theme toggle.
- Manual refresh instead of polling.
- One main movement chart.
- Selected coin detail panel with a 7-day sparkline.
- Explicit stale/error/mock fallback states.

The UI library choice also changed from a possible shadcn/ui setup to Mantine for faster delivery of accessible dashboard components within the time limit.

## AI Suggestions Accepted

Accepted suggestions:

- Use CoinGecko `/coins/markets` as the primary API.
- Use TanStack Query for loading, stale, refresh, and error states.
- Use a top movers bar chart for market movement.
- Keep chart implementation isolated so it can be replaced later.
- Use local mock data if the public API is unavailable.
- Add a derived `Market mood` signal.
- Keep the app as a single-screen exploration tool.

## AI Suggestions Rejected

Rejected or deferred suggestions:

- WebSocket or frequent polling, because it would risk rate limits and imply a real-time product.
- Watchlist, because row selection and detail context cover the MVP exploration need.
- Multiple live API providers, because it would add normalization and failure-mode complexity.
- Scatter plot and multiple charts, because one clear movement chart is more reliable under the time limit.
- Theme toggle, because it does not directly improve the evaluation criteria.

## Where AI Was Wrong, Generic, Or Incomplete

The early AI plan was useful but over-scoped a few nice-to-have features, such as theme support and watchlist behavior. It also left some planning artifacts that needed to be reconciled with the final code, including an outdated file structure, a theme toggle that was not implemented, and a checklist that still read like pre-implementation planning. Those items were removed or deferred to protect the core task.

## What I Personally Decided, Rewrote, Or Verified

I personally decided to:

- Keep the UI simple and readable rather than trader-dense.
- Use Mantine for UI components to reduce implementation risk.
- Treat public API reliability as a first-class user-facing state.
- Add `VITE_FORCE_API_ERROR=true` as a practical fallback verification path.
- Keep longer historical ranges out of the MVP.
- Verify the build locally.

## How I Checked The Final Result

Verification performed:

- Installed dependencies with `npm install`.
- Ran `npm run build`.
- Confirmed TypeScript and Vite production build completed.
- Started the Vite dev server at `http://127.0.0.1:5173/`.
- Confirmed the dev server returned `HTTP/1.1 200 OK`.
- Added a documented fallback verification path using `VITE_FORCE_API_ERROR=true npm run dev`.

Browser automation was not available in this environment, so visual browser QA was not completed here. Before final submission, the app should be opened in a browser and checked for:

- Live data load.
- Search.
- Filters.
- Sorting.
- Row selection.
- Refresh button.
- Mock fallback state.
