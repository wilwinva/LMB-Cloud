import React, { useState } from 'react';

import useDebouncedCallback from 'use-debounce/lib/useDebouncedCallback';

function MemoTextField({ defaultValue, textFieldStyles }: any) {
  const [value, setValue] = useState<string>(defaultValue);

  const debounced = useDebouncedCallback((value) => {
    setValue(value);
  }, 1000);

  return (
    <div>
      <textarea
        className={textFieldStyles}
        defaultValue={defaultValue}
        onChange={(e) => debounced.callback(e.target.value)}
      />
    </div>
  );
}

export default MemoTextField;
