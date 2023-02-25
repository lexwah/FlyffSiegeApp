import { useState, useEffect } from 'react';

const useDarkMode = () => {
  const [isEnabled, setIsEnabled] = useState(true);

  return isEnabled;
};

const toggleDarkMode = () => {
  // stub, todo
};

export {
  useDarkMode,
  toggleDarkMode
};
