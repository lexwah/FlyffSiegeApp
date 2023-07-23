import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSiege } from '../../api';
import { calculateGuildScores, parseLog, sortPlayers } from '../../LogParser';
import {
  Guild, Kill, Player, Vod
} from '../../LogParser/models';
import PlayerContent from '../PlayerContent/PlayerContent';
import Sidebar from '../Sidebar/Sidebar';
import { alert } from '../../components/ConfirmDialog/ConfirmDialog';
import './style.css';

const SiegeView = ({
  pastedLog,
  onLogParsed,
  isDarkMode
}: {
  pastedLog?: string,
  onLogParsed: () => void,
  isDarkMode?: boolean
}): React.ReactElement => {
  const [ranking, setRanking] = React.useState<Player[]>([]);
  const [guilds, setGuilds] = React.useState<Guild[]>([]);
  const [killFeed, setKillFeed] = React.useState<Kill[]>([]);
  const [vods, setVods] = React.useState<Vod[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isShared, setIsShared] = React.useState<boolean>(false);
  const [loadedSiegeServer, setLoadedSiegeServer] = React.useState<string>(null);
  const [loadedSiegeDate, setLoadedSiegeDate] = React.useState<Date>(null);
  const { siegeId } = useParams<{ siegeId: string }>();
  const navigate = useNavigate();

  const parseCopiedLog = async () => {
    try {
      const { killFeed: kf, playerRanking, guilds: mGuilds } = parseLog(pastedLog || '');
      onLogParsed();
      setRanking(playerRanking);
      setGuilds(mGuilds);
      setKillFeed(kf);
      setIsLoading(false);
    } catch (e) {
      onLogParsed();
      await alert({ confirmation: 'Bad siege log supplied', options: { title: 'Error' } });
      navigate('/');
    }
  };

  const loadSharedSiege = async () => {
    if (siegeId) {
      try {
        const response = await getSiege(siegeId);
        setIsShared(true);
        const kf = response.data.kills;
        const players = sortPlayers(kf);
        const g = calculateGuildScores(players);
        setKillFeed(kf);
        setRanking(players);
        setGuilds(g);
        setVods(response.data.vods);
        setIsLoading(false);
        setLoadedSiegeDate(response.data.siegeDate);
        setLoadedSiegeServer(response.data.server);
      } catch (e) {
        console.log(e);
        await alert({ confirmation: 'Unable to load this Siege', options: { title: 'Error' } });
        navigate('/');
      }
    }
  };

  React.useEffect(() => {
    if (siegeId === 'new' && !pastedLog) {
      navigate('/');
    }

    if (pastedLog) {
      parseCopiedLog();
    } else if (siegeId && siegeId !== 'new') {
      loadSharedSiege();
    }
  }, []);

  // Figure player rankings
  const players = ranking.map((player, index) => {
    const searchKey = `${player.name.toLowerCase()} ${player.guild.toLowerCase()}`;
    return { ...player, ranking: index + 1, searchKey };
  });

  return isLoading ? (
    <div className="siege-view-loading">
      <div className="dot-typing" />
    </div>
  ) : (
    <div className="siege-view">
      <Sidebar
        server={loadedSiegeServer}
        date={loadedSiegeDate}
        isShared={isShared}
        isLoading={isLoading}
        killFeed={killFeed}
        guilds={guilds}
      />
      <PlayerContent
        isDarkMode={isDarkMode}
        guilds={guilds}
        players={players}
        killFeed={killFeed}
        vods={vods}
      />
    </div>
  );
};

export default SiegeView;
