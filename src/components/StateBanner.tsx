import { Alert, Badge, Group, Text } from '@mantine/core';
import { AlertTriangle, Database, RefreshCw } from 'lucide-react';
import type { MarketDataSource } from '../types/crypto';
import { formatAge } from '../utils/format';

type StateBannerProps = {
  source: MarketDataSource;
  isFetching: boolean;
  isStale: boolean;
  error: Error | null;
  dataUpdatedAt: number;
};

export function StateBanner({ source, isFetching, isStale, error, dataUpdatedAt }: StateBannerProps) {
  const tone = source === 'loading' ? 'blue' : error ? 'orange' : source === 'mock' ? 'yellow' : isStale ? 'gray' : 'green';
  const icon = error || source === 'mock' ? <AlertTriangle size={18} /> : <Database size={18} />;

  const message =
    source === 'loading'
      ? 'Loading live market data from CoinGecko.'
      : source === 'mock'
      ? 'Live API data is unavailable, so the dashboard is using sample market data.'
      : error
        ? 'The latest refresh failed. Existing market data remains visible while you retry.'
        : isStale
          ? 'Market data is older than the freshness window. Refresh when you need the latest read.'
          : 'Market data is fresh within the current two-minute freshness window.';

  return (
    <Alert color={tone} icon={icon} radius="md" variant="light">
      <Group justify="space-between" gap="sm" wrap="wrap">
        <Text size="sm">{message}</Text>
        <Group gap="xs">
          {isFetching ? (
            <Badge color="blue" leftSection={<RefreshCw size={12} />} variant="light">
              Refreshing
            </Badge>
          ) : null}
          <Badge color={tone} variant="filled">
            {source === 'loading' ? 'Loading' : source === 'mock' ? 'Mock fallback' : isStale ? 'Stale' : 'Fresh'}
          </Badge>
          {dataUpdatedAt ? (
            <Text c="dimmed" size="xs">
              Updated {formatAge(dataUpdatedAt)}
            </Text>
          ) : null}
        </Group>
      </Group>
    </Alert>
  );
}
