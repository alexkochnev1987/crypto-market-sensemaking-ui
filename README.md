# Crypto Market Sensemaking UI

A React + TypeScript market exploration dashboard for scanning the current crypto market. The app focuses on market breadth, 24h movement, volume, freshness, and selected-asset context instead of only listing API fields.

## How To Run

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite, usually:

```txt
http://localhost:5173
```

Production build:

```bash
npm run build
npm run preview
```

Fallback verification:

```bash
VITE_FORCE_API_ERROR=true npm run dev
```

This forces the live request to fail and shows the mock fallback state.

## What Was Built

- A single-screen crypto market sensemaking dashboard.
- Top-level market summary cards:
  - Market mood.
  - Loaded market cap.
  - Average 24h movement.
  - Gainers vs losers.
  - Highest-volume asset.
  - Biggest mover.
- A top 24h movers bar chart.
- A searchable, filterable, sortable top-100 market table.
- Keyboard-accessible row selection using Tab plus Enter/Space.
- A selected coin detail panel with:
  - Price.
  - 1h / 24h / 7d movement.
  - Market cap and volume.
  - 24h high/low.
  - 7-day sparkline.
  - Descriptive signal badges.
- Loading, refreshing, stale, error, cached, and mock fallback states.

## API And Data Source

Primary source:

```txt
https://api.coingecko.com/api/v3/coins/markets
```

The app requests:

- `vs_currency=usd`
- `order=market_cap_desc`
- `per_page=100`
- `page=1`
- `sparkline=true`
- `price_change_percentage=1h,24h,7d`

The app shows a skeleton while the first live request is in flight. If the API is unavailable and no cached data exists after that request fails, the app renders local mock market data with a clear `Mock fallback` badge. Mock data is not labeled as freshly updated live data.

## Main Project Structure

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

## Known Limitations

- The app intentionally loads the top 100 assets only.
- There is no WebSocket or high-frequency polling.
- Longer historical ranges such as 30D/90D/1Y are not implemented.
- The main chart uses Recharts and is isolated behind a chart component so it can be replaced later.
- Virtualized rows are not implemented because 100 rows is manageable for this MVP.
- Automated browser screenshot QA was not completed because the local Playwright package did not have a browser binary installed.
- Coin images are loaded from CoinGecko and may fail independently from market data.
- The production bundle currently emits a Vite chunk-size warning because Mantine and Recharts are included in the MVP bundle.
