import { Avatar, Badge, Card, Group, ScrollArea, Table, Text } from '@mantine/core';
import type { CoinMarket } from '../types/crypto';
import { formatPercent, formatUsd } from '../utils/format';

type MarketTableProps = {
  coins: CoinMarket[];
  selectedCoinId: string | null;
  onSelectCoin: (coinId: string) => void;
};

const movementColor = (value: number | null) => {
  if (value == null) return 'gray';
  if (value > 0) return 'green';
  if (value < 0) return 'red';
  return 'gray';
};

export function MarketTable({ coins, selectedCoinId, onSelectCoin }: MarketTableProps) {
  return (
    <Card padding={0} radius="md" withBorder>
      <ScrollArea>
        <Table className="market-table" highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Rank</Table.Th>
              <Table.Th>Coin</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th className="optional-sm">1h</Table.Th>
              <Table.Th>24h</Table.Th>
              <Table.Th className="optional-md">7d</Table.Th>
              <Table.Th className="optional-sm">Market cap</Table.Th>
              <Table.Th className="optional-md">Volume</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {coins.map((coin) => (
              <Table.Tr
                className={coin.id === selectedCoinId ? 'selected-row' : undefined}
                key={coin.id}
                onClick={() => onSelectCoin(coin.id)}
              >
                <Table.Td>
                  <Text fw={600} size="sm">
                    {coin.rank ?? 'N/A'}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap="sm" wrap="nowrap">
                    <Avatar alt="" radius="xl" size={28} src={coin.image} />
                    <div>
                      <Text fw={700} size="sm">
                        {coin.symbol}
                      </Text>
                      <Text c="dimmed" lineClamp={1} size="xs">
                        {coin.name}
                      </Text>
                    </div>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Text fw={600} size="sm">
                    {formatUsd(coin.price)}
                  </Text>
                </Table.Td>
                <Table.Td className="optional-sm">
                  <Badge color={movementColor(coin.change1h)} variant="light">
                    {formatPercent(coin.change1h)}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge color={movementColor(coin.change24h)} variant="light">
                    {formatPercent(coin.change24h)}
                  </Badge>
                </Table.Td>
                <Table.Td className="optional-md">
                  <Badge color={movementColor(coin.change7d)} variant="light">
                    {formatPercent(coin.change7d)}
                  </Badge>
                </Table.Td>
                <Table.Td className="optional-sm">{formatUsd(coin.marketCap, true)}</Table.Td>
                <Table.Td className="optional-md">{formatUsd(coin.volume24h, true)}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
      {coins.length === 0 ? (
        <Text c="dimmed" p="lg" ta="center">
          No assets match the current search and filters.
        </Text>
      ) : null}
    </Card>
  );
}
