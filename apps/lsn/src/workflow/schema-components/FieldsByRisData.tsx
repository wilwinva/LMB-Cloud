import React from 'react';
import { Text } from 'office-ui-fabric-react';
import { FallbackProps, withErrorBoundary } from 'react-error-boundary';
import { gql, useQuery } from '@apollo/client';
import { Loading } from '@nwm/util';
import FieldsTabData from '../tabs/FieldsTabData';
import { FieldsByRisDataQuery, FieldsByRisDataQueryVariables } from './__generated__/FieldsByRisDataQuery';

const fields_by_risdata = gql`
  query FieldsByRisDataQuery($ads_udi: String) {
    risdata_doc_main(where: { ads_udi: { _eq: $ads_udi } }) {
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

interface FieldsByRisDataProps {
  ads_udi: string;
}
export function FieldsByRisDataComponent(props: FieldsByRisDataProps) {
  const { loading, error, data } = useQuery<FieldsByRisDataQuery, FieldsByRisDataQueryVariables>(fields_by_risdata, {
    variables: { ads_udi: props.ads_udi },
  });

  if (error) {
    throw WorkflowQueryError(error);
  }
  if (!data || loading) {
    return <Loading />;
  }

  const doc = data.risdata_doc_main[0];
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
const FieldsByRisData = withErrorBoundary(FieldsByRisDataComponent, ErrorFallback);
export default FieldsByRisData;
