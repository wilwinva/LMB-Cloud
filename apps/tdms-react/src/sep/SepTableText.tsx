import React from 'react';
import { gql } from '@apollo/client';
import { Stack } from 'office-ui-fabric-react';
import { SepTableTextFragment } from './__generated__/SepTableTextFragment';

export const SEP_TABLE_TEXT_QUERY = gql`
  fragment SepTableTextFragment on query_root {
    db_tdms_tdm_files(where: { dtn: { _eq: $ds } }) {
      file_name
    }
  }
`;

const hasZipFile =
  'The native data file is accessible via the Data File link above and may include README files. Table file data is included in the above Link. Links below may include README files.';
const noZipFile =
  'No original native file is available for this DTN. To download the data file for this DTN, click on the Table File links below.';

const loadDefaultText = (data: SepTableTextFragment) => {
  return data.db_tdms_tdm_files[0]?.file_name ? hasZipFile : noZipFile;
};

export interface SepTableTextProps {
  data: SepTableTextFragment;
}

export function SepTableText(props: SepTableTextProps) {
  const { data } = props;

  return <Stack>{loadDefaultText(data)}</Stack>;
}
