import React from 'react';
import DocumentInfo, { DOCUMENT_INFO_FRAGMENTS } from './DocumentInfo';
import { TransferComponent } from '../../query/Transfer';
import { gql, useQuery } from '@apollo/client';
import { useParamsEncoded } from '@nwm/react-hooks';
import { Loading } from '@nwm/util';
import { Text } from 'office-ui-fabric-react';
import { DatasetComponentQuery, DatasetComponentQueryVariables } from './__generated__/DatasetComponentQuery';
import { FallbackProps, withErrorBoundary } from 'react-error-boundary';

export interface AtdtDocumentProps {}

const DATASET_COMPONENT_QUERY = gql`
  query DatasetComponentQuery($ds: String) {
    ...DocumentInfoFragment
  }
  ${DOCUMENT_INFO_FRAGMENTS}
`;

/**
 * Loads a TDIF component. Will attempt to query for the TDIF type using the data_set key parsed from the URL if no
 * component type is passed in.
 */
export function AtdtDocumentComponent(_props: AtdtDocumentProps) {
  const [tdifId] = useParamsEncoded();
  const { loading, error, data } = useQuery<DatasetComponentQuery, DatasetComponentQueryVariables>(
    DATASET_COMPONENT_QUERY,
    { variables: { ds: tdifId } }
  );

  if (!tdifId || error !== undefined) {
    throw TdifError(tdifId, error);
  }

  if (loading || data === undefined) {
    return <Loading />;
  }

  const component = getComponent(data);
  if (!component) {
    throw TdifError(tdifId);
  }

  return <DocumentInfo tdifId={tdifId} data={data} />;
}

function getComponent(data?: DatasetComponentQuery): TransferComponent | undefined {
  return data && data.db_tdms_data_set.length > 0 && data.db_tdms_data_set[0].transfer?.component
    ? (data.db_tdms_data_set[0].transfer?.component as TransferComponent)
    : isValidData(data);
}

function TdifError(tdif: string = '', innerError?: Error) {
  const innerErrorString = innerError ? `Inner Error: ${innerError}` : '';
  return new Error(`Failed to find TDIF with ds: ${tdif}.${innerErrorString}`);
}

function ErrorFallback(props: FallbackProps) {
  return <Text>{` Failed to fetch tdif with error: ${props.error} `}</Text>;
}

/*check for all possible dataset combinations that would mean the data is in-process but not completed and QCed*/
function isValidData(data: DatasetComponentQuery | undefined): TransferComponent | undefined {
  const dataSet = data?.db_tdms_data_set[0];
  if (dataSet && (dataSet.data_set_dit || dataSet?.tdif)) {
    return 'INPROCESS' as TransferComponent;
  }
  return undefined;
}

const AtdtDocument = withErrorBoundary(AtdtDocumentComponent, ErrorFallback);
export default AtdtDocument;
