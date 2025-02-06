import React, { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();

  console.log("Current path:", location.pathname);

  useLayoutEffect(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

  }, [location.pathname]); 

  return null;
};

export default ScrollToTop;
