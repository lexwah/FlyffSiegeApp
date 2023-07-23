import React from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import logo from '../../assets/flyfflogo.png';
import Button from '../../components/Button/Button';

const Landing = ({ onButtonClicked }: {onButtonClicked: ()=>void}): React.ReactElement => (
  <div className="landing">

    <img src={logo} className="landing-logo" alt="Flyff logo" />
    <h2 className="landing-title">Siege Log Viewer</h2>
    <Button
      onClick={onButtonClicked}
      className="landing-btn"
    >
      Paste a log
    </Button>

    <Link to="/browse" className="landing-browse">
      Or browse uploaded logs
    </Link>
    <div className="credits credits-landing">
      <span>
        Made by&nbsp;
        <b>Ruler</b>
        &nbsp;
        @
        &nbsp;
        <b>Mushpoie</b>
      </span>
    </div>
  </div>
);

export default Landing;
