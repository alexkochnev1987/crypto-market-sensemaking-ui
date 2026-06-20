import type { CoinMarket, CoinMarketApiResponse } from '../types/crypto';

const COINGECKO_MARKETS_URL =
  import.meta.env.VITE_COINGECKO_MARKETS_URL ??
  'https://api.coingecko.com/api/v3/coins/markets';

const normalizeNumber = (value: number | null | undefined) =>
  Number.isFinite(value) ? Number(value) : null;

export function normalizeCoinMarket(coin: CoinMarketApiResponse): CoinMarket {
  return {
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    image: coin.image,
    price: normalizeNumber(coin.current_price),
    marketCap: normalizeNumber(coin.market_cap),
    rank: normalizeNumber(coin.market_cap_rank),
    volume24h: normalizeNumber(coin.total_volume),
    high24h: normalizeNumber(coin.high_24h),
    low24h: normalizeNumber(coin.low_24h),
    priceChange24h: normalizeNumber(coin.price_change_24h),
    change1h: normalizeNumber(coin.price_change_percentage_1h_in_currency),
    change24h: normalizeNumber(
      coin.price_change_percentage_24h_in_currency ?? coin.price_change_percentage_24h,
    ),
    change7d: normalizeNumber(coin.price_change_percentage_7d_in_currency),
    marketCapChange24h: normalizeNumber(coin.market_cap_change_percentage_24h),
    circulatingSupply: normalizeNumber(coin.circulating_supply),
    totalSupply: normalizeNumber(coin.total_supply),
    maxSupply: normalizeNumber(coin.max_supply),
    ath: normalizeNumber(coin.ath),
    athChangePercentage: normalizeNumber(coin.ath_change_percentage),
    lastUpdated: coin.last_updated,
    sparkline7d: coin.sparkline_in_7d?.price?.filter(Number.isFinite) ?? [],
  };
}

export async function fetchCryptoMarkets(): Promise<CoinMarket[]> {
  if (import.meta.env.VITE_FORCE_API_ERROR === 'true') {
    throw new Error('Forced API error for fallback verification.');
  }

  const params = new URLSearchParams({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: '100',
    page: '1',
    sparkline: 'true',
    price_change_percentage: '1h,24h,7d',
    locale: 'en',
  });

  const response = await fetch(`${COINGECKO_MARKETS_URL}?${params.toString()}`, {
    headers: {
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`CoinGecko request failed with ${response.status}`);
  }

  const payload = (await response.json()) as CoinMarketApiResponse[];

  if (!Array.isArray(payload)) {
    throw new Error('CoinGecko response was not a market list.');
  }

  return payload.map(normalizeCoinMarket);
}
