import React from 'react';
import { DetailsList, DetailsListLayoutMode, SelectionMode, IColumn, IDetailsListStyles } from 'office-ui-fabric-react';
import { WorkflowDocumentFragment } from '../__generated__/WorkflowDocumentFragment';

export interface WorkflowsTabProps {
  document: WorkflowDocumentFragment | undefined;
}

export function WorkflowsTab(props: WorkflowsTabProps) {
  const otherWorkflows = props.document ? props.document.other_workflows : [];

  const columns: IColumn[] = [
    {
      key: 'column1',
      name: 'Workflow',
      ariaLabel: 'workflow',
      minWidth: 100,
      maxWidth: 200,
      onRender: () => {
        return <span>{props.document?.workflow?.NAME}</span>;
      },
    },
    {
      key: 'column2',
      name: 'Decision',
      fieldName: 'RESULT',
      minWidth: 150,
      maxWidth: 150,
      data: 'string',
    },
  ];

  const styles: IDetailsListStyles = {
    root: {
      marginTop: 10,
      width: 550,
    },
    focusZone: '',
    headerWrapper: '',
    contentWrapper: '',
  };

  return (
    <DetailsList
      styles={styles}
      items={otherWorkflows}
      columns={columns}
      selectionMode={SelectionMode.none}
      setKey="none"
      layoutMode={DetailsListLayoutMode.justified}
      isHeaderVisible={true}
    />
  );
}

export default WorkflowsTab;
