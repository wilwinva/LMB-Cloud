import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  CommandBar,
  FontIcon,
  getTheme,
  ICommandBarItemProps,
  IPalette,
  IStackStyles,
  IStackTokens,
  mergeStyles,
  Separator,
  Stack,
  Text,
} from 'office-ui-fabric-react';
import { FallbackProps, withErrorBoundary } from 'react-error-boundary';
import { Loading } from '@nwm/util';
import { useParamsEncoded } from '@nwm/react-hooks';
import DocumentViewer from './DocumentViewer';
import { WorkflowQuery, WorkflowQuery_workflow_workflow, WorkflowQueryVariables } from './__generated__/WorkflowQuery';
import { Documents_workflow_documents } from './__generated__/Documents';
import { useNavigate } from 'react-router';

const workflow_query = gql`
  query WorkflowQuery($workflow_id: float8) {
    workflow_workflow(where: { ID: { _eq: $workflow_id } }) {
      ID
      NAME
      package_mode
    }
  }
`;
export interface DocumentManagerProps {
  historyView: boolean;
}
export function DocumentManagerComponent(_props: DocumentManagerProps) {
  const navigate = useNavigate();
  const [wflowId, pkg, stageId] = useParamsEncoded();
  const [selectedDoc, setSelectedDoc] = useState<Documents_workflow_documents>();
  const { loading, error, data } = useQuery<WorkflowQuery, WorkflowQueryVariables>(workflow_query, {
    variables: { workflow_id: wflowId },
  });

  if (error) {
    throw WorkflowQueryError(wflowId, error);
  }

  if (loading) {
    return <Loading />;
  }
  const workflow = getWorkflow(data);
  if (!workflow) {
    throw WorkflowQueryError(wflowId);
  }

  let stageText = (function (stageId: number): string {
    switch (stageId) {
      case 20:
        return 'Review';
      case 30:
        return 'QC';
      case 40:
        return 'QA';
      case 50:
        return 'Complete';
      case 60:
        return 'Export';
      default:
        return 'Preview';
    }
  })(Number(stageId));

  const _buttons: ICommandBarItemProps[] = [];
  const _rightAlignedButtons: ICommandBarItemProps[] = [
    {
      key: 'tile',
      text: 'Start ' + stageText,
      ariaLabel: 'Grid view',
      disabled: !selectedDoc,
      iconProps: { iconName: 'CheckListCheck' },
      onClick: () => {
        if (selectedDoc) navigate(`/workflow/document/${wflowId}/${stageId}/${selectedDoc.ID}`);
      },
    },
  ];

  const palette: IPalette = getTheme().palette;
  const containerStackTokens: IStackTokens = { childrenGap: 5 };
  const headStyles: IStackStyles = {
    root: {
      selectors: {
        'span.workflow-title': {
          color: palette.themeDark,
          fontWeight: 600,
        },
      },
    },
  };
  const iconClass = mergeStyles({
    fontSize: 25,
    height: 25,
    width: 25,
    margin: '0 10px',
    color: palette.themePrimary,
  });

  const setDocToReview = (doc?: Documents_workflow_documents) => {
    if (doc) setSelectedDoc(doc);
  };

  const pageTitle = _props.historyView
    ? 'DOE Documents for ' + workflow.NAME + ' History'
    : 'DOE Documents for ' + workflow.NAME;
  return (
    <Stack styles={headStyles} tokens={containerStackTokens}>
      <Text variant={'mediumPlus'} className="workflow-title">
        {pageTitle}
      </Text>
      <Separator>
        <FontIcon iconName="DocumentSet" className={iconClass} />
      </Separator>
      <Stack.Item>
        <CommandBar items={_buttons} farItems={_rightAlignedButtons} />
      </Stack.Item>
      <Stack.Item>
        <DocumentViewer setDocToReview={setDocToReview} historyMode={_props.historyView} />
      </Stack.Item>
    </Stack>
  );
}

function getWorkflow(data?: WorkflowQuery): WorkflowQuery_workflow_workflow | undefined {
  return data && data.workflow_workflow.length > 0 ? data.workflow_workflow[0] : undefined;
}
function WorkflowQueryError(workflowId: string, innerError?: Error) {
  return new Error(`Failed to load workflow with workflowId: ${workflowId}`);
}

function ErrorFallback(props: FallbackProps) {
  return <Text>{` Failed to fetch workflow with error: ${props.error} `}</Text>;
}

const DocumentManager = withErrorBoundary(DocumentManagerComponent, ErrorFallback);
export default DocumentManager;
