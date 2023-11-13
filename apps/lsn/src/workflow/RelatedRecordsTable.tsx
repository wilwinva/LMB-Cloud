import React from 'react';
import { List, IRectangle, mergeStyleSets } from 'office-ui-fabric-react';
import { useConstCallback } from '@uifabric/react-hooks';

export interface RelatedRecordsTableProps<T = any> {
  items?: T[];
  onRenderCell?: (item?: T, index?: number, isScrolling?: boolean) => React.ReactNode;
}

export default function RelatedRecordsTable(props: RelatedRecordsTableProps) {
  const VIEW_PORT_HEIGHT = 100;
  const ROWS_PER_PAGE = 10;
  const getPageSpecs = useConstCallback((itemIndex: number | undefined, visibleRect: IRectangle | undefined) => {
    return { data: props.items, height: VIEW_PORT_HEIGHT, itemCount: ROWS_PER_PAGE };
  });

  const styles = mergeStyleSets({
    container: {
      overflow: 'auto',
      maxHeight: 203,
      maxWidth: 555,
    },
  });

  return (
    <div data-is-scrollable id="related-records">
      <List
        className={styles.container}
        items={props.items}
        getPageSpecification={getPageSpecs}
        onRenderCell={props.onRenderCell}
      />
    </div>
  );
}
