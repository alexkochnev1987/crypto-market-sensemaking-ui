import { Badge, Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { Activity, ArrowDownRight, ArrowUpRight, Gauge, Landmark, RadioTower } from 'lucide-react';
import type { MarketSummary as MarketSummaryType } from '../types/crypto';
import { formatPercent, formatUsd } from '../utils/format';

type MarketSummaryProps = {
  summary: MarketSummaryType;
};

export function MarketSummary({ summary }: MarketSummaryProps) {
  const cards = [
    {
      label: 'Market mood',
      value: summary.mood,
      detail: summary.moodReason,
      icon: Gauge,
      color: summary.mood === 'Risk-on' ? 'green' : summary.mood === 'Risk-off' ? 'red' : 'yellow',
    },
    {
      label: 'Loaded market cap',
      value: formatUsd(summary.loadedMarketCap, true),
      detail: 'Sum of the loaded top 100 assets, not the full global market.',
      icon: Landmark,
      color: 'blue',
    },
    {
      label: 'Average 24h move',
      value: formatPercent(summary.averageChange24h),
      detail: `${summary.gainers} gainers, ${summary.losers} losers, ${summary.unchanged} flat.`,
      icon: Activity,
      color: summary.averageChange24h >= 0 ? 'green' : 'red',
    },
    {
      label: 'Highest volume',
      value: summary.highestVolume?.symbol ?? 'N/A',
      detail: summary.highestVolume
        ? `${formatUsd(summary.highestVolume.volume24h, true)} traded in 24h`
        : 'No volume data available.',
      icon: RadioTower,
      color: 'violet',
    },
    {
      label: 'Biggest mover',
      value: summary.biggestMover?.symbol ?? 'N/A',
      detail: summary.biggestMover
        ? `${formatPercent(summary.biggestMover.change24h)} over 24h`
        : 'No movement data available.',
      icon: summary.biggestMover && (summary.biggestMover.change24h ?? 0) < 0 ? ArrowDownRight : ArrowUpRight,
      color: summary.biggestMover && (summary.biggestMover.change24h ?? 0) < 0 ? 'red' : 'green',
    },
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 5 }} spacing="md">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card className="metric-card" key={card.label} padding="lg" radius="md" withBorder>
            <Stack gap="sm">
              <Group justify="space-between">
                <Text c="dimmed" fw={600} size="xs" tt="uppercase">
                  {card.label}
                </Text>
                <Badge color={card.color} variant="light">
                  <Icon size={13} />
                </Badge>
              </Group>
              <Title order={3}>{card.value}</Title>
              <Text c="dimmed" lineClamp={2} size="xs">
                {card.detail}
              </Text>
            </Stack>
          </Card>
        );
      })}
    </SimpleGrid>
  );
}
