import React, { PropsWithChildren } from 'react';
import { IStackTokens, Stack, Text } from 'office-ui-fabric-react';

// Tokens definition
const sectionStackTokens: IStackTokens = { childrenGap: 15 };

type ContentCardProps = {
  title: string;
};

function PageWithIntroBase(props: PropsWithChildren<ContentCardProps>) {
  const { title, children } = props;

  return (
    <Stack tokens={sectionStackTokens} style={{ margin: '10px' }}>
      <Text variant={'xLarge'} style={{ marginLeft: '0px' }}>
        {title}
      </Text>
      {children}
    </Stack>
  );
}

export const PageWithIntro: React.FunctionComponent<PropsWithChildren<ContentCardProps>> = React.memo(
  PageWithIntroBase
);
