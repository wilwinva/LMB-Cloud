import React from 'react';
import { IIconProps } from 'office-ui-fabric-react';
import { Button } from '@nwm/uifabric';
import { UserWorkflowsQuery_workflow_workflow_user_workflows } from './__generated__/UserWorkflowsQuery';

/**
 * these are to be shown based on the logic from the legacy app
 * stage ID 1
 *  - Users button enabled
 *
 * Stage ID 2
 * - Settings button enabled
 *
 * Stage ID 3
 *  - Documents button enabled
 *
 *  Stage ID 4
 *  - Users Button enabled but with limited users (investigation needed)
 *  - not going to rely on a btn value to limit the type of users one can edit
 *
 *  IF THE USER IS A DBA THEY WERE GRANTED FULL RIGHTS TO ALL THESE BUTTONS
 */
interface ManagerMenuProps {
  workflow_id: number;
  userWorkflows: UserWorkflowsQuery_workflow_workflow_user_workflows[];
}

export default function ManagerOnlyMenu(props: ManagerMenuProps) {
  const showUsers = () => () => {
    alert('show users');
  };
  const showSettings = () => () => {
    alert('settings');
  };

  // bleh, do I really want to follow the old logic of showing this panel or not
  // if non of these are available to the user for a given workflow?
  if (!props.userWorkflows.some(({ stage_id }) => stage_id === 1 || stage_id === 2 || stage_id === 3 || stage_id === 4))
    return <></>;

  const userEnabled = props.userWorkflows.some(({ stage_id }) => stage_id === 1 || stage_id === 4);
  const settingsEnabled = props.userWorkflows.some(({ stage_id }) => stage_id === 2);
  const documentsEnabled = props.userWorkflows.some(({ stage_id }) => stage_id === 3);
  const statusEnabled = props.userWorkflows.some(({ stage_id }) => stage_id === 3);

  const usersIcon: IIconProps = { iconName: 'Group' };
  const settingsIcon: IIconProps = { iconName: 'Settings' };
  const documentstIcon: IIconProps = { iconName: 'DocumentSet' };
  const statusIcon: IIconProps = { iconName: 'TrackersMirrored' };

  return (
    <>
      <Button text={'Users'} onClick={showUsers()} icon={usersIcon} disabled={!userEnabled} />
      <Button text={'Settings'} onClick={showSettings()} icon={settingsIcon} disabled={!settingsEnabled} />
      <Button text={'Documents'} icon={documentstIcon} disabled={!documentsEnabled} />
      <Button text={'Status'} icon={statusIcon} disabled={!statusEnabled} />
    </>
  );
}
