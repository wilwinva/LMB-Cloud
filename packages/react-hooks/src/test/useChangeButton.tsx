import { PrimaryButton } from 'office-ui-fabric-react';
import React, { MouseEventHandler, useState } from 'react';

interface ChangeButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export function UseChangeButton(props: ChangeButtonProps) {
  return <PrimaryButton {...props} />;
}

export function useChangeButton() {
  const [change, changeme] = useState(0);
  return {
    changeButton: <UseChangeButton onClick={() => changeme(change + 1)} />,
  };
}
