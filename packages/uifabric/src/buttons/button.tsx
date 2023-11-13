import React from 'react';
import { DefaultButton, IIconProps, PrimaryButton, IButtonStyles } from 'office-ui-fabric-react';
import { useCustomizations } from '../themes';

export interface IButtonProps {
  disabled?: boolean;
  checked?: boolean;
  icon?: IIconProps;
  text?: string;
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  primary?: boolean;
  value?: string | string[] | number;
  width?: number;
}

export const Button: React.FunctionComponent<IButtonProps> = (props) => {
  const { disabled, checked, icon, text, href, onClick, primary, value, width } = props;
  const buttonWidth = width ? `${width}px` : '';
  const settings = useCustomizations().settings.extended!;
  const buttonStyles: IButtonStyles = {
    root: {
      borderRadius: settings.spacing.s2,
      minWidth: buttonWidth,
    },
  };
  const defaultButton = (
    <DefaultButton
      text={text}
      iconProps={icon}
      allowDisabledFocus
      disabled={disabled}
      checked={checked}
      onClick={onClick}
      value={value}
      href={href}
      styles={buttonStyles}
    />
  );
  const primaryButton = (
    <PrimaryButton
      text={text}
      iconProps={icon}
      allowDisabledFocus
      disabled={disabled}
      checked={checked}
      onClick={onClick}
      value={value}
      href={href}
      styles={buttonStyles}
    />
  );
  const button = primary ? primaryButton : defaultButton;
  return button;
};
