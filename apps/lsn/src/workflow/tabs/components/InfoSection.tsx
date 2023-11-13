import React from 'react';
import { Text, Stack } from 'office-ui-fabric-react';

interface InfoSectionProps {
  decision_date: any;
  caller: string | null | undefined;
  lsn_relevent: any;
  foia_exemption: string | null;
  process: string | null | undefined;
  headerTitle: string;
}

export default function InfoSection(props: InfoSectionProps) {
  return (
    <>
      <Text className="section-header">{props.headerTitle}</Text>
      <Stack horizontal>
        <Text> Date</Text>
        <Text> {props.decision_date} </Text>
      </Stack>
      <Stack horizontal>
        <Text> Name </Text>
        <Text> {props.caller} </Text>
      </Stack>
      <Stack horizontal>
        <Text>Process</Text>
        <Text> {props.process} </Text>
      </Stack>
      <Stack horizontal>
        <Text> LSN Relevant </Text>
        <Text> {props.lsn_relevent} </Text>
      </Stack>
      <Stack horizontal>
        <Text>FOIA Exemption</Text>
        <Text> {props.foia_exemption} </Text>
      </Stack>
    </>
  );
}
