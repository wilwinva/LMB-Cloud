import React from 'react';
import { gql } from '@apollo/client';

import { Stack, Text, Separator } from 'office-ui-fabric-react';

import { WorkflowDocumentFragment } from '@nwm/lsn/src/workflow/__generated__/WorkflowDocumentFragment';
import { getStatementTabStyles } from './TabStyles';
import StatementsTabSection from './components/StatementsTabSection';

export interface StatementsTabProps {
  document: WorkflowDocumentFragment | undefined;
}

export const STATEMENT_TAB_FRAGMENT = gql`
  fragment StatementTabFragment on workflow_documents {
    final_priv_log {
      title
      confidentiality
      purpose
      subject_matter
    }
  }
`;

export function StatementsTab(props: StatementsTabProps) {
  const finalPrivLog = props.document?.final_priv_log;
  const { tabContent } = getStatementTabStyles(false);

  return (
    <Stack className={tabContent}>
      <Text variant="xLarge">{finalPrivLog?.title}</Text>
      <Separator />
      <StatementsTabSection headerText="Subject Matter Description" sectionText={finalPrivLog?.subject_matter} />
      <StatementsTabSection headerText="Purpose of Document" sectionText={finalPrivLog?.purpose} />
      <StatementsTabSection headerText="Confidentiality Statement" sectionText={finalPrivLog?.confidentiality} />
    </Stack>
  );
}

export default StatementsTab;
