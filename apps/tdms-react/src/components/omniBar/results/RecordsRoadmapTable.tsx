import React, { Reducer, useCallback, useMemo, useReducer } from 'react';
import {
  ConstrainMode,
  DetailsList,
  getTheme,
  IColumn,
  IDetailsColumnRenderTooltipProps,
  IDetailsHeaderProps,
  IGroup,
  IRenderFunction,
  IScrollablePaneStyles,
  IStackStyles,
  mergeStyleSets,
  ScrollablePane,
  ScrollbarVisibility,
  SelectionMode,
  Separator,
  Stack,
  StackItem,
  Sticky,
  StickyPositionType,
  Text,
  TextField,
  TooltipHost,
} from 'office-ui-fabric-react';
import { debounce, Dictionary, groupBy } from 'lodash';
import { gql } from '@apollo/client';
import useLinks from '../../../hooks/links/useLinks';
import { RecordsRoadmapTableFragment } from './__generated__/RecordsRoadmapTableFragment';
import { values } from 'lodash/fp';
import { sortValueComparison } from '@nwm/uifabric';

export const RECORDS_ROADMAP_TABLE_QUERY = gql`
  fragment RecordsRoadmapTableFragment on db_tdms_data_set {
    id
    tdif_no
    ds
    data_set_records_roadmaps(where: { rec_flag: { _neq: " " } }) {
      id
      rec_flag
      rec_num
      rec_title
      doc_type
      rec_contents
    }
  }
`;

const EMPTY_DIV = <></>;

interface ItemDataMap {
  [key: string]: RecordsRoadmapTableFragment;
}

const _buildColumns = (
  onColumnClick: ((_c: React.MouseEvent<HTMLElement>, _a: IColumn) => void) | undefined,
  itemDataMap: ItemDataMap,
  [tdifLinkProps, tdifDataSetLinkProps]: any
): IColumn[] => {
  return [
    {
      key: 'A/P/I',
      name: 'A/P/I',
      minWidth: 200,
      maxWidth: 200,
      onColumnClick: onColumnClick,
      onRender: (item?: Item) => (item ? <Text>{item['A/P/I']}</Text> : EMPTY_DIV),
    },
    {
      key: 'Record No',
      name: 'Record No',
      minWidth: 200,
      maxWidth: 200,
      onColumnClick: onColumnClick,
      onRender: (item?: Item) => (item ? <Text>{item['Record No']}</Text> : EMPTY_DIV),
    },
    {
      key: 'Record Title',
      name: 'Record Title',
      minWidth: 500,
      maxWidth: 500,
      onColumnClick: onColumnClick,
      isMultiline: true,
      onRender: (item?: Item) => (item ? <Text>{item['Record Title']}</Text> : EMPTY_DIV),
    },
    {
      key: 'Doc Type',
      name: 'Doc Type',
      minWidth: 200,
      maxWidth: 200,
      onColumnClick: onColumnClick,
      onRender: (item?: Item) => (item ? <Text>{item['Doc Type']}</Text> : EMPTY_DIV),
    },
    {
      key: 'Record Contents',
      name: 'Record Contents',
      minWidth: 200,
      maxWidth: 200,
      onColumnClick: onColumnClick,
      isMultiline: true,
      onRender: (item?: Item) => (item ? <Text>{item['Record Contents']}</Text> : EMPTY_DIV),
    },
  ];
};

interface Action {
  type: string;
}

interface FilterByAction extends Action {
  type: 'filter-by';
  payload: Filter;
}

type Actions = FilterByAction;

export interface RecordsRoadmapTableProps {
  data: RecordsRoadmapTableFragment[];
  sort?: SortProps;
}

interface State {
  filters: Filter[];
}

type Filter = [keyof Item, string | undefined];

interface Item {
  DTN: string | null;
  'TDIF No': number | null;
  'A/P/I'?: string | null;
  'Record No'?: string | null;
  'Record Title'?: string | null;
  'Doc Type'?: string | null;
  'Record Contents'?: string | null;
}

interface SortProps {
  columnKey: keyof Item;
  isDescending: boolean;
}

const initState = {
  filters: [],
};

function reducer(state: State, action: Actions): State {
  switch (action.type) {
    case 'filter-by': {
      const [columnKey, filterText] = action.payload;
      const newFilter: Filter[] = filterText ? [[columnKey, filterText]] : [];
      const filters = newFilter.concat(state.filters.filter(([_columnKey, _]) => _columnKey !== columnKey));

      return {
        ...state,
        filters: filters,
      };
    }
    default:
      throw new Error();
  }
}

export default function RecordsRoadmapTable(props: RecordsRoadmapTableProps) {
  const { data, sort } = props;

  const [state, dispatch] = useReducer<Reducer<State, Actions>>(reducer, initState);

  const links = useLinks();
  const tdifDataSetLinkProps = links.atdt.dataset_metadata.globalTextLinkProps;
  const tdifLinkProps = links.atdt.tdif.globalTextLinkProps;

  const itemDataMap = useMemo(
    () =>
      data.reduce((acc, row) => {
        if (row && row.tdif_no) {
          acc[row.tdif_no] = row;
        }
        return acc;
      }, {} as { [key: string]: RecordsRoadmapTableFragment }),
    [data]
  );

  const columns = useMemo(() => _buildColumns(undefined, itemDataMap, [tdifLinkProps, tdifDataSetLinkProps]), [
    itemDataMap,
    tdifDataSetLinkProps,
  ]);

  const _onChangeText = useCallback(
    debounce(
      (columnKey: string, filter?: string) => dispatch({ type: 'filter-by', payload: [columnKey as any, filter] }),
      400
    ),
    []
  );

  const columnFilters = useMemo(
    () =>
      columns
        ? [{ key: 'TDIF No', name: 'TDIF No' } as IColumn, { key: 'DTN', name: 'DTN' } as IColumn]
            .concat(columns)
            .map((col) => (
              <StackItem key={col.key} styles={{ root: { margin: '5px' } }}>
                <TextField
                  label={col.name}
                  onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) =>
                    _onChangeText(col.key, newValue)
                  }
                />
              </StackItem>
            ))
        : undefined,
    [columns, _onChangeText]
  );

  const sortColumn = sort?.columnKey ?? 'TDIF No';
  const isDescending = sort?.isDescending ?? false;

  const flatItems: Item[] = getFlatItems(data);
  const _items = useMemo(() => applyFilters(flatItems, state.filters), [flatItems, state.filters]);
  const sortedItems = useMemo(() => copyAndSort(_items, sortColumn, isDescending), [_items]);
  const groupedItems = groupBy<Item>(sortedItems, sortColumn);
  const groups = getGroups(groupedItems, isDescending);

  const onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (props, defaultRender) => {
    if (!props) {
      return null;
    }
    const onRenderColumnHeaderTooltip: IRenderFunction<IDetailsColumnRenderTooltipProps> = (tooltipHostProps) => (
      <TooltipHost {...tooltipHostProps} />
    );
    return (
      <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced>
        {defaultRender!({
          ...props,
          onRenderColumnHeaderTooltip,
        })}
      </Sticky>
    );
  };

  const theme = getTheme();
  const palette = theme.palette;
  const classNames = mergeStyleSets({
    baseStack: {
      padding: 8,
    },
    scrollable: {
      position: 'absolute',
      top: 300,
      left: 345,
      right: 16,
    },
    purpleHeader: {
      selectors: {
        '.ms-DetailsHeader': {
          background: theme.palette.themePrimary!,
          color: theme.palette.themeSecondary,
        },
        '.ms-DetailsHeader-cell': {
          background: theme.palette.themePrimary,
          color: theme.palette.themeSecondary,
        },
        '.ms-Icon': {
          color: theme.palette.themeSecondary,
        },
        '.ms-GroupedList-group': {
          borderBottom: `1px solid ${palette.black}`,
        },
        '.ms-List-page': {
          selectors: {
            '.ms-DetailsRow-fields, .ms-DetailsRow-cell': {
              borderWidth: 0,
            },
            '.ms-DetailsRow-cell': {
              paddingLeft: 8,
              paddingRight: 8,
            },
          },
        },
      },
    },
  });

  const baseStackStyles: Partial<IStackStyles> = { root: classNames.baseStack };
  const scrollablePaneStyles: Partial<IScrollablePaneStyles> = { root: classNames.scrollable };

  const list = sortedItems.length ? (
    <ScrollablePane
      scrollbarVisibility={ScrollbarVisibility.auto}
      styles={scrollablePaneStyles}
      className={classNames.purpleHeader}
    >
      <DetailsList
        setKey="items"
        compact={true}
        items={sortedItems}
        groups={groups}
        columns={columns}
        disableSelectionZone={true}
        selectionMode={SelectionMode.none}
        constrainMode={ConstrainMode.horizontalConstrained}
        onRenderDetailsHeader={onRenderDetailsHeader}
        ariaLabelForSelectAllCheckbox="Toggle selection for all items"
        ariaLabelForSelectionColumn="Toggle selection"
      />
    </ScrollablePane>
  ) : (
    <Text>No data returned.</Text>
  );

  return (
    <Stack styles={baseStackStyles}>
      <Text styles={{ root: { fontWeight: 'bold' } }}>Filter By:</Text>
      <Stack horizontal>{columnFilters}</Stack>
      <Separator />
      {list}
    </Stack>
  );
}

const getFlatItems = (data: RecordsRoadmapTableFragment[]): Item[] => {
  return data.flatMap((row) => {
    return row.data_set_records_roadmaps.length > 0
      ? row.data_set_records_roadmaps.map((entry) => {
          return {
            DTN: row.ds,
            'TDIF No': row.tdif_no,
            'A/P/I': entry.rec_flag,
            'Record No': entry.rec_num,
            'Record Title': entry.rec_title,
            'Doc Type': entry.doc_type,
            'Record Contents': entry.rec_contents,
          };
        })
      : []; //[{ DTN: row.ds, 'TDIF No': row.tdif_no }]; //BUG-4672 removing so there are no records without supporting data
  });
};

const getGroups = (groupedItems: Dictionary<Item[]>, isDescending: boolean): IGroup[] => {
  let idx = 0;
  const _groupedItems = isDescending ? values(groupedItems).reverse() : values(groupedItems);

  return _groupedItems.map((items) => {
    const _idx = idx;
    const count = items.length;
    idx = _idx + count;
    const _item = items[0];
    return {
      key: _item['TDIF No']?.toString() ?? '',
      name: `TDIF: ${_item['TDIF No']} DTN: ${_item['DTN']}`,
      startIndex: _idx,
      count: count,
      level: 0,
      isCollapsed: true,
    };
  });
};

const applyFilters = (items: any[], filters: Filter[]) =>
  items.filter((item) => !item || filters.every((filter) => checkFilters(filter, item)));

const checkFilters = ([columnKey, filterText]: Filter, item: Item) => {
  if (!filterText) {
    return true;
  }

  const searchTerm = filterText.toLowerCase();
  const target = `${item[columnKey]}`.toLowerCase();
  return target.indexOf(searchTerm) > -1;
};

function copyAndSort(items: Item[], columnKey: keyof Item, isSortedDescending?: boolean): Item[] {
  return items.slice(0).sort((a, b) => {
    const aValue: string | number | null | undefined = a[columnKey];
    const bValue: string | number | null | undefined = b[columnKey];
    if (aValue) {
      if (bValue) {
        return sortValueComparison([aValue, bValue, isSortedDescending]);
      }
      return 1;
    } else if (bValue) {
      return -1;
    }
    return 0;
  });
}
