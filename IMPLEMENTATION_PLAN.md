# Implementation Plan And Reality Check

## Task Read

Build a React + TypeScript frontend experience for understanding and exploring the current crypto market. The evaluator is looking for product judgment, information design, data handling, frontend architecture, performance thinking, AI workflow, and tradeoff communication.

This should not be a raw crypto table. It should answer: what is happening in the market right now, what deserves attention, and how can a user explore the dataset quickly?

## Confirmed External Facts

- CoinGecko `/coins/markets` returns coin market data including price, market cap, rank, total volume, 24h high/low, 24h price change, `last_updated`, optional 7-day sparkline, and optional percentage changes for multiple timeframes.
- The endpoint supports `per_page`, `page`, `sparkline`, and `price_change_percentage`.
- CoinGecko public/demo usage can hit rate limits around 30 calls per minute, and failed requests still count toward the minute limit.
- Binance `/api/v3/ticker/24hr` returns exchange symbol movement, price, volume, high/low, and trade count, but it is pair-centric exchange data rather than coin market data. It does not directly provide coin rank, market cap, coin identity, or broad market capitalization context.
- CoinLore offers no-key public endpoints for global market stats, tickers, movers, and coin data, with a recommendation around one request per second for fair usage. It is a viable fallback candidate, but it has less direct fit with CoinGecko's `coins/markets` example and lacks the same built-in 7-day sparkline shape.
- CoinPaprika provides rich ticker data including price, market cap, volume, and multiple percentage-change windows. It is a reasonable alternative, but CoinGecko remains the closest match to the assignment's example and desired top-100 market table.
- TanStack Query treats cached data as stale by default, supports `staleTime`, background refetches, retries, and structural sharing for JSON-compatible responses.
- Vite supports a direct React TypeScript scaffold and gives default `dev`, `build`, and `preview` scripts.

## API Decision

Use CoinGecko as the primary data source.

Reason:

- It matches the assignment's example API.
- It returns the exact fields needed for a top-100 market exploration UI in one request.
- It avoids Binance's pair-cleanup problem.
- It includes sparkline data, which supports lightweight trend visualization without extra API calls.

Do not add a second live API in the MVP. A second live provider increases normalization, error, freshness, and documentation complexity. The resilience path is local mock fallback plus explicit error, stale, cached, and mock UI.

## Product Direction

The first internal version is a single-screen market sensemaking dashboard:

1. Market summary at the top.
2. Market movement visualization.
3. Searchable, sortable, filterable market table.
4. Coin detail panel for selected rows.
5. Explicit data freshness, refresh, loading, stale, empty, cached, and error states.

The main user job is fast scanning:

- Is the market broadly green or red?
- Which large coins are moving?
- Which coins have unusual 24h movement?
- Which coins combine high volume with strong movement?
- How fresh is the data?
- What happens if the API fails?

## UI Information Hierarchy

### First Visible Area

- App title: `Crypto Market Sensemaking`.
- Data status: live, fresh, stale, refreshing, error, cached, or mock fallback.
- Last updated timestamp.
- Refresh button.
- Summary cards:
  - Loaded market cap.
  - Average 24h move.
  - Gainers vs losers.
  - Highest-volume coin.
  - Biggest mover by absolute 24h change.

### Movement Visualization

Primary chart: top movers bar chart, split around zero with green positive bars and red negative bars.

Reason:

- Fast to understand.
- Works well with the `/coins/markets` response.
- Lower implementation risk than a complex scatter plot.
- Clearly satisfies movement visualization.

Secondary movement cues:

- Market breadth summary showing gainers vs losers.
- Lightweight 7-day sparkline for the selected coin.
- 1h, 24h, and 7d movement badges in the table and detail panel.

### Exploration Controls

- Search by name or symbol.
- Segment filters:
  - All.
  - Gainers.
  - Losers.
  - High volume.
  - Large cap.
- No watchlist in MVP.
- Sort by:
  - Rank.
  - Price.
  - 1h change.
  - 24h change.
  - 7d change.
  - Market cap.
  - Volume.
- Sort direction:
  - Ascending.
  - Descending.
- Row click selects a coin and opens detail context.

## Technical Direction

### Stack

- Vite.
- React.
- TypeScript.
- Mantine.
- TanStack Query.
- Recharts.
- Lucide React icons.
- App-specific CSS.

Avoid:

- Next.js routing overhead.
- Global state libraries.
- WebSocket streaming.
- Heavy table virtualization for the top-100 MVP.
- Multiple live data providers.
- Automatic high-frequency polling.

### Data Source

Primary endpoint:

```txt
https://api.coingecko.com/api/v3/coins/markets
```

Query params:

```txt
vs_currency=usd
order=market_cap_desc
per_page=100
page=1
sparkline=true
price_change_percentage=1h,24h,7d
locale=en
```

Fallback:

- Keep a local mock dataset shaped like the normalized app model.
- If the request succeeds, show live data.
- If the request fails and there is cached data, keep showing cached data with an error/stale banner.
- If the request fails and there is no cached data, automatically render mock data with a clear `Mock fallback` badge.
- Document this in `README.md` and `DECISIONS.md`.

### Fetching Behavior

- Use TanStack Query.
- `staleTime`: 2 minutes.
- `gcTime`: default is acceptable.
- `retry`: 1, not the default 3, to avoid wasting public API quota during rate limits.
- No aggressive `refetchInterval` for MVP.
- Manual refresh button.
- Disable or slow repeated refresh clicks while a request is in flight.
- Use `isFetching` to show background refresh without replacing the whole UI.
- Use `dataUpdatedAt` and API `last_updated` to communicate freshness.
- Disable refetch on window focus and rely on manual refresh.

### State Model

Server state:

- Coin market list.
- Fetch status.
- Error.
- Updated timestamp.

Local UI state:

- Search query.
- Active filter.
- Sort key.
- Sort direction.
- Selected coin ID.

Derived state:

- Filtered coins.
- Sorted coins.
- Summary stats.
- Top movers.
- Breadth counts.
- Selected coin.

Use `useMemo` for derived lists and stats.

### Performance Plan

Performance needs to be visible in implementation, not only described in docs.

Implemented now:

- Fetch only top 100 rows.
- Use `useMemo` for summary stats, chart data, filtered rows, sorted rows, and selected coin.
- Render a single table, not nested cards for every metric.
- Use stable formatter helpers with shared `Intl.NumberFormat` instances.
- Avoid chart-library components inside every table row.
- Use a simple SVG `Sparkline` component only for selected coin.
- Disable refresh while `isFetching`.
- Hide lower-priority table columns on small screens instead of forcing all data into a cramped layout.
- Keep row count capped at 100 for MVP.

Document as next steps:

- Virtualized rows for 500+ assets.
- Server/API pagination for deeper market browsing.
- WebSocket or polling strategy with backoff for frequent updates.
- Persisted watchlist and user preferences.
- Explicit lazy loading for coin images if image loading becomes a measurable bottleneck.

## Actual File Structure

```txt
src/
  api/
    crypto.ts
  components/
    charts/
      MarketMovementChart.tsx
      Sparkline.tsx
    CoinDetailPanel.tsx
    MarketControls.tsx
    MarketHeader.tsx
    MarketSummary.tsx
    MarketTable.tsx
    StateBanner.tsx
  data/
    mockMarkets.ts
  hooks/
    useCryptoMarkets.ts
  types/
    crypto.ts
  utils/
    format.ts
    marketSignals.ts
  App.tsx
  main.tsx
  styles.css
```

## Implementation Phases

### Phase 1: Scaffold

- [x] Create Vite React TypeScript app in this directory.
- [x] Install dependencies.
- [x] Confirm `npm run build`.
- [x] Remove default placeholder UI.

### Phase 2: Data Layer

- [x] Define `CoinMarketApiResponse` and normalized `CoinMarket`.
- [x] Implement CoinGecko fetcher.
- [x] Normalize nullable API fields defensively.
- [x] Add mock fallback data.
- [x] Add `useCryptoMarkets`.

### Phase 3: Dashboard Shell

- [x] Build app layout.
- [x] Add header, refresh control, and data status.
- [x] Add loading skeletons and error/fallback banner.

### Phase 4: Summary And Visualization

- [x] Compute market summary stats.
- [x] Build summary cards.
- [x] Build top movers bar chart with responsive sizing.
- [x] Add market breadth count in the summary.

### Phase 5: Exploration

- [x] Add search.
- [x] Add segment filters.
- [x] Add sort controls.
- [x] Add table with movement color, cap/volume formatting, and empty state.
- [x] Add row selection.
- [x] Do not include watchlist.

### Phase 6: Detail Context

- [x] Build selected coin panel.
- [x] Show price, 1h/24h/7d movement, volume, market cap, 24h range, and sparkline if available.
- [x] Add simple signal labels.
- [x] Keep labels descriptive, not financial advice.

### Phase 7: Documentation

- [x] `README.md`: run instructions, what was built, API source, structure, known limits.
- [x] `DECISIONS.md`: UI priorities, fetching, visualization, interactions, performance, future work.
- [x] `AI_USAGE.md`: actual AI workflow, accepted/rejected suggestions, where AI was incomplete, manual verification.
- [x] `IMPLEMENTATION_PLAN.md`: plan updated against the implemented source.

### Phase 8: Verification

- [x] Run build.
- [x] Start dev server.
- [ ] Verify desktop and mobile layout manually in a browser.
- [ ] Verify search, filters, sorting, selection, and refresh manually in a browser.
- [ ] Simulate API failure or confirm fallback/error path manually.
- [ ] Verify table remains usable with 100 rows manually.
- [ ] Verify no console errors manually.
- [x] Record limitations.

## Resolved Decisions From Planning

- Product density: simple but clear, not professional trader-heavy.
- Dataset: top 100 by market cap.
- Primary movement signal: 24h, with 1h and 7d available in detail/sort.
- Stablecoins: include them, but do not let them dominate the movers chart. The chart should rank by absolute 24h movement and can naturally push stablecoins out because they barely move.
- Watchlist: not in MVP. It is a future improvement.
- Theme: not implemented in the MVP. The app uses Mantine's light default color scheme.
- Sparklines: small trend lines. Use them only where they add value, in the selected detail panel.
- Performance: implement concrete optimizations now and document heavier options like virtualization as future work.

## Known Implementation Risks

- Public API rate limit or temporary 403/429.
- CORS behavior may differ by environment.
- Coin image requests can fail independently of API data.
- Table readability can collapse on very small mobile widths if too many numeric columns remain visible.
- Over-refreshing can make the app look unreliable and trigger rate limits.
- Summary numbers can be misleading unless labeled as based on the loaded dataset.
- Mantine and Recharts increase the production bundle size.
- Browser QA remains a manual verification step.

## MVP Acceptance Checklist

- [x] App scaffolds and runs.
- [x] CoinGecko data loads.
- [x] Mock or fallback path exists.
- [x] Loading state exists.
- [x] Error state exists.
- [x] Stale/fresh/refresh state exists.
- [x] Summary cards exist.
- [x] Market movement visualization exists.
- [x] Search works in code path.
- [x] Filters work in code path.
- [x] Sorting works in code path.
- [x] Row selection works in code path.
- [x] Detail panel exists.
- [x] Empty state exists.
- [x] Responsive layout rules exist.
- [x] Build succeeds.
- [x] `README.md` exists.
- [x] `DECISIONS.md` exists.
- [x] `AI_USAGE.md` exists.
