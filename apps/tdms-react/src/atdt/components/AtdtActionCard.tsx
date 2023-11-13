import * as React from 'react';
import { Card, ICardStyles } from '@uifabric/react-cards';
import { PrimaryButton, StackItem } from 'office-ui-fabric-react';
import { getTheme, IPalette } from 'office-ui-fabric-react/lib/Styling';
import AtdtCard, { AtdtCardProps } from './AtdtCard';

export interface ActionCardProps extends AtdtCardProps {
  onButtonClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function AtdtActionCard(props: React.PropsWithChildren<ActionCardProps>) {
  const palette: IPalette = getTheme().palette;

  const cardFooterStyles: ICardStyles = {
    root: {
      backgroundColor: palette.themeTertiary,
      borderTop: '2px solid',
    },
  };

  const button = <PrimaryButton text="Go!" onClick={props.onButtonClick} />;

  const footer = (
    <>
      {props.children}
      <Card.Section styles={cardFooterStyles}>
        <StackItem align="end" styles={{ root: { padding: '5px 10px 5px 0' } }}>
          {button}
        </StackItem>
      </Card.Section>
    </>
  );
  return <AtdtCard headerText={props.headerText} children={footer} />;
}
