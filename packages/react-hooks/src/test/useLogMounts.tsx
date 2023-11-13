import { useEffect } from 'react';

export function useLogMounts(name: string = 'Unknown', logRender: boolean = true) {
  console.log(`${name}: rendering`);
  useEffect(() => {
    console.log(`${name}: mounting`);
    return () => {
      console.log(`${name} unmounting`);
    };
  }, []);
}
