import React from 'react';
import { InfoTableFragment } from './__generated__/InfoTableFragment';
import { Stack } from 'office-ui-fabric-react';
import { formatDate } from '../../../components/helpers/FormatDateTime';

export interface PreliminaryProps {
  data_set_periods: Pick<InfoTableFragment, 'data_set_periods'>['data_set_periods'];
}
export default function Preliminary(props: PreliminaryProps) {
  const { data_set_periods } = props;
  return (
    <Stack>
      <Stack.Item>{formatDate(data_set_periods[0].start_dt)}</Stack.Item>
      <Stack.Item>to</Stack.Item>
      <Stack.Item>{formatDate(data_set_periods[0].stop_dt)}</Stack.Item>
    </Stack>
  );
}
