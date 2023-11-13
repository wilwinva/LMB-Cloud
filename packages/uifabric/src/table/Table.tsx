import React, { useMemo, useState } from 'react';
import {
  DetailsList,
  IColumn,
  IDetailsColumnRenderTooltipProps,
  IDetailsFooterProps,
  IDetailsHeaderProps,
  IDetailsListProps,
  IRenderFunction,
  SelectionMode,
  Stack,
  Sticky,
  StickyPositionType,
  Text,
  TooltipHost,
} from 'office-ui-fabric-react';
import { useBaseStyles } from './useBaseStyles';

//This exists to capture any variation in sorts, such as data that is numeric or date. As it stands today, there is only one possibility.
export enum SortType {
  LEXIGRAPHICAL_STRING_SORT = 'lexigraphical_string_sort',
  //might add some later
}

export type OnRenderFunction<T> = (item?: T, index?: number, column?: IColumn) => React.ReactNode;
export type TargetString<T> = (it: T) => string;

export interface ColumnGeneric<T> extends Omit<IColumn, 'name' | 'onRender'> {
  onRender: OnRenderFunction<T>;
  getTargetString: TargetString<T>;
}

export type SortState = Required<Record<'key', string>> & Required<Record<'isSortedDescending', boolean>>;

export type TableProps<T> = Omit<Omit<IDetailsListProps, 'items'>, 'columns'> &
  Partial<Record<'items', T[] | undefined>> &
  Partial<Record<'sortState', SortState | undefined>> &
  Required<Record<'columns', ColumnGeneric<T>[]>>;

export function Table<T>(props: TableProps<T>) {
  const items = props.items ? props.items.slice(0) : undefined;
  const [sortState, setSortState] = useState<SortState | undefined>(props.sortState);
  const { detailsListStyles } = useBaseStyles();
  const columns: (ColumnGeneric<T> & Pick<IColumn, 'name'>)[] = useMemo(
    () =>
      props.columns.map((column) => ({
        ...column,
        name: column.key,
        onColumnClick: combineColumnClicks([
          (_e: React.MouseEvent<HTMLElement>, it: IColumn) => {
            if (sortState && it.key === column.key && column.key === sortState.key) {
              setSortState((previousState) => {
                if (previousState) {
                  return {
                    ...previousState,
                    isSortedDescending: !sortState.isSortedDescending,
                  };
                }
                return previousState;
              });
            } else {
              setSortState({ key: column.key, isSortedDescending: true });
            }
          },
          column.onColumnClick ? column.onColumnClick : (_a, _b) => {},
        ]),
      })),
    [sortState, props.columns]
  );
  const sortedItems = useMemo(() => {
    if (items) {
      return items.sort((a: T, b: T) => sortComparison<T>([columns, sortState, a, b]));
    }
    return [];
  }, [columns, items, sortState]);

  return props.items ? (
    <DetailsList
      {...staticDetailsListProps}
      items={sortedItems}
      columns={columns}
      onRenderDetailsHeader={onRenderDetailsHeader}
      onRenderDetailsFooter={onRenderDetailsFooter}
      styles={detailsListStyles}
    />
  ) : (
    <Stack>
      <Text>No Data Returned</Text>
    </Stack>
  );
}

function sortComparison<T>([columns, sortState, a, b]: [ColumnGeneric<T>[], SortState | undefined, T, T]) {
  if (sortState) {
    const foundColumn = columns.find((it: ColumnGeneric<T>) => it.key === sortState.key);
    if (foundColumn) {
      return sortValueComparison([
        foundColumn.getTargetString(a),
        foundColumn.getTargetString(b),
        sortState.isSortedDescending,
      ]);
    }
  }
  return 0;
}

export const sortValueComparison = ([a, b, isSortedDescending]: [
  string | number,
  string | number,
  boolean | undefined
]) => {
  if (isSortedDescending) {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    }
  } else if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  }
  return 0;
};

const staticDetailsListProps: Partial<IDetailsListProps> = {
  setKey: 'items',
  compact: false,
  disableSelectionZone: true,
  selectionMode: SelectionMode.none,
  ariaLabelForSelectAllCheckbox: 'Toggle selection for all items',
  ariaLabelForSelectionColumn: 'Toggle selection',
};

const onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (props, defaultRender) => {
  if (!props || !defaultRender) {
    return null;
  }
  const onRenderColumnHeaderTooltip: IRenderFunction<IDetailsColumnRenderTooltipProps> = (tooltipHostProps) => (
    <TooltipHost {...tooltipHostProps} />
  );
  return (
    <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced={true}>
      {defaultRender({
        ...props,
        onRenderColumnHeaderTooltip,
      })}
    </Sticky>
  );
};

/**
 * Hacky method of getting bottom border styles to play nice with scrollable. Putting the border on scrollable itself
 * always shows the full size of the scrollbar, looking incorrect when the table is smaller then the scrollable height.
 * */
const onRenderDetailsFooter: IRenderFunction<IDetailsFooterProps> = (_props, _defaultRender) => {
  return (
    <Sticky stickyPosition={StickyPositionType.Footer} isScrollSynced={true}>
      <div style={{ borderTop: '2px solid' }} />
    </Sticky>
  );
};

const combineColumnClicks = ([first, second]: [
  (_c: React.MouseEvent<HTMLElement>, _a: IColumn) => void,
  (_d: React.MouseEvent<HTMLElement>, _b: IColumn) => void
]) => {
  return (e: React.MouseEvent<HTMLElement>, it: IColumn) => {
    first(e, it);
    second(e, it);
  };
};
