import { Card, Container, Grid, Group, Skeleton, Stack, Text, Title } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { CoinDetailPanel } from './components/CoinDetailPanel';
import { MarketControls } from './components/MarketControls';
import { MarketHeader } from './components/MarketHeader';
import { MarketSummary } from './components/MarketSummary';
import { MarketTable } from './components/MarketTable';
import { StateBanner } from './components/StateBanner';
import { MarketMovementChart } from './components/charts/MarketMovementChart';
import { useCryptoMarkets } from './hooks/useCryptoMarkets';
import type { MarketFilter, SortDirection, SortKey } from './types/crypto';
import { filterCoins, getMarketSummary, getTopMovers, sortCoins } from './utils/marketSignals';

function LoadingState() {
  return (
    <Stack gap="md">
      <Group grow>
        <Skeleton height={118} radius="md" />
        <Skeleton height={118} radius="md" visibleFrom="sm" />
        <Skeleton height={118} radius="md" visibleFrom="md" />
      </Group>
      <Skeleton height={360} radius="md" />
    </Stack>
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<MarketFilter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);

  const marketsQuery = useCryptoMarkets();
  const coins = marketsQuery.data ?? [];
  const dataUpdatedAt = marketsQuery.source === 'mock' ? 0 : marketsQuery.dataUpdatedAt;

  const summary = useMemo(() => getMarketSummary(coins), [coins]);
  const topMovers = useMemo(() => getTopMovers(coins), [coins]);
  const visibleCoins = useMemo(
    () => sortCoins(filterCoins(coins, filter, query), sortKey, sortDirection),
    [coins, filter, query, sortDirection, sortKey],
  );
  const selectedCoin = useMemo(
    () => visibleCoins.find((coin) => coin.id === selectedCoinId) ?? visibleCoins[0] ?? null,
    [selectedCoinId, visibleCoins],
  );

  useEffect(() => {
    const nextSelectedId = visibleCoins.find((coin) => coin.id === selectedCoinId)?.id ?? visibleCoins[0]?.id ?? null;

    if (nextSelectedId !== selectedCoinId) {
      setSelectedCoinId(nextSelectedId);
    }
  }, [selectedCoinId, visibleCoins]);

  const showInitialLoading = marketsQuery.source === 'loading';
  const error = marketsQuery.error instanceof Error ? marketsQuery.error : null;

  return (
    <Container className="app-container" fluid>
      <Stack gap="lg">
        <MarketHeader
          isFetching={marketsQuery.isFetching}
          lastUpdatedAt={dataUpdatedAt}
          onRefresh={() => {
            void marketsQuery.refetch();
          }}
        />

        <StateBanner
          dataUpdatedAt={dataUpdatedAt}
          error={error}
          isFetching={marketsQuery.isFetching}
          isStale={marketsQuery.isStale || marketsQuery.source !== 'live'}
          source={marketsQuery.source}
        />

        {showInitialLoading ? (
          <LoadingState />
        ) : (
          <>
            <MarketSummary summary={summary} />

            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, lg: 8 }}>
                <Stack gap="lg">
                  <MarketMovementChart data={topMovers} />

                  <Card padding="lg" radius="md" withBorder>
                    <Stack gap="md">
                      <Group justify="space-between" wrap="wrap">
                        <div>
                          <Title order={2}>Explore top 100</Title>
                          <Text c="dimmed" size="sm">
                            {visibleCoins.length} assets visible after search, filter, and sort.
                          </Text>
                        </div>
                      </Group>
                      <MarketControls
                        filter={filter}
                        onFilterChange={setFilter}
                        onQueryChange={setQuery}
                        onSortDirectionChange={setSortDirection}
                        onSortKeyChange={setSortKey}
                        query={query}
                        sortDirection={sortDirection}
                        sortKey={sortKey}
                      />
                      <MarketTable
                        coins={visibleCoins}
                        onSelectCoin={setSelectedCoinId}
                        selectedCoinId={selectedCoin?.id ?? null}
                      />
                    </Stack>
                  </Card>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, lg: 4 }}>
                <CoinDetailPanel coin={selectedCoin} />
              </Grid.Col>
            </Grid>
          </>
        )}
      </Stack>
    </Container>
  );
}
