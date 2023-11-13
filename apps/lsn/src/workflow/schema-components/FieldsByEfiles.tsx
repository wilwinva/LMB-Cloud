import React from 'react';
import { Text } from 'office-ui-fabric-react';
import { FallbackProps, withErrorBoundary } from 'react-error-boundary';
import { gql, useQuery } from '@apollo/client';
import { Loading } from '@nwm/util';
import FieldsTabData from '../tabs/FieldsTabData';
import { FieldsByEfilesQuery, FieldsByEfilesQueryVariables } from './__generated__/FieldsByEfilesQuery';

const fields_by_efiles = gql`
  query FieldsByEfilesQuery($ads_udi: String) {
    efiles_doc_main(where: { ads_udi: { _eq: $ads_udi } }) {
      p_acc_no
      title
      ads_ctrname
      ads_fpage
      ads_lpage
      ads_docdates
      types {
        doc_type
      }
    }
  }
`;

interface FieldsByEfilesProps {
  ads_udi: string;
}
export function FieldsByEfilesComponent(props: FieldsByEfilesProps) {
  const { loading, error, data } = useQuery<FieldsByEfilesQuery, FieldsByEfilesQueryVariables>(fields_by_efiles, {
    variables: { ads_udi: props.ads_udi },
  });

  if (error) {
    throw WorkflowQueryError(error);
  }
  if (!data || loading) {
    return <Loading />;
  }

  const doc = data.efiles_doc_main[0];
  return (
    <FieldsTabData
      acc_no={doc.p_acc_no}
      ctr={doc.ads_ctrname}
      doc_date={doc.ads_docdates}
      fpage={doc.ads_fpage}
      lpage={doc.ads_lpage}
      title={doc.title}
      types={doc.types}
    />
  );
}
function WorkflowQueryError(innerError?: Error) {
  const innerErrorString = innerError ? `Inner Error: ${innerError}` : '';
  return new Error(`Failed to load document with error: ${innerErrorString}`);
}

function ErrorFallback(props: FallbackProps) {
  return <Text>{` Failed to fetching document with error: ${props.error} `}</Text>;
}
const FieldsByEfiles = withErrorBoundary(FieldsByEfilesComponent, ErrorFallback);
export default FieldsByEfiles;
