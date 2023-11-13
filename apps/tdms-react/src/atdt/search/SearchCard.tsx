import * as React from 'react';
import { Separator } from 'office-ui-fabric-react';
import { Card, ICardSectionTokens } from '@uifabric/react-cards';
import AtdtActionCard, { ActionCardProps } from '../components/AtdtActionCard';
import Input, { InputProps } from './Input';

export interface SearchCardProps
  extends Omit<ActionCardProps, 'onButtonClick'>,
    Pick<InputProps, 'choiceGroup' | 'inputHeader' | 'comboBoxProps' | 'loading'> {
  instructions: JSX.Element;
}

function buttonActions(props: any) {
  if (props.comboBoxProps) {
    return props.comboBoxProps.buttonClick;
  }
  return props.preload.nav;
}

function SearchCard<Q, V>(props: SearchCardProps) {
  const cardSectionTokens: ICardSectionTokens = {
    childrenGap: 10,
  };

  return (
    <AtdtActionCard onButtonClick={buttonActions(props)} {...props}>
      <Card.Section horizontal tokens={cardSectionTokens}>
        <Input {...props} />
        <Separator vertical />
        {props.instructions}
      </Card.Section>
    </AtdtActionCard>
  );
}

export default React.memo(SearchCard);
