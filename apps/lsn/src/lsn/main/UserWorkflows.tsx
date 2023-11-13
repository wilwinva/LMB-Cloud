import React from 'react';
import {
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  IDetailsRowStyles,
  SelectionMode,
} from 'office-ui-fabric-react/lib/DetailsList';
import { gql, useQuery } from '@apollo/client';
import {
  UserWorkflowsQuery,
  UserWorkflowsQuery_workflow_workflow,
  UserWorkflowsQueryVariables,
} from './__generated__/UserWorkflowsQuery';
import { Loading } from '@nwm/util';
import { Text } from 'office-ui-fabric-react';
import { FallbackProps, withErrorBoundary } from 'react-error-boundary';
import { AuthenticationContext } from '../../components/AuthProvider/AuthenticationContext';
import { Account } from 'msal';

/**
 * Workflows were previously shown based on the logic
 select *
 from WORKFLOW.WORKFLOW
 where APPLICATION_ID =1
 and ACTIVE='Y'
 and (exists (
 select 1
 from  {.}USERS
 where user_id = Upper(USER)
 and workflow_id = 0 )
 or (ID in ( select WORKFLOW_ID
 from {.}USERS
 where USER_ID= upper(USER) )))
 order by NAME)
 */

export interface UserWorkflowsProps {
  selectedRowChange?: (item?: any, index?: number, ev?: React.FocusEvent<HTMLElement>) => void; //optional for now until
}

const user_workflows = gql`
  query UserWorkflowsQuery($userId: String) {
    workflow_workflow(order_by: { ID: asc }, where: { user_workflows: { user_id: { _eq: $userId } } }) {
      ID
      NAME
      package_mode
      user_workflows(where: { user_id: { _eq: $userId } }) {
        stage_id
        user_id
      }
    }
  }
`;

export function UserWorkflowsComponent(props: UserWorkflowsProps) {
  const authContext = React.useContext(AuthenticationContext);
  const userAccount: Account = authContext.user.account;
  const user_id = userAccount.userName.split('@')[0];

  const { loading, error, data } = useQuery<UserWorkflowsQuery, UserWorkflowsQueryVariables>(user_workflows, {
    variables: { userId: user_id },
    fetchPolicy: 'no-cache',
  });

  if (error) {
    throw WorkflowQueryError(error);
  }
  if (loading || data === undefined) {
    return <Loading />;
  }

  const items = loadWorkflows(data);
  let _columns: IColumn[];
  _columns = [
    { key: 'column1', name: 'ID', fieldName: 'ID', minWidth: 50, maxWidth: 200, isResizable: true },
    { key: 'column2', name: 'Workflow', fieldName: 'NAME', minWidth: 500, maxWidth: 500, isResizable: true },
  ];

  const customStyles: Partial<IDetailsRowStyles> = {
    root: {
      cursor: 'pointer',
    },
  };
  return (
    <DetailsList
      items={items}
      columns={_columns}
      selectionMode={SelectionMode.single}
      onActiveItemChanged={props.selectedRowChange}
      setKey="none"
      layoutMode={DetailsListLayoutMode.justified}
      isHeaderVisible={true}
      checkboxVisibility={2}
      styles={customStyles}
    />
  );
}

function loadWorkflows(data?: UserWorkflowsQuery): UserWorkflowsQuery_workflow_workflow[] {
  return data && data.workflow_workflow ? data.workflow_workflow : [];
}

function WorkflowQueryError(innerError?: Error) {
  const innerErrorString = innerError ? `Inner Error: ${innerError}` : '';
  return new Error(`Failed to load workflows with error: ${innerErrorString}`);
}

function ErrorFallback(props: FallbackProps) {
  return <Text>{` Failed to fetch user workflows with error: ${props.error} `}</Text>;
}
const UserWorkflows = withErrorBoundary(UserWorkflowsComponent, ErrorFallback);
export default UserWorkflows;
