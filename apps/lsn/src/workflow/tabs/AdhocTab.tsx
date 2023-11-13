import React from 'react';
import { getTheme, IPalette, IStackStyles, Stack, Text } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import { filter } from 'graphql-anywhere';
import HistorySection from './components/HistorySection';
import {
  WorkflowDocumentFragment,
  WorkflowDocumentFragment_adhoc_card,
} from '../__generated__/WorkflowDocumentFragment';
import { AdhocTabCheckboxesFragment } from './__generated__/AdhocTabCheckboxesFragment';
import ProtectionSelections from './components/ProtectionSelections';
import InfoSection from './components/InfoSection';

export const ADHOC_CHECKBOXES = gql`
  fragment AdhocTabCheckboxesFragment on workflow_adhoc_card {
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
export const ADHOC_TAB_FRAGMENT = gql`
  fragment AdhocTabFragment on workflow_documents {
    adhoc_card {
      NAME
      SCHEMA_NAME
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
      ...AdhocTabCheckboxesFragment
    }
  }
  ${ADHOC_CHECKBOXES}
`;

export interface AdhocTabProps {
  document: WorkflowDocumentFragment | undefined;
}

export function AdhocTab(props: AdhocTabProps) {
  const adhocCards: WorkflowDocumentFragment_adhoc_card[] = props.document ? props.document.adhoc_card : [];
  const adhoc_card = adhocCards[0];

  if (!adhoc_card) return <Text> No Adhoc Concerns for this document have been entered</Text>;
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

  const possibleSelections: AdhocTabCheckboxesFragment = filter(ADHOC_CHECKBOXES, adhoc_card);
  return (
    <Stack styles={stackStyles}>
      <InfoSection {...adhoc_card} headerTitle={'Batch'} caller={adhoc_card.NAME} />
      <ProtectionSelections selectedBoxes={possibleSelections} />
      <HistorySection {...adhoc_card} />
    </Stack>
  );
}

export default AdhocTab;
