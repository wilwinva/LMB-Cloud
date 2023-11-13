import React from 'react';
import { Text } from 'office-ui-fabric-react';
import { pipe, last } from 'lodash/fp';

import { MwdDataSet_data } from './__generated__/MwdDataSet';

const getQualificationStatus = (data_qual_flg: String | null) => {
  switch (data_qual_flg) {
    case 'Y':
      return 'Qualified';
    case 'N':
      return 'Unqualified';
    case 'A':
      return 'Accepted';
    case 'T':
      return 'Technical Product Output';
    default:
      return 'No Qualification Status Available';
  }
};

const getVerificationStatus = (data: MwdDataSet_data['data_set_tbvs']) => {
  const { tbv_num, tbv_status } = last(data)!;

  if (tbv_num === 0) {
    switch (tbv_status) {
      case '0':
        return 'Developed (acquired) under PVAR Procedures - No data verification is required';
      case '1':
        return 'Verified using governing procedure(s)';
      case '2':
        return 'No verification required - for non-principal factors only';
      default:
        return 'No verification data available';
    }
  }

  return <Text>To be verified, TBV #{tbv_num}</Text>;
};

const prelimToBoolean = (data: string | null) => (data === 'X' ? true : false);
const getPrelimDataStatusText = (prelim_data: boolean) => (prelim_data ? 'YES' : 'NO');
const getPrelimDataStatus = pipe(prelimToBoolean, getPrelimDataStatusText);

interface ImportantNotesProps {
  data: MwdDataSet_data;
}

export default function MwdImportantNotes(props: ImportantNotesProps) {
  const { data } = props;
  const { data_set_tbvs, qual_flg, prelim_data } = data;

  return (
    <>
      <Text variant={'large'}>
        <b>Important Notes</b>
      </Text>
      <ul>
        <li>
          <b>
            When using any of the information herein, the Data Tracking Number, Qualification Status, TBV Status, and
            any Disclaimers, Constraints, Limitations, etc... should be kept with your downloaded data.
          </b>
        </li>
        <li>
          <b>Verification Status:</b> {getVerificationStatus(data_set_tbvs)}
        </li>
        <li>
          <b>Data Qualification Status:</b> {getQualificationStatus(qual_flg)}
        </li>
        <li>
          <b>Preliminary Data:</b> {getPrelimDataStatus(prelim_data)}
        </li>
      </ul>
    </>
  );
}
