import React from 'react';
import { getTheme, IPalette, IStackStyles, Stack, Text } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import {
  WorkflowDocumentFragment,
  WorkflowDocumentFragment_call_center,
} from '../__generated__/WorkflowDocumentFragment';
import HistorySection from './components/HistorySection';
import InfoSection from './components/InfoSection';
import { filter } from 'graphql-anywhere';
import { CallCenterCheckboxesFragment } from './__generated__/CallCenterCheckboxesFragment';
import ProtectionSelections from './components/ProtectionSelections';

export interface CallCenterTabProps {
  document: WorkflowDocumentFragment | undefined;
}

export const CALLCENTER_CHECKBOXES = gql`
  fragment CallCenterCheckboxesFragment on workflow_call_center_acc_no {
    check01
    check02
    check03
    check04
    check05
    check06
    check07
    check08
    check09
    check10
    check11
    check12
    check13
    check14
    check15
    check16
    check17
    check18
    check19
    check20
    check21
    check22
    check23
    check24
    check25
    check26
    check27
    check28
    check29
    check30
  }
`;

export const CALLCENTER_TAB_FRAGMENT = gql`
  fragment CallCenterTabFragment on workflow_documents {
    call_center {
      NAME
      acc_no
      add_date
      add_user
      ads_udi
      batch_id
      decision_authority
      decision_date
      foia_exemption
      lsn_relevent
      notes
      process
      status
      update_user
      updatex_date
      call_center_name {
        caller
      }
      ...CallCenterCheckboxesFragment
    }
  }
  ${CALLCENTER_CHECKBOXES}
`;

export default function CallCenterTab(props: CallCenterTabProps) {
  const callCenterDocs: WorkflowDocumentFragment_call_center[] = props.document ? props.document.call_center : [];
  const callCenterDoc = callCenterDocs[0];

  if (!callCenterDoc) return <Text> No Call Center Concerns for this document have been entered</Text>;

  const possibleSelections: CallCenterCheckboxesFragment = filter(CALLCENTER_CHECKBOXES, callCenterDoc);
  const palette: IPalette = getTheme().palette;
  const stackStyles: IStackStyles = {
    root: {
      paddingTop: 10,
      selectors: {
        'span.section-header': {
          backgroundColor: palette.themeTertiary,
          width: 210,
          fontWeight: 600,
          borderRight: '1px solid ' + palette.neutralTertiary,
        },
        'div > span:first-child': {
          backgroundColor: palette.neutralQuaternaryAlt,
          width: 200,
          marginRight: 10,
          paddingLeft: 10,
          paddingBottom: 3,
          paddingTop: 3,
          borderRight: '1px solid ' + palette.neutralTertiary,
          borderBottom: '1px solid ' + palette.neutralTertiary,
        },
      },
    },
  };

  return (
    <Stack styles={stackStyles}>
      <InfoSection {...callCenterDoc} caller={callCenterDoc.call_center_name?.caller} headerTitle={'Call'} />
      <ProtectionSelections selectedBoxes={possibleSelections} />
      <HistorySection {...callCenterDoc} />
    </Stack>
  );
}
