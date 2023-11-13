import * as React from 'react';
import Instructions from '../Instructions';

function DtnInstructions(): JSX.Element {
  return (
    <Instructions
      text={
        <p>
          Type or cut & paste a DIRS Document Identifier into the box. Select a trace type. Click GO! <br />
          Only DIRS citations for documents with DTNs are searched.
        </p>
      }
    />
  );
}

export default React.memo(DtnInstructions);
