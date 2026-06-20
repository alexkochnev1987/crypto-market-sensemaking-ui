import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCryptoMarkets } from '../api/crypto';
import { mockMarkets } from '../data/mockMarkets';
import type { MarketDataSource } from '../types/crypto';

export function useCryptoMarkets() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['crypto-markets'],
    queryFn: fetchCryptoMarkets,
  });

  const cachedData = queryClient.getQueryData<Awaited<ReturnType<typeof fetchCryptoMarkets>>>([
    'crypto-markets',
  ]);
  const hasLiveData = Boolean(query.data?.length);
  const hasCachedData = Boolean(cachedData?.length);
  const data = query.data ?? cachedData ?? mockMarkets;
  const source: MarketDataSource = hasLiveData ? 'live' : hasCachedData ? 'cached' : 'mock';

  return {
    ...query,
    data,
    source,
    isUsingMock: source === 'mock',
    hasCachedData,
  };
}
