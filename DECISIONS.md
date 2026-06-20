# Decisions

## What I Prioritized In The UI

I prioritized fast market scanning over visual polish. The first screen shows:

- Whether data is fresh, stale, refreshing, unavailable, or mocked.
- A market mood derived from breadth and average 24h movement.
- Loaded market cap for the top 100 assets.
- Gainers vs losers.
- Highest-volume asset.
- Biggest 24h mover.
- A top movers chart.
- A table for deeper exploration.

The goal is that a user can understand the broad market state before reading individual rows.

## Data Fetching Approach

I chose CoinGecko `/coins/markets` because it directly matches the task and returns the fields needed for this first version in one request: price, rank, market cap, volume, high/low, 24h movement, 1h/7d percentage changes, timestamps, and 7-day sparkline data.

I used TanStack Query for server state because it gives a clear model for loading, error, fetching, retry, and stale states. The query is configured conservatively:

- `staleTime`: 2 minutes.
- `retry`: 1.
- `refetchOnWindowFocus`: false.
- Manual refresh through the UI.

This avoids unnecessary pressure on CoinGecko's public API and prevents the app from pretending to be a real-time trading terminal.

Fallback behavior:

- Live API success: show live data.
- Live API failure with cached data: keep cached data visible and show a warning.
- Live API failure without cached data: show local mock data with a clear `Mock fallback` badge.

## Visualization Approach

The primary visualization is a top 24h movers bar chart. It is intentionally simple:

- Positive moves are green.
- Negative moves are red.
- Bars are split around zero.
- The chart ranks assets by absolute 24h movement.

This was chosen over a scatter plot because it is faster to interpret, easier to implement correctly in the time limit, and directly answers "what is moving right now?"

The selected coin panel includes a lightweight SVG 7-day sparkline using the `sparkline=true` data from CoinGecko. I avoided chart-library instances per table row to keep rendering work reasonable.

The chart implementation is isolated under `components/charts`, so Recharts can be replaced later with TradingView Lightweight Charts, ECharts, or a canvas-based chart if real-time requirements grow.

## Interaction And Exploration

The implemented interactions are:

- Search by coin name or symbol.
- Segment filters: all, gainers, losers, high volume, large cap.
- Sorting by rank, price, 1h change, 24h change, 7d change, market cap, or volume.
- Row selection.
- Selected coin detail panel.
- Manual refresh.

I did not include authentication, portfolio tracking, trading actions, watchlists, alerts, or multi-page routing. Those features are useful in a larger product, but they do not improve the first internal version as much as clear scanning and reliable data states.

## Performance Concerns Considered

Concrete implementation choices:

- Cap the dataset at top 100 assets.
- Memoize derived summary stats, chart data, filtered rows, sorted rows, and selected coin.
- Use one Recharts chart instead of per-row charts.
- Use a simple SVG sparkline.
- Use shared `Intl.NumberFormat` instances.
- Disable repeated refresh behavior through the loading state.
- Hide lower-priority columns on smaller screens.

Future scaling options:

- Row virtualization for 500+ assets.
- API pagination for deeper market browsing.
- Backoff-based polling or WebSocket transport for real-time data.
- A chart library optimized for high-frequency time-series updates.
- Explicit lazy loading for coin images if image loading becomes a measurable bottleneck.
- Route-level code splitting to reduce the initial bundle.

## What I Would Improve With More Time

- Add longer historical ranges using CoinGecko `/coins/{id}/market_chart`.
- Add optional 30D/90D/1Y trend switching for the selected coin.
- Add persisted user preferences and a watchlist.
- Add row virtualization and pagination.
- Add tests around normalization and market signal calculations.
- Improve bundle splitting for Mantine/Recharts.
- Add a small demo video walkthrough.
