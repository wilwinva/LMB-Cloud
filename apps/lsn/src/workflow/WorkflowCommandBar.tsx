import React from 'react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';

export interface CommandProps {
  doneClick: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => boolean | void;
  backButtonClick: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => boolean | void;
  nextButtonClick: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => boolean | void;
  disabled: boolean;
  packageMode: boolean;
}

export function WorkflowCommandBar(_props: CommandProps) {
  const skipItem = {
    key: 'package',
    text: 'Package:',
    ariaLabel: 'Package',
    iconOnly: false,
    disabled: true,
  };
  const nextItem = {
    key: 'Next',
    text: _props.packageMode ? 'Skip' : 'Next',
    ariaLabel: _props.packageMode ? 'Skip' : 'Next',
    iconOnly: false,
    iconProps: { iconName: 'Next' },
    onClick: _props.nextButtonClick,
  };

  const _items: ICommandBarItemProps[] = [
    {
      key: 'Back',
      text: 'Back',
      iconOnly: true,
      iconProps: { iconName: 'Back' },
      onClick: _props.backButtonClick,
    },
    {
      key: 'Refresh',
      text: 'Refresh',
      iconOnly: true,
      iconProps: { iconName: 'Refresh' },
      onClick: () => console.log('Share'),
    },
  ];

  const _farItems: ICommandBarItemProps[] = [];
  // package mode shows an extra item on the right-hand side of the command bar
  _props.packageMode ? _farItems.push(skipItem, nextItem) : _farItems.push(nextItem);
  _farItems.push({
    key: 'Done',
    text: 'Done',
    // This needs an ariaLabel since it's icon-only
    ariaLabel: 'Done',
    iconOnly: false,
    iconProps: { iconName: 'Completed' },
    onClick: _props.doneClick,
    disabled: _props.disabled,
  });

  return (
    <div>
      <CommandBar
        items={_items}
        farItems={_farItems}
        ariaLabel="Use left and right arrow keys to navigate between commands"
      />
    </div>
  );
}

export default WorkflowCommandBar;
