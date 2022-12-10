import React from 'react';
import './style.css';
import Tab from './Tab';

const TabContainer = ({ children, className }: {children: React.ReactElement<typeof Tab>[], className?: string}): React.ReactElement => (
  <nav className={`tab-container${className ? ` ${className}` : ''}`}>
    {children}
  </nav>
);

export default TabContainer;
