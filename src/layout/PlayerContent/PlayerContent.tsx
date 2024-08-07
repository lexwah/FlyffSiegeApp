import React from 'react';
import { FixedSizeList } from 'react-window';
import {
  Route, Routes, useParams,
} from 'react-router-dom';
import AutoSizer from 'react-virtualized-auto-sizer';
import {
  OrderedListOutlined, PieChartOutlined, RadarChartOutlined, SearchOutlined, YoutubeOutlined
} from '@ant-design/icons';
import './style.css';
import PlayerListItem from '../../components/PlayerListItem/PlayerListItem';
import PlayerDetails from '../PlayerDetails/PlayerDetails';
import {
  Guild, Kill, Player, Vod
} from '../../LogParser/models';
import TabContainer from '../../components/Tabs/TabContainer';
import Tab from '../../components/Tabs/Tab';
import Overview from './Overview';
import VodsPage from '../VodsPage/VodsPage';
import GuildStats from '../GuildStats/GuildStats';

const PlayerContent = ({
  players,
  killFeed,
  guilds = [],
  vods = [],
  isDarkMode
}:
{
  players: Player[],
  killFeed: Kill[],
  guilds: Guild[],
  vods: Vod[],
  isDarkMode?: boolean
}): React.ReactElement => {
  const [filteredResults, setFilteredResults] = React.useState<Player[]>(players);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const { siegeId } = useParams<{ siegeId: string }>();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchTerm(value || '');
  };

  React.useEffect(() => {
    if (searchTerm.length > 0) {
      setFilteredResults(players.filter((player) => player.searchKey.includes(searchTerm.toLowerCase())));
    } else {
      setFilteredResults(players);
    }
  }, [players, searchTerm]);

  const getItem = ({ index, style }: {index: number, style: React.CSSProperties}) => {
    const finalStyle: React.CSSProperties = { ...style };
    return (
      <div style={finalStyle}>
        <PlayerListItem player={filteredResults[index]} />
      </div>
    );
  };

  const rankingContent = (
    <>
      <div className="player-content-top">
        <div className="filter-block">
          <SearchOutlined className="search-icon" />
          <input
            type="text"
            className="search-field"
            placeholder="Search for player name or Guild"
            onChange={onChange}
            value={searchTerm}
          />
        </div>
      </div>

      <div className="player-list-content">
        {/* <Scrollbars
          style={{ flexGrow: 1, width: '100%', overflow: 'hidden' }}
        > */}
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              itemCount={filteredResults.length}
              itemSize={65}
              width={width}
            >
              {getItem}
            </FixedSizeList>
          )}
        </AutoSizer>
        {/* </Scrollbars> */}
      </div>
    </>
  );

  return (

    <div className="player-content">
      <TabContainer className="player-content-nav">
        <Tab className="player-content-tab" href={`/siege/${siegeId}`}>
          <PieChartOutlined className="pc-tab-icon" />
          {' '}
          Overview
        </Tab>
        <Tab className="player-content-tab" href={`/siege/${siegeId}/ranking`}>
          <OrderedListOutlined className="pc-tab-icon" />
          {' '}
          Player Ranking
        </Tab>
        <Tab className="player-content-tab" href={`/siege/${siegeId}/guild-stats`}>
          <RadarChartOutlined className="pc-tab-icon" />
          {' '}
          Guild Statistics
        </Tab>
        {
          siegeId !== 'new' && (
            <Tab className="player-content-tab" href={`/siege/${siegeId}/vods`}>
              <YoutubeOutlined className="pc-tab-icon" />
              {' '}
              VODs
            </Tab>
          )
        }
      </TabContainer>
      <Routes>
        <Route element={rankingContent} path="ranking" />
        <Route element={<GuildStats killFeed={killFeed} players={players} guilds={guilds} />} path="guild-stats" />
        <Route
          path="guild-stats/:guildName"
          element={<GuildStats killFeed={killFeed} players={players} guilds={guilds} />}
        />
        <Route element={<VodsPage initialVods={vods} />} path="vods" />
        <Route
          path="details/:playerName"
          element={<PlayerDetails players={players} killFeed={killFeed} />}
        />
        <Route index element={<Overview killFeed={killFeed} guilds={guilds} isDarkMode={isDarkMode} />} />
      </Routes>

    </div>

  );
};

export default PlayerContent;
