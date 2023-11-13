import React, { useCallback, useState } from 'react';

export default function useToggle(defaultState = false): [boolean, () => void] {
  const [isState, setIsState] = useState(defaultState);
  const handler = useCallback(() => {
    setIsState((cur) => !cur);
  }, [setIsState]);
  return [isState, handler];
}
