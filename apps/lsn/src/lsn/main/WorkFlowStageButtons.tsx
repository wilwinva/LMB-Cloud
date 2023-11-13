import React from 'react';
import { Button } from '@nwm/uifabric';
import { IIconProps, Separator } from 'office-ui-fabric-react';
import { useNavigate } from 'react-router';
import { UserWorkflowsQuery_workflow_workflow_user_workflows } from './__generated__/UserWorkflowsQuery';

/**
 * these buttons can be in a disabled state based on the selected workflow,
 * the stage to which the user can edit documents and
 * whether a stage has any documents in its queue
 */

export interface WorkFlowStageButtonsProps {
  workflow_id: number;
  pkg_mode: string | undefined;
  userWorkflows: UserWorkflowsQuery_workflow_workflow_user_workflows[];
}
function WorkFlowStageButtons(props: WorkFlowStageButtonsProps) {
  const navigate = useNavigate();
  const previewIcon: IIconProps = { iconName: 'Preview' };
  const historyIcon: IIconProps = { iconName: 'AwayStatus' };
  const checkList: IIconProps = { iconName: 'CheckList' };
  const reviewIcon: IIconProps = { iconName: 'WindowEdit' };
  const completeIcon: IIconProps = { iconName: 'CompletedSolid' };
  const exportIcon: IIconProps = { iconName: 'Export' };

  const reviewItem = (stageId: number) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    navigate('/workflow/id/' + props.workflow_id + '/' + props.pkg_mode + '/' + stageId);
  };

  const historyClick = (stageId: number) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    navigate('/workflow/history/' + props.workflow_id + '/' + stageId);
  };

  //console.log(props.userWorkflows);
  const reviewEnabled = !props.userWorkflows.some(({ stage_id }) => stage_id === 20);
  const qcEnabled = !props.userWorkflows.some(({ stage_id }) => stage_id === 30);
  const qaEnabled = !props.userWorkflows.some(({ stage_id }) => stage_id === 40);
  const completeEnabled = !props.userWorkflows.some(({ stage_id }) => stage_id === 50);
  const exportEnabled = !props.userWorkflows.some(({ stage_id }) => stage_id === 60);

  // need to review with Wil on the button onClick and any other events. Should probably inherit from UI fabric Button
  return (
    <>
      <Button text={'Preview'} icon={previewIcon} onClick={reviewItem(10)} disabled={props.workflow_id === 0} />
      <Separator />
      <Button text={'Review'} icon={reviewIcon} disabled={reviewEnabled} onClick={reviewItem(20)} />
      <Button text={'Review History'} icon={historyIcon} disabled={reviewEnabled} onClick={historyClick(20)} />
      <Separator />
      <Button text={'QC'} icon={checkList} disabled={qcEnabled} onClick={reviewItem(30)} />
      <Button text={'QC History'} icon={historyIcon} disabled={qcEnabled} onClick={historyClick(30)} />
      <Separator />
      <Button text={'QA'} icon={checkList} disabled={qaEnabled} onClick={reviewItem(40)} />
      <Button text={'QA History'} icon={historyIcon} disabled={qaEnabled} onClick={historyClick(40)} />
      <Separator />
      <Button text={'Complete'} icon={completeIcon} disabled={completeEnabled} onClick={reviewItem(50)} />
      <Button text={'Export'} icon={exportIcon} disabled={exportEnabled} onClick={reviewItem(60)} />
    </>
  );
}

export default WorkFlowStageButtons;
