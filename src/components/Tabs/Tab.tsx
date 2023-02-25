/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDarkMode } from '../../ui-preferences/DarkMode';
import './style.css';

const Tab = ({
  children,
  className,
  onClick,
  href
}: {
  children: React.ReactNode,
  className?: string,
  onClick?: () => void,
  href: string
}): React.ReactElement => {
  const location = useLocation();
  const isDarkMode = useDarkMode();

  const isSelected = location.pathname === href;

  return href ? (
    (
      <Link to={href} className={`tab${isDarkMode ? ' dark' : ''}${isSelected ? ' selected' : ''}${className ? ` ${className}` : ''}`}>
        {children}
      </Link>
    )
  ) : (
    (
      <div onClick={onClick} className={`tab${isDarkMode ? ' dark' : ''}${isSelected ? ' selected' : ''}${className ? ` ${className}` : ''}`}>
        {children}
      </div>
    )
  );
};

export default Tab;
