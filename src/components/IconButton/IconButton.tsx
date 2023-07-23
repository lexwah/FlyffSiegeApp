import React from 'react';
import './style.css';

const IconButton = ({ children, onClick, className }: {
  children: React.ReactNode,
  onClick: ()=>void,
  className?: string
}): React.ReactElement => (
  <div
    role="button"
    onClick={onClick}
    tabIndex={0}
    onKeyUp={(e) => {
      if (e.key === 'Enter') {
        onClick();
      }
    }}
    className={`icon-btn${className ? ` ${className}` : ''}`}
  >
    {children}
  </div>
);

export default IconButton;
