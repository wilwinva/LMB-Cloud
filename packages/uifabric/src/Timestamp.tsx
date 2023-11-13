import React from 'react';
import Moment from 'moment';
import { Text } from 'office-ui-fabric-react';

export function Timestamp() {
  return (
    <Text
      variant="medium"
      style={{
        padding: '0.5em',
      }}
    >
      {Moment().format('MMM D hh:mm:ss')} Version: TDMS_V
      {require('../package.json').version} TDMS
    </Text>
  );
}
