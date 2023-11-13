import React from 'react';
import { DetailsList, DetailsListLayoutMode, SelectionMode, IColumn, IDetailsListStyles } from 'office-ui-fabric-react';
import {
  WorkflowDocumentFragment,
  WorkflowDocumentFragment_doc_sources,
} from '../__generated__/WorkflowDocumentFragment';

export interface SourcesTabProps {
  document: WorkflowDocumentFragment | undefined;
}

export function SourcesTab(props: SourcesTabProps) {
  const doc_sources: WorkflowDocumentFragment_doc_sources[] = props.document ? props.document.doc_sources : [];

  const columns: IColumn[] = [
    {
      key: 'column1',
      name: 'Source',
      ariaLabel: 'Source',
      minWidth: 100,
      maxWidth: 100,
      onRender: (item: WorkflowDocumentFragment_doc_sources) => {
        return <span>{item.source?.NAME}</span>;
      },
    },
    {
      key: 'column2',
      name: 'Date',
      fieldName: 'datex',
      minWidth: 150,
      maxWidth: 150,
      data: 'string',
    },
    {
      key: 'column3',
      name: 'User',
      fieldName: 'user_id',
      minWidth: 150,
      maxWidth: 150,
      data: 'string',
    },
    {
      key: 'column4',
      name: 'Comments',
      isResizable: true,
      fieldName: 'COMMENTS',
      minWidth: 150,
      maxWidth: 250,
      data: 'string',
    },
  ];

  const styles: IDetailsListStyles = {
    root: {
      marginTop: 10,
    },
    focusZone: '',
    headerWrapper: '',
    contentWrapper: '',
  };

  return (
    <DetailsList
      styles={styles}
      items={doc_sources}
      columns={columns}
      selectionMode={SelectionMode.none}
      setKey="none"
      layoutMode={DetailsListLayoutMode.justified}
      isHeaderVisible={true}
    />
  );
}

export default SourcesTab;
