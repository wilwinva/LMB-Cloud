import { useEffect, useRef, useState } from 'react';

export default ({ options }: { options?: IntersectionObserverInit }) => {
  const [entry, updateEntry] = useState({});
  // we need to set an element for the observer to observer
  // @ts-ignore
  const [element, setElement] = useState<Element>(null);

  const observer = useRef(new IntersectionObserver(([entry]) => updateEntry(entry), options));

  useEffect(() => {
    const { current: currentObserver } = observer;
    currentObserver.disconnect();

    if (element) currentObserver.observe(element);

    return () => currentObserver.disconnect();
  }, [element]);

  return [setElement, entry];
};
