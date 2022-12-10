import React from 'react';
import './style.css';

const Button = ({
  children,
  className,
  style,
  disabled,
  onClick,
}: {
  children: React.ReactNode,
  className?: string,
  style?: React.CSSProperties,
  disabled?: boolean,
  onClick: ()=>void
}): React.ReactElement => {
  const internalOnClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const classes: string[] = ['lx-button'];
  if (disabled) classes.push('disabled');
  if (className) classes.push(className);

  const finalClassName = classes.join(' ');
  return (
    <div
      tabIndex={0}
      className={finalClassName}
      role="button"
      onClick={internalOnClick}
      onKeyUp={(e) => {
        if (e.key === 'Enter') {
          internalOnClick();
        }
      }}
    >
      {children}
    </div>
  );
};

export default Button;
