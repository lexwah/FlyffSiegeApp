import React from 'react';
import './style.css';

const ButtonRow = ({ children, className }: {children: React.ReactNode, className?: string }): React.ReactElement => (
  <div className={`button-row${className ? ` ${className}` : ''}`}>
    {children}
  </div>
);

export default ButtonRow;
