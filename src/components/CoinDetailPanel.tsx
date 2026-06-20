import { Avatar, Badge, Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import type { CoinMarket } from '../types/crypto';
import { formatNumber, formatPercent, formatTime, formatUsd } from '../utils/format';
import { getCoinSignals } from '../utils/marketSignals';
import { Sparkline } from './charts/Sparkline';

type CoinDetailPanelProps = {
  coin: CoinMarket | null;
};

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="detail-metric">
    <Text c="dimmed" fw={600} size="xs" tt="uppercase">
      {label}
    </Text>
    <Text fw={700} size="sm">
      {value}
    </Text>
  </div>
);

export function CoinDetailPanel({ coin }: CoinDetailPanelProps) {
  if (!coin) {
    return (
      <Card className="sticky-panel" padding="lg" radius="md" withBorder>
        <Text c="dimmed" size="sm">
          Select an asset to inspect movement, liquidity, range, and data quality signals.
        </Text>
      </Card>
    );
  }

  const signals = getCoinSignals(coin);
  const isPositive = (coin.change7d ?? coin.change24h ?? 0) >= 0;

  return (
    <Card className="sticky-panel" padding="lg" radius="md" withBorder>
      <Stack gap="lg">
        <Group justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <Avatar alt="" radius="xl" size={42} src={coin.image} />
            <div>
              <Title order={3}>{coin.symbol}</Title>
              <Text c="dimmed" size="sm">
                {coin.name}
              </Text>
            </div>
          </Group>
          <Badge color="gray" variant="light">
            Rank {coin.rank ?? 'N/A'}
          </Badge>
        </Group>

        <div>
          <Text c="dimmed" fw={600} size="xs" tt="uppercase">
            Current price
          </Text>
          <Title order={2}>{formatUsd(coin.price)}</Title>
          <Group gap="xs" mt="xs">
            <Badge color={(coin.change1h ?? 0) >= 0 ? 'green' : 'red'} variant="light">
              1h {formatPercent(coin.change1h)}
            </Badge>
            <Badge color={(coin.change24h ?? 0) >= 0 ? 'green' : 'red'} variant="light">
              24h {formatPercent(coin.change24h)}
            </Badge>
            <Badge color={(coin.change7d ?? 0) >= 0 ? 'green' : 'red'} variant="light">
              7d {formatPercent(coin.change7d)}
            </Badge>
          </Group>
        </div>

        <div>
          <Group justify="space-between" mb="xs">
            <Text fw={700} size="sm">
              7D trend
            </Text>
            <Text c="dimmed" size="xs">
              API updated {formatTime(coin.lastUpdated)}
            </Text>
          </Group>
          <Sparkline positive={isPositive} values={coin.sparkline7d} />
        </div>

        <SimpleGrid cols={2} spacing="sm">
          <Metric label="Market cap" value={formatUsd(coin.marketCap, true)} />
          <Metric label="24h volume" value={formatUsd(coin.volume24h, true)} />
          <Metric label="24h high" value={formatUsd(coin.high24h)} />
          <Metric label="24h low" value={formatUsd(coin.low24h)} />
          <Metric label="Supply" value={formatNumber(coin.circulatingSupply)} />
          <Metric label="ATH gap" value={formatPercent(coin.athChangePercentage)} />
        </SimpleGrid>

        <Group gap="xs">
          {signals.map((signal) => (
            <Badge key={signal} variant="outline">
              {signal}
            </Badge>
          ))}
        </Group>
      </Stack>
    </Card>
  );
}
