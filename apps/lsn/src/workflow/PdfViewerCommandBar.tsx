import React from 'react';
import { CommandBar, ICommandBarItemProps, IButtonProps } from 'office-ui-fabric-react';

export interface CommandBarProps {
  onPageLeftClick: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => boolean | void;
  onPageRightClick: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => boolean | void;
  onZoomInClick: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => boolean | void;
  onZoomOutClick: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => boolean | void;
  CustomItem?: ICommandBarItemProps;
  CustomButton?: IButtonProps;
}

export function PdfViewerCommandBar(_props: CommandBarProps) {
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
      key: 'ZoomIn',
      text: 'Zoom In',
      iconOnly: true,
      iconProps: { iconName: 'ZoomIn' },
      onClick: _props.onZoomInClick,
    },
    {
      key: 'ZoomOut',
      text: 'Zoom Out',
      iconOnly: true,
      iconProps: { iconName: 'ZoomOut' },
      onClick: _props.onZoomOutClick,
    }
  );

  return (
    <CommandBar
      items={_items}
      ariaLabel="Use left and right arrow keys to navigate between pages. Use Zoom In/Out to control view level"
    />
  );
}

export default PdfViewerCommandBar;
