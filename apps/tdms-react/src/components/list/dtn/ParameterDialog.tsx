import * as React from 'react';
import { Dialog, DialogType, IDialogContentProps } from 'office-ui-fabric-react/lib/Dialog';

const modalPropsStyles = { main: { maxWidth: 450 } };

export interface dialogContentProps extends Pick<IDialogContentProps, 'title' | 'subText'> {
  showDialog: boolean;
  close: () => void;
}

export const ParametersDialog = (props: dialogContentProps) => {
  const modalProps = {
    isBlocking: true,
    styles: modalPropsStyles,
    isDarkOverlay: true,
  };

  const dialogContentProps = {
    type: DialogType.normal,
    title: props.title,
    subText: props.subText,
  };

  return (
    <Dialog
      hidden={!props.showDialog}
      onDismiss={props.close}
      dialogContentProps={dialogContentProps}
      modalProps={modalProps}
    ></Dialog>
  );
};
