import type {
  CoinMarket,
  MarketFilter,
  MarketSummary,
  MovementPoint,
  SortDirection,
  SortKey,
} from '../types/crypto';

const valueOr = (value: number | null | undefined, fallback: number) =>
  value == null || !Number.isFinite(value) ? fallback : value;

export function getMarketSummary(coins: CoinMarket[]): MarketSummary {
  const directional = coins.filter((coin) => coin.change24h != null);
  const loadedMarketCap = coins.reduce((sum, coin) => sum + valueOr(coin.marketCap, 0), 0);
  const totalChange = directional.reduce((sum, coin) => sum + valueOr(coin.change24h, 0), 0);
  const averageChange24h = directional.length ? totalChange / directional.length : 0;
  const gainers = directional.filter((coin) => valueOr(coin.change24h, 0) > 0.05).length;
  const losers = directional.filter((coin) => valueOr(coin.change24h, 0) < -0.05).length;
  const unchanged = Math.max(0, directional.length - gainers - losers);
  const highestVolume = [...coins].sort(
    (a, b) => valueOr(b.volume24h, -1) - valueOr(a.volume24h, -1),
  )[0] ?? null;
  const biggestMover = [...directional].sort(
    (a, b) => Math.abs(valueOr(b.change24h, 0)) - Math.abs(valueOr(a.change24h, 0)),
  )[0] ?? null;
  const btc = coins.find((coin) => coin.id === 'bitcoin') ?? null;
  const eth = coins.find((coin) => coin.id === 'ethereum') ?? null;
  const breadth = directional.length ? (gainers - losers) / directional.length : 0;
  const leadersAverage =
    [btc?.change24h, eth?.change24h].filter((value): value is number => value != null).reduce((sum, value) => sum + value, 0) /
    Math.max(1, [btc?.change24h, eth?.change24h].filter((value) => value != null).length);

  if (breadth > 0.2 && averageChange24h > 0.75 && leadersAverage >= 0) {
    return {
      loadedMarketCap,
      averageChange24h,
      gainers,
      losers,
      unchanged,
      highestVolume,
      biggestMover,
      btc,
      eth,
      mood: 'Risk-on',
      moodReason: 'More coins are rising than falling and large-cap leaders are not dragging the index.',
    };
  }

  if (breadth < -0.2 && averageChange24h < -0.75 && leadersAverage <= 0) {
    return {
      loadedMarketCap,
      averageChange24h,
      gainers,
      losers,
      unchanged,
      highestVolume,
      biggestMover,
      btc,
      eth,
      mood: 'Risk-off',
      moodReason: 'Losers outnumber gainers and broad 24h movement is negative.',
    };
  }

  return {
    loadedMarketCap,
    averageChange24h,
    gainers,
    losers,
    unchanged,
    highestVolume,
    biggestMover,
    btc,
    eth,
    mood: 'Mixed',
    moodReason: 'Breadth, average movement, and large-cap leaders are not aligned.',
  };
}

export function getTopMovers(coins: CoinMarket[], limit = 12): MovementPoint[] {
  return [...coins]
    .filter((coin) => coin.change24h != null)
    .sort((a, b) => Math.abs(valueOr(b.change24h, 0)) - Math.abs(valueOr(a.change24h, 0)))
    .slice(0, limit)
    .map((coin) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      change24h: valueOr(coin.change24h, 0),
      marketCap: coin.marketCap,
      volume24h: coin.volume24h,
    }));
}

export function getCoinSignals(coin: CoinMarket) {
  const signals: string[] = [];
  const change24h = valueOr(coin.change24h, 0);
  const marketCap = valueOr(coin.marketCap, 0);
  const volume = valueOr(coin.volume24h, 0);

  if (marketCap >= 50_000_000_000) signals.push('Large cap');
  if (volume >= 1_000_000_000) signals.push('High volume');
  if (Math.abs(change24h) >= 5) signals.push('Sharp 24h move');
  if (Math.abs(change24h) <= 0.25) signals.push('Low movement');
  if (coin.price == null || coin.marketCap == null || coin.volume24h == null) signals.push('Missing data');

  return signals.length ? signals : ['Normal range'];
}

export function filterCoins(coins: CoinMarket[], filter: MarketFilter, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  const searched = normalizedQuery
    ? coins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(normalizedQuery) ||
          coin.symbol.toLowerCase().includes(normalizedQuery),
      )
    : coins;

  switch (filter) {
    case 'gainers':
      return searched.filter((coin) => valueOr(coin.change24h, 0) > 0);
    case 'losers':
      return searched.filter((coin) => valueOr(coin.change24h, 0) < 0);
    case 'high-volume': {
      const sortedByVolume = [...coins].sort(
        (a, b) => valueOr(b.volume24h, 0) - valueOr(a.volume24h, 0),
      );
      const threshold = sortedByVolume[Math.min(19, sortedByVolume.length - 1)]?.volume24h ?? 0;
      return searched.filter((coin) => valueOr(coin.volume24h, 0) >= threshold);
    }
    case 'large-cap':
      return searched.filter((coin) => valueOr(coin.marketCap, 0) >= 10_000_000_000);
    case 'all':
    default:
      return searched;
  }
}

export function sortCoins(coins: CoinMarket[], key: SortKey, direction: SortDirection) {
  const multiplier = direction === 'asc' ? 1 : -1;
  return [...coins].sort((a, b) => {
    const aValue = valueOr(a[key], direction === 'asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY);
    const bValue = valueOr(b[key], direction === 'asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY);
    return (aValue - bValue) * multiplier;
  });
}
