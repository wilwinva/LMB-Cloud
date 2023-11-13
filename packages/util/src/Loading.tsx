import React from 'react';
import { Text } from 'office-ui-fabric-react';

type LoadingProps = {
  name?: string;
};

function LoadingBase(props: React.PropsWithChildren<LoadingProps>) {
  const { name } = props;

  if (!name && !props.children) {
    console.warn(`Loading component should be passed a name or props.children; falling back to empty div.`);
    return <div />;
  }

  return name ? <Text>Loading {name}...</Text> : <> {props.children} </>;
}

export const Loading: React.FunctionComponent<LoadingProps> = React.memo(LoadingBase);
