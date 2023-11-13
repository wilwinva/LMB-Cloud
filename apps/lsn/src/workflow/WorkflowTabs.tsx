import React, { useMemo } from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';

import { gatherTabs } from './tabs/TabConstants';
import { DecisionsTab, decisionTabWorkflowIds } from './tabs/DecisionsTab';
import { ActiveDocument } from './WorkflowDocument';
import PrivilegesTab, { privilegeWorkflowIds } from './tabs/PrivilegesTab';

export interface WorkflowTabProps {
  workflowId: number;
  docid: number;
  activeDocument: ActiveDocument;
  onDecisionTabChange: (key: string, checked?: boolean) => void;
  lockAquired: boolean;
}

export function WorkflowTabs(props: WorkflowTabProps) {
  const items: JSX.Element[] = [];
  const tabs = useMemo(() => gatherTabs(props.docid, props.activeDocument.document), [props.activeDocument.document]);

  //special case of a tabs with editable fields. We want this tab first if enabled
  if (decisionTabWorkflowIds.includes(props.workflowId)) {
    items.push(
      <PivotItem headerText={'Decisions'} key={'decisionsTab'}>
        <DecisionsTab
          tabDecsions={props.activeDocument.decisionTabBoxes}
          onChange={props.onDecisionTabChange}
          lockAquired={props.lockAquired}
        />
      </PivotItem>
    );
  }

  if (privilegeWorkflowIds.includes(props.workflowId)) {
    items.push(
      <PivotItem headerText={'Privileges'} key={'privilegesTab'}>
        <PrivilegesTab
          activeDocument={props.activeDocument}
          onChange={props.onDecisionTabChange}
          lockAquired={props.lockAquired}
        />
      </PivotItem>
    );
  }

  // loop through available tabs, check if workflow ID exists in tab workflows array. if yes, dump pivot into items list
  tabs.forEach((tab) => {
    if (tab.workflows.includes(props.workflowId))
      items.push(
        <PivotItem headerText={tab.headerText} key={tab.key}>
          {tab.innerElement}
        </PivotItem>
      );
  });

  return <Pivot>{items}</Pivot>;
}

export default WorkflowTabs;
