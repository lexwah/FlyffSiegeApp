import React from 'react';
import { StarFilled } from '@ant-design/icons';
import { Guild } from '../../LogParser/models';
import './style.css';

const GuildListItem = ({ guild, ranking, onClick }: {guild: Guild, ranking: number, onClick?: ()=>void}): React.ReactElement => {
  let rankingElem: number | React.ReactElement = ranking;

  if (ranking === 1) rankingElem = <StarFilled className="medal first" />;
  if (ranking === 2) rankingElem = <StarFilled className="medal second" />;
  if (ranking === 3) rankingElem = <StarFilled className="medal third" />;

  return (
    <div className="guild">
      <span className="guild-ranking">{rankingElem}</span>
      <span className="guild-name">{guild.name}</span>
      <span className="guild-pts">
        {guild.points + guild.resPoints}
      </span>
    </div>
  );
};
export default GuildListItem;
