import React, { Suspense } from 'react';
import { IStackStyles, IStackTokens, Stack } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import { DocumentInfoFragment } from './__generated__/DocumentInfoFragment';
import TechnicalInformation, { TECHNICAL_INFORMATION_FRAGMENT } from './TechnicalInformation';
import InfoTable, { INFO_TABLE_FRAGMENT } from './info-table/InfoTable';
import SupersedeInfo, { SUPERSEDE_INFO_FRAGMENT } from './SupersedeInfo';
import DtnSourceInfo, { DTN_SOURCE_INFO_FRAGMENT } from './DtnSourceInfo';
import SoftwareTrackingNumbers, { STN_INFO_FRAGMENT } from './SoftwareTrackingNumbers';
import ParameterInfo, { PARAMETER_INFO_FRAGMENT } from './ParameterInfo';
import DirsInfo, { DIRS_INFO_FRAGMENT } from './DirsInfo';
import { TDIF_DISPLAY_TYPE_FRAGMENT, useTdifDisplayTypes } from './TdifDisplayTypes';

export const DOCUMENT_INFO_DATA_SET_FRAGMENT = gql`
  fragment DocumentInfoDataSetFragment on db_tdms_data_set {
    ...TechnicalInformationFragment
    ...InfoTableFragment
    ...SupersedeInfoFragment
    ...SoftwareTrackingNumbers
    ...ParameterInfoFragment
    ...DntSourceInfoFragment
    ...TdifDisplayTypeFragment
  }
  ${TECHNICAL_INFORMATION_FRAGMENT}
  ${INFO_TABLE_FRAGMENT}
  ${SUPERSEDE_INFO_FRAGMENT}
  ${STN_INFO_FRAGMENT}
  ${PARAMETER_INFO_FRAGMENT}
  ${DTN_SOURCE_INFO_FRAGMENT}
  ${TDIF_DISPLAY_TYPE_FRAGMENT}
`;

export const DOCUMENT_INFO_FRAGMENTS = gql`
  fragment DocumentInfoFragment on query_root {
    db_tdms_data_set(limit: 1, where: { ds: { _eq: $ds } }) {
      ...DocumentInfoDataSetFragment
    }
    db_tdms_dirs_tdms_dtns(where: { tracking_number: { _eq: $ds } }) {
      ...DirsInfoFragment
    }
  }
  ${DOCUMENT_INFO_DATA_SET_FRAGMENT}
  ${DIRS_INFO_FRAGMENT}
`;

const containerStackTokens: IStackTokens = {
  childrenGap: 5,
  padding: 5,
};

const maxStackWidth = 1200;
const stackStyles: IStackStyles = {
  root: {
    maxWidth: maxStackWidth,
    minWidth: 400,
  },
};

interface DocumentInfoProps {
  tdifId: string;
  data: DocumentInfoFragment;
}

function DocumentInfo(props: DocumentInfoProps) {
  const { data } = props;
  const data_set = data.db_tdms_data_set[0];
  const dirs_data = data.db_tdms_dirs_tdms_dtns;
  const tdifDisplayTypes = useTdifDisplayTypes(data_set);
  const showFull = !(tdifDisplayTypes.displayBrf1 || tdifDisplayTypes.displayBrf2);

  return (
    <Suspense fallback={<div>This is loading...</div>}>
      <Stack styles={stackStyles} tokens={containerStackTokens}>
        <Stack.Item>
          <TechnicalInformation data={data_set} tdifDisplayTypes={tdifDisplayTypes} />
        </Stack.Item>
        {!tdifDisplayTypes.displayNon && (
          <>
            <Stack.Item align="stretch">
              <InfoTable data={data_set} tdifDisplayTypes={tdifDisplayTypes} />
            </Stack.Item>
            {showFull && (
              <>
                <Stack.Item align="stretch">
                  <SupersedeInfo stackWidth={maxStackWidth} data={data_set} />
                </Stack.Item>
                <Stack.Item align="stretch">
                  <DtnSourceInfo stackWidth={maxStackWidth} data={data_set} />
                </Stack.Item>
                <Stack.Item>
                  <SoftwareTrackingNumbers stackWidth={maxStackWidth} data={data_set} />
                </Stack.Item>
              </>
            )}
            <Stack.Item>
              <ParameterInfo stackWidth={maxStackWidth} data={data_set} tdifDisplayTypes={tdifDisplayTypes} />
            </Stack.Item>
            {showFull && (
              <Stack.Item>
                <DirsInfo stackWidth={maxStackWidth} data={dirs_data} />
              </Stack.Item>
            )}
          </>
        )}
      </Stack>
    </Suspense>
  );
}

export default React.memo(DocumentInfo);
