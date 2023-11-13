import React from 'react';
import { Dialog, DialogType } from 'office-ui-fabric-react';
import { useNavigate } from 'react-router';

export interface DoneDecisionDialogProps {
  hideDialog: boolean;
  shouldNavigateHome?: boolean;
  hideDialogFunction: () => void;
  subText: string;
}
export default function DoneDecsionDialog(props: DoneDecisionDialogProps) {
  const modalPropsStyles = { main: { maxWidth: 450 } };
  const navigate = useNavigate();

  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Update',
    subText: props.subText ? props.subText : 'You decision has been saved. There are no more documents.',
  };

  const modalProps = React.useMemo(
    () => ({
      isBlocking: true,
      styles: modalPropsStyles,
    }),
    []
  );

  const navigateHome = () => {
    navigate('/');
  };

  return (
    <Dialog
      hidden={props.hideDialog}
      onDismiss={props.shouldNavigateHome ? navigateHome : props.hideDialogFunction}
      dialogContentProps={dialogContentProps}
      modalProps={modalProps}
    />
  );
}
