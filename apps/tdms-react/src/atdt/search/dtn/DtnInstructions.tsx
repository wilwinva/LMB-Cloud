import * as React from 'react';
import Instructions from '../Instructions';

function DtnInstructions() {
  return (
    <Instructions
      text={
        <p>
          Type or cut & paste a DTN into the box. Select a trace type. Click GO! <br />
          If you do not have a DTN, use the Search function. the DTN search screen provides a list to pick from.
        </p>
      }
    />
  );
}

export default React.memo(DtnInstructions);
