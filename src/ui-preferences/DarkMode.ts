import { useState, useEffect } from 'react';

const useDarkMode = () => {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    setIsEnabled(!!window.dm);
  }, []);

  return isEnabled;
};

const toggleDarkMode = () => {

};

export {
  useDarkMode,
  toggleDarkMode
};
