import React, { useEffect, useRef } from 'react';

const AutoScrollComponent = ({ children }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      const element = scrollRef.current;
      element.scrollTop = element.scrollHeight;
    }
  });

  return (
    <div ref={scrollRef} style={{ maxHeight: '300px', overflowY: 'auto' }}>
      {children}
    </div>
  );
};

export default AutoScrollComponent;
