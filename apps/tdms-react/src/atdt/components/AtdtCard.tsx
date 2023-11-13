import { ITextStyles, StackItem, Text } from 'office-ui-fabric-react';
import { Card, ICardStyles, ICardTokens } from '@uifabric/react-cards';
import * as React from 'react';
import { getTheme, IPalette } from 'office-ui-fabric-react/lib/Styling';

export interface AtdtCardProps {
  headerText: string;
}

export default function AtdtCard(props: React.PropsWithChildren<AtdtCardProps>) {
  const palette: IPalette = getTheme().palette;

  const cardStyles: ICardStyles = {
    root: {
      backgroundColor: palette.white,
      border: '2px solid',
    },
  };
  const cardTokens: ICardTokens = {
    childrenMargin: 0,
    maxWidth: '1200px',
    minWidth: '400px',
  };

  const labelStyles: ITextStyles = {
    root: {
      fontWeight: 'bold',
    },
  };

  const cardHeaderStyles: ICardStyles = {
    root: {
      backgroundColor: palette.themePrimary,
      borderBottom: '2px solid',
    },
  };

  return (
    <Card tokens={cardTokens} styles={cardStyles}>
      <Card.Section styles={cardHeaderStyles}>
        <StackItem align="center">
          <Text variant="large" styles={labelStyles}>
            {props.headerText}
          </Text>
        </StackItem>
      </Card.Section>
      {props.children}
    </Card>
  );
}
