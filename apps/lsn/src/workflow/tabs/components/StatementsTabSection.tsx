import React from 'react';
import { Card } from '@uifabric/react-cards';
import { Stack, Text, Separator, ICommandBarItemProps, CommandBar } from 'office-ui-fabric-react';
import { getStatementTabStyles } from '../TabStyles';

interface StatementsTabSectionProps {
  headerText: string;
  sectionText: string | null | undefined;
}
export default function StatementsTabSection(props: StatementsTabSectionProps) {
  const { card, none, stackPadding, subTitle } = getStatementTabStyles(false);
  const _farItems: ICommandBarItemProps[] = [
    {
      key: 'copy',
      text: 'Copy',
      // This needs an ariaLabel since it's icon-only
      ariaLabel: 'Copy',
      iconOnly: true,
      iconProps: { iconName: 'Copy' },
      onClick: () => console.log('Copy Clicked'),
    },
    {
      key: 'edit',
      text: 'Edit',
      ariaLabel: 'Edit',
      iconOnly: true,
      iconProps: { iconName: 'Edit' },
      onClick: () => console.log('Edit Clicked'),
    },
  ];
  return (
    <Card className={card} aria-label={props.headerText}>
      <Card.Item>
        <Stack className={stackPadding} horizontal horizontalAlign="space-between">
          <Text className={subTitle} variant="large">
            {props.headerText}
          </Text>
        </Stack>
        <Separator />
        <Text variant="mediumPlus">{props.sectionText || <span className={none}>None</span>}</Text>
        <CommandBar
          items={[]}
          farItems={_farItems}
          ariaLabel="Use left and right arrow keys to navigate between commands"
        />
      </Card.Item>
    </Card>
  );
}
