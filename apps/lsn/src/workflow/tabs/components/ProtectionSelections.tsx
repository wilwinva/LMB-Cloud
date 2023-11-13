import React, { useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { Loading } from '@nwm/util';
import { FallbackProps, withErrorBoundary } from 'react-error-boundary';
import { CallCenterCheckboxesFragment } from '../__generated__/CallCenterCheckboxesFragment';
import { Checkbox, Stack, Text } from 'office-ui-fabric-react';
import { AdhocTabCheckboxesFragment } from '../__generated__/AdhocTabCheckboxesFragment';
import { AdhocChecks } from './__generated__/AdhocChecks';

export const adhoc_checks = gql`
  query AdhocChecks {
    workflow_adhoc_checks(order_by: { ID: asc }) {
      ID
      title
    }
  }
`;

interface ProtectionSelectionProps {
  selectedBoxes: CallCenterCheckboxesFragment | AdhocTabCheckboxesFragment;
}
export function ProtectionSelectionsComponent(props: ProtectionSelectionProps) {
  const [getDocs, { error, data, loading }] = useLazyQuery<AdhocChecks>(adhoc_checks);

  useEffect(() => {
    if (!data) getDocs();
  }, [getDocs]);

  if (error) {
    throw AdhocSelectionsQueryError(error);
  }

  if (loading || !data) {
    return (
      <Loading>
        <Text>Loading Selections...</Text>
      </Loading>
    );
  }
  const checkboxes = data.workflow_adhoc_checks;
  if (!checkboxes) throw AdhocError();

  const possibleSelections = props.selectedBoxes;
  const selectedBoxes = Object.entries(possibleSelections)
    .filter((cb) => cb[1] != null)
    .map((cb) => Number(cb[0].replace('check', '')));

  return (
    <>
      <Text className="section-header">Protection</Text>
      {checkboxes
        .filter((cb) => cb.title != null)
        .map((cb) => (
          // @ts-ignore
          <Stack horizontal>
            <Text>{cb.title}</Text>
            <Checkbox key={cb.ID} checked={selectedBoxes.includes(cb.ID)} />
          </Stack>
        ))}
    </>
  );
}

function AdhocError(innerError?: Error) {
  const innerErrorString = innerError ? `Inner Error: ${innerError}` : '';
  return new Error(`Failed to load Adhoc options: ${innerErrorString}`);
}

function AdhocSelectionsQueryError(innerError?: Error) {
  const innerErrorString = innerError ? `Inner Error: ${innerError}` : '';
  return new Error(`Failed to load Adhoc options with error: ${innerErrorString}`);
}

function ErrorFallback(props: FallbackProps) {
  return <Text>{` Failed to fetch Adhoc Selections with error: ${props.error} `}</Text>;
}

const ProtectionSelections = withErrorBoundary(ProtectionSelectionsComponent, ErrorFallback);
export default ProtectionSelections;
