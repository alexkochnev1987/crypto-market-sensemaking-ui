import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { RefreshCw } from 'lucide-react';
import { formatTime } from '../utils/format';

type MarketHeaderProps = {
  lastUpdatedAt: number;
  isFetching: boolean;
  onRefresh: () => void;
};

export function MarketHeader({ lastUpdatedAt, isFetching, onRefresh }: MarketHeaderProps) {
  return (
    <Group align="flex-start" justify="space-between" gap="lg" wrap="wrap">
      <Stack gap={4}>
        <Title order={1}>Crypto Market Sensemaking</Title>
        <Text c="dimmed" maw={760} size="sm">
          Top 100 crypto assets by market cap, organized around movement, breadth, volume, and data
          freshness.
        </Text>
      </Stack>
      <Group gap="sm">
        <Text c="dimmed" size="sm">
          Last refresh: {lastUpdatedAt ? formatTime(lastUpdatedAt) : 'Not loaded'}
        </Text>
        <Button
          leftSection={<RefreshCw size={16} />}
          loading={isFetching}
          onClick={onRefresh}
          radius="md"
          variant="filled"
        >
          Refresh
        </Button>
      </Group>
    </Group>
  );
}
