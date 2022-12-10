import React from 'react';
import { FixedSizeList } from 'react-window';
import {
  Route, Routes, useParams,
} from 'react-router-dom';
import AutoSizer from 'react-virtualized-auto-sizer';
import {
  OrderedListOutlined, PieChartOutlined, SearchOutlined
} from '@ant-design/icons';
import './style.css';
import PlayerListItem from '../../components/PlayerListItem/PlayerListItem';
import PlayerDetails from '../PlayerDetails/PlayerDetails';
import { Guild, Kill, Player } from '../../LogParser/models';
import TabContainer from '../../components/Tabs/TabContainer';
import Tab from '../../components/Tabs/Tab';
import Overview from './Overview';

const PlayerContent = ({
  players,
  killFeed,
  guilds = []
}:
{
  players: Player[],
  killFeed: Kill[],
  guilds: Guild[]
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

      </TabContainer>
      <Routes>
        <Route element={rankingContent} path="ranking" />
        <Route
          path="details/:playerName"
          element={<PlayerDetails players={players} killFeed={killFeed} />}
        />
        <Route index element={<Overview killFeed={killFeed} guilds={guilds} />} />
      </Routes>

    </div>

  );
};

export default PlayerContent;
