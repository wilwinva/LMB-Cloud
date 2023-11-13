import React from 'react';

import { Stack, Text, Separator } from 'office-ui-fabric-react';

import { getSUILogTabStyles } from '../TabStyles';

import MemoTextField from '../../../components/MemoTextField';

interface SUILogTabSectionProps {
  headerText: string;
  defaultValue: string | null | undefined;
}

export default function SUILogTabSection(props: SUILogTabSectionProps) {
  const { textField } = getSUILogTabStyles(false);

  return (
    <>
      <Text variant={'large'}>{props.headerText}</Text>
      <MemoTextField defaultValue={props.defaultValue} textFieldStyles={textField} />
      <Separator />
    </>
  );
}
