import React from 'react';
import disclaimer from '../public/image/png/disclaimer.png';

export function Disclaimer() {
  return (
    <img
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
      src={disclaimer}
    />
  );
}
