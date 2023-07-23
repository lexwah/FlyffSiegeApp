import React from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import logo from '../../assets/flyfflogo.png';

const Sidebar = ({ children }: {children: React.ReactNode}): React.ReactElement => (
  <div className="sidebar">
    <div className="sidebar-top">
      <Link to="/" className="sidebar-home">
        <img src={logo} className="logo-top" alt="Flyff logo" />
      </Link>
    </div>
    {children}
    {/* <div className="credits">
      <span>
        Made by&nbsp;
        <b>Ruler</b>
        &nbsp;
        @
        &nbsp;
        <b>Mushpoie</b>
      </span>
    </div> */}
  </div>
);

export default Sidebar;
