import React from 'react';
import { CommandBar, ICommandBarItemProps, IButtonProps } from 'office-ui-fabric-react';

export interface CommandBarProps {
  onPageLeftClick: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => boolean | void;
  onPageRightClick: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => boolean | void;
  onHighlightClick: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => boolean | void;
  CustomItem?: ICommandBarItemProps;
  CustomButton?: IButtonProps;
  highlightButtonDisabled: boolean;
}

export function TextCommandBar(_props: CommandBarProps) {
  const _items: ICommandBarItemProps[] = [];

  if (_props.CustomItem) _items.push(_props.CustomItem); // need to add an order somehow, maybe just first or last logic
  _items.push(
    {
      key: 'PageBack',
      text: 'Page Back',
      iconOnly: true,
      iconProps: { iconName: 'PageLeft' },
      onClick: _props.onPageLeftClick,
    },
    {
      key: 'PageForward',
      text: 'Page Forward',
      iconOnly: true,
      iconProps: { iconName: 'PageRight' },
      onClick: _props.onPageRightClick,
    },
    {
      key: 'Highlight',
      text: 'Highlight Next Word',
      iconOnly: true,
      disabled: _props.highlightButtonDisabled,
      iconProps: { iconName: 'FabricTextHighlightComposite' },
      onClick: _props.onHighlightClick,
    }
  );

  return (
    <CommandBar
      items={_items}
      ariaLabel="Use left and right arrow keys to navigate between pages. Use Zoom In/Out to control view level"
    />
  );
}

export default TextCommandBar;
