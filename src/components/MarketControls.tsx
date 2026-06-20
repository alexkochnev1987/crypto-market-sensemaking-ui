import { Group, SegmentedControl, Select, TextInput } from '@mantine/core';
import { Search } from 'lucide-react';
import type { MarketFilter, SortDirection, SortKey } from '../types/crypto';

type MarketControlsProps = {
  query: string;
  onQueryChange: (query: string) => void;
  filter: MarketFilter;
  onFilterChange: (filter: MarketFilter) => void;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSortKeyChange: (key: SortKey) => void;
  onSortDirectionChange: (direction: SortDirection) => void;
};

export function MarketControls({
  query,
  onQueryChange,
  filter,
  onFilterChange,
  sortKey,
  sortDirection,
  onSortKeyChange,
  onSortDirectionChange,
}: MarketControlsProps) {
  return (
    <Group align="center" gap="sm" justify="space-between" wrap="wrap">
      <TextInput
        leftSection={<Search size={16} />}
        maw={360}
        miw={240}
        onChange={(event) => onQueryChange(event.currentTarget.value)}
        placeholder="Search name or symbol"
        radius="md"
        value={query}
      />
      <SegmentedControl
        data={[
          { label: 'All', value: 'all' },
          { label: 'Gainers', value: 'gainers' },
          { label: 'Losers', value: 'losers' },
          { label: 'High volume', value: 'high-volume' },
          { label: 'Large cap', value: 'large-cap' },
        ]}
        onChange={(value) => onFilterChange(value as MarketFilter)}
        radius="md"
        value={filter}
      />
      <Group gap="sm">
        <Select
          allowDeselect={false}
          data={[
            { label: 'Rank', value: 'rank' },
            { label: 'Price', value: 'price' },
            { label: '1h change', value: 'change1h' },
            { label: '24h change', value: 'change24h' },
            { label: '7d change', value: 'change7d' },
            { label: 'Market cap', value: 'marketCap' },
            { label: 'Volume', value: 'volume24h' },
          ]}
          onChange={(value) => onSortKeyChange((value ?? 'rank') as SortKey)}
          radius="md"
          value={sortKey}
          w={160}
        />
        <SegmentedControl
          data={[
            { label: 'Desc', value: 'desc' },
            { label: 'Asc', value: 'asc' },
          ]}
          onChange={(value) => onSortDirectionChange(value as SortDirection)}
          radius="md"
          value={sortDirection}
        />
      </Group>
    </Group>
  );
}
