import React from 'react';
import { DocumentNode, gql } from '@apollo/client';
import { WorkflowDocumentFragment } from './__generated__/WorkflowDocumentFragment';
import Records from './Records';

export const RELATED_RECORDS_RIS = gql`
  query RELATEDRECORDS_RIS($ads_udi: String, $limit: Int, $offset: Int) {
    risdata_doe_related_rec(
      where: { _or: [{ ads_udi: { _eq: $ads_udi } }, { rel_ads_udi: { _eq: $ads_udi } }] }
      order_by: { rel_rec_code: asc }
      limit: $limit
      offset: $offset
    ) {
      rel_rec_code
      ads_udi
      rel_ads_udi
    }

    risdata_doe_related_rec_aggregate(
      where: { _or: [{ ads_udi: { _eq: $ads_udi } }, { rel_ads_udi: { _eq: $ads_udi } }] }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const RELATED_RECORDS_EMAIL = gql`
  query EMAIL_RELATED_RECORDS($ads_udi: String, $limit: Int, $offset: Int) {
    email_doe_related_rec(
      where: { _or: [{ ads_udi: { _eq: $ads_udi } }, { rel_ads_udi: { _eq: $ads_udi } }] }
      order_by: { rel_rec_code: asc }
      limit: $limit
      offset: $offset
    ) {
      rel_rec_code
      ads_udi
      rel_ads_udi
    }

    email_doe_related_rec_aggregate(
      where: { _or: [{ ads_udi: { _eq: $ads_udi } }, { rel_ads_udi: { _eq: $ads_udi } }] }
    ) {
      aggregate {
        count
      }
    }
  }
`;

interface RelatedRecordsProps {
  document: WorkflowDocumentFragment;
}

export default function RelatedRecords(props: RelatedRecordsProps) {
  let query: DocumentNode = props.document.SCHEMA_NAME !== 'EMAIL' ? RELATED_RECORDS_RIS : RELATED_RECORDS_EMAIL;
  return <Records document={props.document} gqlQuery={query} />;
}
