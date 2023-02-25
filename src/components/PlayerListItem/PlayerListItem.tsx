import React from 'react';
import './style.css';
import { Link, useParams } from 'react-router-dom';
import { CrownFilled, RightOutlined } from '@ant-design/icons';
import { Player } from '../../LogParser/models';
import { useDarkMode } from '../../ui-preferences/DarkMode';

const PlayerListItem = ({ player, style }: {
  player: Player,
  style?: React.CSSProperties
}): React.ReactElement => {
  const { siegeId } = useParams<{ siegeId: string }>();
  const dark = useDarkMode();

  return (
    <Link to={`/siege/${siegeId}/details/${player.name}`} className={`player${dark ? ' dark' : ''}`} style={style}>
      <span className="player-rank">
        {player.ranking === 1 ? <CrownFilled className="crown" /> : player.ranking }
      </span>

      <div className="player-name-block">
        <span className="player-name" title={player.name}>
          {player.name}
        </span>
        <span className="player-guild" title={player.guild}>
          {player.guild}
        </span>
      </div>

      <div className="player-pts">
        <span className="player-pts-val">{player.points}</span>
        <span className="player-pts-label">points</span>
      </div>

      <div className="player-kd">
        <span className="player-kills">{player.kills}</span>
        {' '}
        -
        {' '}
        <span className="player-deaths">{player.deaths}</span>
      </div>

      <div className="player-action">
        Details
        {' '}
        <RightOutlined className="action-arrow" />
      </div>

    </Link>
  );
};

export default PlayerListItem;
