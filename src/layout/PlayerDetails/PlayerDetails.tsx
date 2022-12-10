import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import { Kill, Player } from '../../LogParser/models';
import './style.css';
import KillFeedItem from '../../components/KillFeedItem/KillFeedItem';
import IconButton from '../../components/IconButton/IconButton';

enum FilterType {
  KILLS = 'kills',
  DEATHS = 'deaths',
  BOTH = 'both'
}

const PlayerDetails = ({ players, killFeed }: {players: Player[], killFeed: Kill[]}): React.ReactElement => {
  const { playerName } = useParams<{playerName: string}>();
  const [combatFilterType, setCombatFilterType] = React.useState<FilterType>(FilterType.BOTH);
  const navigate = useNavigate();
  const { siegeId } = useParams<{siegeId: string}>();

  const player = players.find((player) => player.name === playerName);
  const playerKillFeed = player !== undefined ? killFeed.filter((kill) => (kill.killer.name === player.name || kill.target.name === player.name)) : [];

  const kills = playerKillFeed.filter((kill) => kill.killer.name === player?.name);
  const deaths = playerKillFeed.filter((kill) => kill.target.name === player?.name);

  let killElements = [];

  if (combatFilterType === FilterType.KILLS) {
    killElements = kills.map((kill, index) => (
      <KillFeedItem
        key={`kill-${index}`}
        killer={kill.killer}
        target={kill.target}
        pointGain={kill.pointGain}
        isDeath={false}
      />
    ));
  } else if (combatFilterType === FilterType.DEATHS) {
    killElements = deaths.map((kill, index) => (
      <KillFeedItem
        key={`kill-${index}`}
        killer={kill.killer}
        target={kill.target}
        pointGain={kill.pointGain}
        isDeath
      />
    ));
  } else {
    killElements = playerKillFeed.map((kill, index) => {
      const isDeath = kill.target.name === player?.name;
      return (
        <KillFeedItem
          key={`kill-${index}`}
          killer={kill.killer}
          target={kill.target}
          pointGain={kill.pointGain}
          isDeath={isDeath}
        />
      );
    });
  }

  const exit = () => {
    if (siegeId && siegeId !== 'new') {
      navigate(`/siege/${siegeId}/ranking`);
    } else {
      navigate(-1);
    }
  };

  const onFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const val = event.target.value;
    setCombatFilterType(val as FilterType);
  };

  return player !== undefined ? (
    <div className="player-detail animated fadeInRight">
      <div className="player-details-top">
        <IconButton className="pd-back" onClick={exit}>
          <LeftOutlined className="pd-back-icon" />
        </IconButton>
        <h2 className="pd-top-name">{player?.name}</h2>
      </div>
      <div className="pd-kf-top">
        <h3 className="kf-title">Combat log</h3>
        <select className="kf-filter-select" onChange={onFilterChange} value={combatFilterType}>
          <option value={FilterType.BOTH}>Kills + Deaths</option>
          <option value={FilterType.KILLS}>Kills</option>
          <option value={FilterType.DEATHS}>Deaths</option>
        </select>
      </div>
      <div className="kf-block">
        {killElements}
      </div>
    </div>
  ) : <div>Player not found</div>;
};

export default PlayerDetails;
