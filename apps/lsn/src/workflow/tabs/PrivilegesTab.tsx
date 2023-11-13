import React from 'react';
import { Text, Stack, Separator, IStackTokens } from 'office-ui-fabric-react';
import { ActiveDocument } from '../WorkflowDocument';
import { CommentsTab } from './CommentsTab';
import { DecisionsTab } from './DecisionsTab';

export interface PrivilegesTabProps {
  activeDocument: ActiveDocument;
  onChange: (key: string, checked: boolean) => void;
  lockAquired: boolean;
}

export const privilegeWorkflowIds = [33, 48, 99];

const containerStackTokens: IStackTokens = { childrenGap: 10 };
export function PrivilegesTab(props: PrivilegesTabProps) {
  return (
    <Stack tokens={containerStackTokens}>
      <Stack.Item>
        <Text variant={'large'}>Comments</Text>
        <Separator />
        <CommentsTab document={props.activeDocument.document} />
      </Stack.Item>
      <Stack.Item>
        <Text variant={'large'}>Privileges</Text>
        <Separator />
        <DecisionsTab
          tabDecsions={props.activeDocument.decisionTabBoxes}
          onChange={props.onChange}
          lockAquired={props.lockAquired}
        />
      </Stack.Item>
    </Stack>
  );
}

export default PrivilegesTab;
