import * as React from 'react';
import { IStackStyles, Stack } from 'office-ui-fabric-react';
import { Outlet } from 'react-router';
import { ReactElement } from 'react';

export type AppProps = {
  headerElement: ReactElement; //todo -- way to type these without passing functions down?
};

export function App(props: React.PropsWithChildren<AppProps>) {
  const mainStackStyles: IStackStyles = {
    root: {
      margin: '5px',
    },
  };

  return (
    <>
      {props.headerElement}
      <Stack styles={mainStackStyles}>
        {props.children}
        <Outlet />
      </Stack>
    </>
  );
}
