import { Card, Group, Stack, Text, Title } from '@mantine/core';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { MovementPoint } from '../../types/crypto';
import { formatPercent, formatUsd } from '../../utils/format';

type MarketMovementChartProps = {
  data: MovementPoint[];
};

export function MarketMovementChart({ data }: MarketMovementChartProps) {
  return (
    <Card padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between" wrap="wrap">
          <Stack gap={2}>
            <Title order={2}>Top 24h movers</Title>
            <Text c="dimmed" size="sm">
              Largest absolute moves among loaded assets. Stablecoins naturally drop out unless they move.
            </Text>
          </Stack>
        </Group>

        <div className="movement-chart">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, bottom: 8, left: 16 }}>
              <CartesianGrid horizontal={false} stroke="#e4e7ec" />
              <XAxis
                tickFormatter={(value: number) => `${value}%`}
                type="number"
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <YAxis
                dataKey="symbol"
                tickLine={false}
                type="category"
                width={64}
              />
              <ReferenceLine stroke="#8a94a6" x={0} />
              <Tooltip
                formatter={(value, _unusedName, point) => [
                  formatPercent(Number(value)),
                  point.payload.name,
                ]}
                labelFormatter={(label) => `${label}`}
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #d5dae3',
                  boxShadow: '0 12px 24px rgba(15, 23, 42, 0.12)',
                }}
                itemSorter={() => 0}
              />
              <Bar dataKey="change24h" name="24h change" radius={[4, 4, 4, 4]}>
                {data.map((entry) => (
                  <Cell
                    fill={entry.change24h >= 0 ? '#168a50' : '#c2413b'}
                    key={entry.id}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <Text c="dimmed" size="xs">
          Tooltip context includes liquidity: {data[0] ? `${data[0].symbol} volume ${formatUsd(data[0].volume24h, true)}` : 'N/A'}.
        </Text>
      </Stack>
    </Card>
  );
}
