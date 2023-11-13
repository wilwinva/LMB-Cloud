import React from 'react';
import { IStackStyles, IStackTokens, Stack, Text } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import { WorkflowDocumentFragment } from '../__generated__/WorkflowDocumentFragment';
import RelatedRecords from '../RelatedRecords';
import FieldsByEmail from '../schema-components/FieldsByEmail';
import FieldsByRisData from '../schema-components/FieldsByRisData';
import FieldsByPaper from '../schema-components/FieldsByPaper';
import FieldsByEfiles from '../schema-components/FieldsByEfiles';

export interface FieldsTabProps {
  document: WorkflowDocumentFragment | undefined;
}

export const FIELDS_TAB_FRAGMENT = gql`
  fragment FieldsTabFragment on workflow_documents {
    ads_udi
    SCHEMA_NAME
    fpage
    lpage
    pages
  }
`;

export function FieldsTab(props: FieldsTabProps) {
  const stackStyles: IStackStyles = {
    root: {
      marginTop: 5,
      selectors: {
        'div>span': {
          fontWeight: 600,
          marginRight: 5,
          width: 140,
        },
        'div.doc-types > div': {
          marginRight: 10,
        },
      },
    },
  };

  if (!props.document?.ads_udi) return <></>;
  const FieldsComponent = (schemaName: string | undefined, ads_udi: string) => {
    switch (schemaName) {
      case 'EMAIL':
        return <FieldsByEmail ads_udi={ads_udi} />;
      case 'RISDATA':
        return <FieldsByRisData ads_udi={ads_udi} />;
      case 'PAPER':
        return <FieldsByPaper ads_udi={ads_udi} />;
      case 'EFILES':
        return <FieldsByEfiles ads_udi={ads_udi} />;
      default:
        return <></>;
    }
  };
  const sectionStackTokens: IStackTokens = { childrenGap: 10 };
  return (
    <Stack styles={stackStyles} tokens={sectionStackTokens}>
      <Stack>
        <Stack horizontal>
          <Text>Document ID:</Text>
          <Stack.Item>{props.document.ads_udi}</Stack.Item>
        </Stack>
        <Stack horizontal>
          <Text>Collection:</Text>
          <Stack.Item>{props.document.SCHEMA_NAME}</Stack.Item>
        </Stack>
      </Stack>
      {FieldsComponent(props.document.SCHEMA_NAME, props.document.ads_udi)}
      <Stack>
        <Stack.Item>Related Records :</Stack.Item>
        <Stack.Item>
          <RelatedRecords document={props.document} />
        </Stack.Item>
      </Stack>
    </Stack>
  );
}

export default FieldsTab;
