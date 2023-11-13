import React from 'react';
import { InfoTableFragment } from './info-table/__generated__/InfoTableFragment';
import { Text } from 'office-ui-fabric-react';
import { last } from 'lodash/fp';

export function getVerificationStatus(data: InfoTableFragment['data_set_tbvs']) {
  const { tbv_num, tbv_status } = last(data)!;

  if (tbv_num === 0) {
    switch (tbv_status) {
      case '0':
        return 'Developed (acquired) under PVAR procedures or expert elicitation - No data verification is required';
      case '1':
        return 'Verified using governing procedure(s)';
      case '2':
        return 'Requires verification for use with principal factors.';
      default:
        return 'Requires verification and/or qualification';
    }
  }

  return <Text>To be verified, TBV #{tbv_num}</Text>;
}
