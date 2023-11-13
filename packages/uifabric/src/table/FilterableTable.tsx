import React, { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { IStyle, IStyleSet, Stack, StackItem, Text, TextField } from 'office-ui-fabric-react';
import { ColumnGeneric, Table, TableProps, TargetString } from './Table';
import { useBaseStyles } from './useBaseStyles';
import { debounce } from 'lodash/fp';
import ScrollablePane, { CSSHeight } from './ScrollablePane';

const KEY_PRESS_DEBOUNCE_MS: number = 400;

export type FilterableTableProps<T> = TableProps<T> & Partial<CSSHeight>;

export interface Filter<T> {
  key: string;
  getTarget: TargetString<T>;
  current: string | undefined;
  styles?: IStyleSet<Record<any, IStyle>>;
}

export interface FilterMap<T> {
  [key: string]: Filter<T>;
}

export function FilterableTable<T>(props: PropsWithChildren<FilterableTableProps<T>>) {
  const { columns, children, styles, minHeight = 200, maxHeight = '65vh' } = props;
  const { stackStyles, scrollablePaneStyles, boldText, filterWrapper } = useBaseStyles(styles);
  const [filters, setFilters] = useState<FilterMap<T>>({});

  const _onChangeText = useCallback(
    debounce(KEY_PRESS_DEBOUNCE_MS, (columnKey: string, newValue?: string) => {
      const col = columns.find((col) => col.key === columnKey);
      if (col === undefined) {
        return;
      }

      setFilters((prev) => {
        const newFilter: Filter<T> = { key: columnKey, getTarget: col.getTargetString, current: newValue };
        return { ...prev, [col.key]: newFilter };
      });
    }),
    [columns]
  );

  const columnFilters = useMemo(
    () =>
      columns.filter((col) => col.getTargetString)
        ? columns.map((col) => (
            <StackItem key={col.key} styles={{ root: { margin: '5px' } }}>
              <TextField
                label={col.key}
                onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) =>
                  _onChangeText(col.key, newValue)
                }
              />
            </StackItem>
          ))
        : undefined,
    [columns, _onChangeText]
  );

  const items = useMemo(() => filterItems<T>(filters, props.items), [props.items, filters]);

  const _columns: ColumnGeneric<T>[] = props.columns.map((it) => ({ ...it }));
  return (
    <Stack styles={stackStyles}>
      <Text styles={{ root: boldText }}>Filter By:</Text>
      <Stack horizontal styles={{ root: filterWrapper }}>
        {columnFilters}
      </Stack>
      <ScrollablePane minHeight={minHeight} maxHeight={maxHeight} styles={scrollablePaneStyles}>
        <Table<T> {...props} columns={_columns} items={items} />
      </ScrollablePane>
      {children}
    </Stack>
  );
}

export const filterItems = <T extends {}>(filters: FilterMap<T>, items: T[] | undefined) => {
  const filterArray = Object.values(filters).filter((filter) => filter.current !== undefined);
  return items
    ? items.filter((it) =>
        filterArray.every((filter) =>
          filter
            .getTarget(it)
            .toLowerCase()
            .includes(filter.current ? filter.current.toLowerCase() : '')
        )
      )
    : [];
};
