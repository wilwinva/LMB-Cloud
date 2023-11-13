import React from 'react';
import { FallbackProps, withErrorBoundary } from 'react-error-boundary';
import { Text } from 'office-ui-fabric-react';

export default function withTextBoundryError<Props = {}>(
  component: React.ComponentType<Props>,
  errorMsg: string | undefined
) {
  function buildError(innerError?: Error) {
    const innerErrorString = innerError ? `Inner Error: ${innerError}.` : '';
    return new Error(`${errorMsg}. ${innerErrorString}`);
  }

  function ErrorFallback(props: FallbackProps) {
    return <Text>{props.error}</Text>;
  }

  const ErrorBoundry = withErrorBoundary<Props>(component, ErrorFallback);

  return {
    ErrorBoundry,
    buildError,
  };
}
