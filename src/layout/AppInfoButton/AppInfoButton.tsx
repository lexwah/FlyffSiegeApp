import React, { useState, useEffect } from 'react';
import './style.css';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'react-tooltip';
import { alert } from '../../components/ConfirmDialog/ConfirmDialog';

const AppInfoButton = (): React.ReactElement => {
  const onClick = async () => {
    await alert({
      options: { title: 'About/FAQs' },
      confirmation: (
        <div className="ai-container">
          <div>
            <h2 className="ai-title">
              What is this?
            </h2>
            <span>
              A web app to upload, view and analyze Guild Siege logs from Flyff Universe. I initially made it
              for internal use in my guild when the &ldquo;copy log&rdquo; button was finally added to the game, but decided to make it public,
              after some feedback that it was pretty neat.
            </span>
          </div>

          <div>
            <h2 className="ai-title">
              Who are you?
            </h2>
            <span>
              <b>Ruler</b>
              {' '}
              from the
              {' '}
              <b>Mushpoie</b>
              {' '}
              server.
            </span>
          </div>

          <div>
            <h2 className="ai-title">
              Can I donate?
            </h2>
            <span>
              no need
            </span>
          </div>

          <div>
            <h2 className="ai-title">
              Will you mobile optimize the site?
            </h2>
            <span>
              probably
            </span>
          </div>
        </div>
      )
    });
  };

  return (
    <div
      id="app-info-button"
      role="button"
      tabIndex={0}
      onKeyUp={(e) => { if (e.key === 'Enter') onClick(); }}
      className="app-info-button"
      onClick={onClick}
      data-tooltip-content="About"
    >
      <Tooltip className="ai-tooltip" place="top" anchorId="app-info-button" />
      <InfoCircleOutlined />
    </div>
  );
};

export default AppInfoButton;
