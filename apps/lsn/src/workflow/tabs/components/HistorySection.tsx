import React from 'react';
import { Text, Stack } from 'office-ui-fabric-react';

interface HistorySectionProps {
  add_date: any;
  add_user: string | null;
  updatex_date: any;
  update_user: string | null;
  status: any;
  notes: string | null;
}

export default function HistorySection(props: HistorySectionProps) {
  return (
    <>
      <Text className="section-header">History</Text>
      <Stack horizontal>
        <Text> Date Added</Text>
        <Text> {props.add_date} </Text>
      </Stack>
      <Stack horizontal>
        <Text> Added By User </Text>
        <Text> {props.add_user} </Text>
      </Stack>
      <Stack horizontal>
        <Text> Date Updated </Text>
        <Text> {props.updatex_date} </Text>
      </Stack>
      <Stack horizontal>
        <Text>Update User</Text>
        <Text> {props.update_user} </Text>
      </Stack>
      <Stack horizontal>
        <Text>Status</Text>
        <Text> {props.status} </Text>
      </Stack>
      <Stack horizontal>
        <Text> Notes </Text>
        <Text> {props.notes} </Text>
      </Stack>
    </>
  );
}
