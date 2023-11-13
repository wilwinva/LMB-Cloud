import React from 'react';
import { Text } from 'office-ui-fabric-react';

export interface TabProps {
  data: string;
}

export function WorkflowTabData(_props: TabProps) {
  return <Text> {_props.data}</Text>;
}

export default WorkflowTabData;
