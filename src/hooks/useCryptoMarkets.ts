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
  const hasLiveData = query.isSuccess && Boolean(query.data?.length);
  const hasCachedData = !hasLiveData && Boolean(cachedData?.length);
  const shouldUseMock = query.isError && !hasCachedData;
  const data = hasLiveData ? query.data : hasCachedData ? cachedData : shouldUseMock ? mockMarkets : [];
  const source: MarketDataSource = hasLiveData
    ? 'live'
    : hasCachedData
      ? 'cached'
      : shouldUseMock
        ? 'mock'
        : 'loading';

  return {
    ...query,
    data,
    source,
    isUsingMock: source === 'mock',
    hasCachedData,
  };
}
