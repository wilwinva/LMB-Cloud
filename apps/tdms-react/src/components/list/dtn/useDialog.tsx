import { useCallback, useState } from 'react';
import { IDialogContentProps } from 'office-ui-fabric-react';

export interface DialogData extends Pick<IDialogContentProps, 'title' | 'subText'> {}

export function useDialog<T>(toDialogData: (data: T) => DialogData) {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [dialogData, setDialogData] = useState<DialogData>();

  const showDialog = useCallback(() => setIsDialogVisible(true), [setIsDialogVisible]);
  const hideDialog = useCallback(() => setIsDialogVisible(false), [setIsDialogVisible]);
  const showWithData = useCallback(
    (data: T) => {
      setDialogData(toDialogData(data));
      showDialog();
    },
    [showDialog, setDialogData]
  );

  return {
    isDialogVisible,
    dialogData,
    showWithData,
    showDialog,
    hideDialog,
  };
}

export interface ParameterData {
  name: string;
  definition: string;
}

export const useParameterDialog = () =>
  useDialog((parameter: ParameterData) => {
    return {
      title: parameter.name ?? '',
      subText: parameter.definition ?? '',
    };
  });
