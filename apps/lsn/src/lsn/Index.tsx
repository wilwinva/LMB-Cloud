import React, { useState } from 'react';
import { getTheme, IPalette } from 'office-ui-fabric-react/lib/Styling';
import UserWorkflows from './main/UserWorkflows';
import { Stack, StackItem, Text, IStackStyles, Separator } from 'office-ui-fabric-react';
import ManagerOnlyMenu from './main/ManagerOnlyMenu';
import WorkFlowStageButtons from './main/WorkFlowStageButtons';
import {
  UserWorkflowsQuery_workflow_workflow,
  UserWorkflowsQuery_workflow_workflow_user_workflows,
} from './main/__generated__/UserWorkflowsQuery';

export default function Index() {
  // selected workflow to be possibly pass around
  const [selectedWorkflow, setWorkflow] = useState<number>(0);
  const [pkgMode, setPkgMode] = useState<string>();
  const [userWorkflows, setUserWorkflows] = useState<UserWorkflowsQuery_workflow_workflow_user_workflows[]>([]);

  const palette: IPalette = getTheme().palette;

  const stackStyles: IStackStyles = {
    root: {
      background: palette.white,
      maxWidth: 800,
      selectors: {
        'div.workflows, div.workflow-header': {
          display: 'flex',
          backgroundColor: palette.white,
          width: 400,
          paddingLeft: 12,
          height: 'auto',
        },
        'div.actions, div.actions-header': {
          display: 'flex',
          paddingLeft: 25,
          width: 400,
          height: 'auto',
        },
        'div.actions-header, div.workflow-header': {
          justifyContent: 'center',
          backgroundColor: palette.white,
          paddingBottom: 15,
        },
        'div.actions > div > *': {
          marginTop: 5,
        },
        'div.actions > div > *:first-child': {
          marginTop: 0,
        },
      },
    },
  };

  const itemChanged = (data: UserWorkflowsQuery_workflow_workflow) => {
    setWorkflow(data.ID);
    setPkgMode(data.package_mode);
    setUserWorkflows(data.user_workflows);
  };

  return (
    <main role={'main'}>
      <Stack styles={stackStyles}>
        <Stack horizontal>
          <StackItem className="workflow-header">
            <Text>Select Workflow </Text>
          </StackItem>
          <StackItem className="actions-header">
            <Text>Available Options For: </Text>
          </StackItem>
        </Stack>
        <Stack horizontal>
          <UserWorkflows selectedRowChange={itemChanged} />
          <StackItem className="actions">
            <Stack>
              <ManagerOnlyMenu userWorkflows={userWorkflows} workflow_id={selectedWorkflow} />
              <Text>Stages: </Text>
              <Separator />
              <WorkFlowStageButtons userWorkflows={userWorkflows} workflow_id={selectedWorkflow} pkg_mode={pkgMode} />
            </Stack>
          </StackItem>
        </Stack>
      </Stack>
    </main>
  );
}
