import React, { useState, useEffect } from 'react';
import './style.css';
import { GiftOutlined } from '@ant-design/icons';
import { Tooltip } from 'react-tooltip';
import { alert } from '../../components/ConfirmDialog/ConfirmDialog';
import changelog from '../../../changelog.json';

interface ChangelogItem {
  version: string,
  items: string[]
}

const WhatsNewButton = (): React.ReactElement => {
  const [hasNotification, setHasNotification] = useState(false);

  const onClick = async () => {
    await alert({
      options: { title: "What's new", confirmText: 'OK' },
      confirmation: (
        <div className="wn-list">
          {
            (changelog as ChangelogItem[]).map((item) => (
              <div key={item.version}>
                <h2 className="wn-title">
                  {`${item.version}`}
                </h2>
                <ul className="wn-list">
                  {
                    item.items.map((line) => <li key={line}>{line}</li>)
                  }
                </ul>
              </div>
            ))
          }
        </div>
      )
    });
    setHasNotification(false);
    localStorage.setItem('lastSeenVersion', process.env.VERSION);
  };

  useEffect(() => {
    const currentVersion = process.env.VERSION;
    const hasSeenVersion = localStorage.getItem('lastSeenVersion') === currentVersion;
    setHasNotification(!hasSeenVersion);
  }, []);

  return (
    <div
      id="whats-new-button"
      role="button"
      tabIndex={0}
      onKeyUp={(e) => { if (e.key === 'Enter') onClick(); }}
      className="whats-new-button"
      onClick={onClick}
      data-tooltip-content={'What\'s new'}
    >
      {hasNotification && <div className="wn-blip" />}
      <Tooltip className="wn-tooltip" place="top" anchorId="whats-new-button" />
      <GiftOutlined />
    </div>
  );
};

export default WhatsNewButton;
