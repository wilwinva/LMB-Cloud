import React, { FormEvent, useEffect, useState } from 'react';

interface MemoInputProps {
  memo: string;
  debounced: any;
}

export default function MemoInput(props: MemoInputProps) {
  const [memoInput, setMemoInput] = useState<string>();

  useEffect(() => {
    setMemoInput(props.memo);
  }, [props.memo]);

  return (
    <textarea
      className={'memo'}
      defaultValue={memoInput}
      onChange={(e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        props.debounced.callback((e.target as HTMLTextAreaElement).value)
      }
    />
  );
}
