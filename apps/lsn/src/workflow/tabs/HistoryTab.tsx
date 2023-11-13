import React from 'react';
import { DetailsList, DetailsListLayoutMode, IColumn, IDetailsListStyles, SelectionMode } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import { WorkflowDocumentFragment } from '../__generated__/WorkflowDocumentFragment';

export interface HistoryTabProps {
  document: WorkflowDocumentFragment | undefined;
}

export const HISTORY_FRAGMENT = gql`
  fragment HistoryFragment on workflow_documents {
    history {
      COMMENTS
      datex
      doc_id
      exe_version
      stage
      time_in_seconds
      typex
      user_id
    }
  }
`;
export default function HistoryTab(props: HistoryTabProps) {
  const history = props.document ? props.document.history : [];

  const columns: IColumn[] = [
    {
      key: 'column1',
      name: 'Date',
      ariaLabel: 'Date',
      fieldName: 'datex',
      minWidth: 100,
      maxWidth: 100,
    },
    {
      key: 'column2',
      name: 'WorkflowID',
      fieldName: 'workflow_id',
      minWidth: 80,
      maxWidth: 80,
      data: 'string',
      onRender: () => {
        return <span>{props.document?.workflow_id}</span>;
      },
    },
    {
      key: 'column3',
      name: 'Stage',
      fieldName: 'stage',
      minWidth: 32,
      maxWidth: 100,
      isResizable: true,
      data: 'string',
    },
    {
      key: 'column4',
      name: 'User',
      fieldName: 'user_id',
      minWidth: 70,
      maxWidth: 70,
      isResizable: true,
      data: 'string',
    },
    {
      key: 'column5',
      name: 'Activity',
      fieldName: 'typex',
      minWidth: 100,
      maxWidth: 100,
      isResizable: true,
      data: 'string',
    },
    {
      key: 'column6',
      name: 'Minutes',
      fieldName: 'time_in_seconds',
      minWidth: 70,
      maxWidth: 90,
      data: 'string',
    },
    {
      key: 'column7',
      name: 'Details',
      fieldName: 'COMMENTS',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
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
      items={history}
      columns={columns}
      selectionMode={SelectionMode.none}
      setKey="none"
      layoutMode={DetailsListLayoutMode.justified}
      isHeaderVisible={true}
    />
  );
}
