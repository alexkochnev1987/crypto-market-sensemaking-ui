export type CoinMarketApiResponse = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  market_cap: number | null;
  market_cap_rank: number | null;
  total_volume: number | null;
  high_24h: number | null;
  low_24h: number | null;
  price_change_24h: number | null;
  price_change_percentage_24h: number | null;
  market_cap_change_percentage_24h: number | null;
  circulating_supply: number | null;
  total_supply: number | null;
  max_supply: number | null;
  ath: number | null;
  ath_change_percentage: number | null;
  last_updated: string;
  sparkline_in_7d?: {
    price?: number[];
  };
  price_change_percentage_1h_in_currency?: number | null;
  price_change_percentage_24h_in_currency?: number | null;
  price_change_percentage_7d_in_currency?: number | null;
};

export type CoinMarket = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number | null;
  marketCap: number | null;
  rank: number | null;
  volume24h: number | null;
  high24h: number | null;
  low24h: number | null;
  priceChange24h: number | null;
  change1h: number | null;
  change24h: number | null;
  change7d: number | null;
  marketCapChange24h: number | null;
  circulatingSupply: number | null;
  totalSupply: number | null;
  maxSupply: number | null;
  ath: number | null;
  athChangePercentage: number | null;
  lastUpdated: string;
  sparkline7d: number[];
};

export type MarketDataSource = 'loading' | 'live' | 'cached' | 'mock';

export type MarketFilter = 'all' | 'gainers' | 'losers' | 'high-volume' | 'large-cap';

export type SortKey = 'rank' | 'price' | 'change1h' | 'change24h' | 'change7d' | 'marketCap' | 'volume24h';

export type SortDirection = 'asc' | 'desc';

export type MarketMood = 'Risk-on' | 'Risk-off' | 'Mixed';

export type MarketSummary = {
  loadedMarketCap: number;
  averageChange24h: number;
  gainers: number;
  losers: number;
  unchanged: number;
  highestVolume: CoinMarket | null;
  biggestMover: CoinMarket | null;
  btc: CoinMarket | null;
  eth: CoinMarket | null;
  mood: MarketMood;
  moodReason: string;
};

export type MovementPoint = {
  id: string;
  symbol: string;
  name: string;
  change24h: number;
  marketCap: number | null;
  volume24h: number | null;
};
