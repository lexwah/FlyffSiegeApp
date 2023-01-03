import {
  BonusPointType, Kill, Player, PointGain, Guild,
} from './models';

const BASIC_POINT = 2;
const TOTAL_PLAYER_LIVES = 10;
const RES_POINT_CAP = 100;

const parsePlayer = (playerString: string): Player => {
  // The "grade" section is irrelevant (we'll get the point breakdown later), so remove it
  const cleaned = playerString.replace(/\([^()]*\)/g, '');

  const guildName = cleaned.substring(cleaned.indexOf('[') + 1, cleaned.indexOf(']'));
  const playerName = cleaned.substring(cleaned.lastIndexOf(' ') + 1, cleaned.length);

  const isDefender = cleaned.includes('Defender');
  const isGuildLeader = cleaned.includes('Guild Master');

  const player: Player = {
    name: playerName.trim(),
    guild: guildName,
    isDefender,
    isGuildLeader,
    kills: 0,
    deaths: 0,
    points: 0,
  };

  return player;
};

const parseKill = (line: string): Kill => {
  const delimiter = ' → Attack ';
  const split = line.split(delimiter);
  const killerString = split[0];
  const targetString = split[1];
  const killerEntity = parsePlayer(killerString);
  const targetEntity = parsePlayer(targetString);

  // Not populating the point gain yet - we'll do that after
  const kill = {
    killer: killerEntity,
    target: targetEntity,
  };
  return kill;
};

const parsePointGain = (line: string): PointGain => {
  const pointGain: PointGain = {
    basic: BASIC_POINT,
  };

  if (line.includes('Bonus')) {
    const stringWithoutBasicSection = line.replace(/[><]/g, '').trim();
    const breakdownSections = stringWithoutBasicSection.split(', ');

    // If more than just a basic point
    let totalBonus = 0;
    const reasons:BonusPointType[] = [];
    if (breakdownSections.length > 1) {
      breakdownSections.shift();
      breakdownSections.forEach((section) => {
        const bothSidesOfBonusString = section.split('Bonus +');
        const bonusAmount = Number(bothSidesOfBonusString[1]);
        const bonusReasonString = bothSidesOfBonusString[0];
        let bonusType: BonusPointType;

        // Figure out the reason for the bonus
        if (bonusReasonString.includes('Killing streak')) {
          bonusType = BonusPointType.SHUTDOWN;
        } else if (bonusReasonString.includes('Defender')) {
          bonusType = BonusPointType.DEFENDER;
        } else if (bonusReasonString.includes('Resurrecting')) {
          bonusType = BonusPointType.RESURRECTING;
        } else {
          bonusType = BonusPointType.UNKNOWN;
        }

        totalBonus += bonusAmount;
        reasons.push(bonusType);
      });
    }

    pointGain.bonus = totalBonus;
    pointGain.bonusTypes = reasons;
  }

  pointGain.total = pointGain.basic + (pointGain.bonus || 0);
  return pointGain;
};

// Given a kill feed, build a list of players and tally up their stats
const sortPlayers = (allKills: Kill[]): Player[] => {
  const players: Player[] = [];

  allKills.forEach((kill) => {
    const { killer, target, pointGain } = kill;
    const existingKillerEntity = players.find((player) => player.name === killer.name);
    const existingTargetEntity = players.find((player) => player.name === target.name);
    if (existingKillerEntity !== undefined) {
      existingKillerEntity.kills += 1;
      existingKillerEntity.points += (pointGain?.total || 0);
    } else {
      players.push({ ...killer, kills: 1, points: pointGain?.total || 0 });
    }

    if (existingTargetEntity !== undefined) {
      existingTargetEntity.deaths += 1;
    } else {
      players.push({ ...target, deaths: 1 });
    }
  });

  return players.sort((a, b) => {
    // descending order
    if (a.points > b.points) return -1;
    if (a.points < b.points) return 1;
    return 0;
  });
};

interface ParseResult {
  killFeed: Kill[],
  playerRanking: Player[],
  guilds: Guild[]
}

/**
 * Calculate the approximate number of resurrection points for a particular guild. *
 * Does not account for disconnects/leaving the siege arena
 *
 * @param players Array of players belonging to a particular guild
 */
const calculateResPoints = (players: Player[]) => {
  let remainingLives = 0;
  players.forEach((player) => {
    const playerLivesRemaining = TOTAL_PLAYER_LIVES - player.deaths;
    remainingLives += playerLivesRemaining;
  });

  if (remainingLives > RES_POINT_CAP) {
    remainingLives = RES_POINT_CAP;
  }

  return remainingLives;
};

const calculateGuildScores = (players: Player[]) => {
  let guilds: Guild[] = [];

  // populate the guild list
  players.forEach((player) => {
    const existing = guilds.find((guild) => guild.name === player.guild);
    if (existing) {
      existing.points += player.points;
    } else {
      guilds.push({
        name: player.guild,
        points: player.points,
        resPoints: 0,
      });
    }
  });

  // Now approximate their res points
  guilds = guilds.map((guild) => {
    const resPoints = calculateResPoints(players.filter((player) => player.guild === guild.name));
    return {
      ...guild,
      resPoints,
    };
  });

  const sorted = guilds.sort((a, b) => {
    const aPoints = a.points + a.resPoints;
    const bPoints = b.points + b.resPoints;
    if (aPoints > bPoints) return -1;
    if (aPoints < bPoints) return 1;
    return 0;
  });

  return sorted;
};

const parseLog = (content: string): ParseResult => {
  const allArray = content.split(/\r?\n/);

  const allKills: Kill[] = [];
  const allPointGaints: PointGain[] = [];

  allArray.forEach((line) => {
    if (line.length !== 0 && !line.includes('Basic Point')) {
      allKills.push(parseKill(line));
    } else if (line.length !== 0 && line.includes('Basic Point')) {
      allPointGaints.push(parsePointGain(line));
    }
  });

  /**
   * Now, loop through the kills to finding the corresponding point gain.
   * We're assuming that every kill log is followed by a proceeding line with the point breakdown,
   * thus an index in allKills should have a corresponding index in allPointGaints.
   */
  for (let index = 0; index < allKills.length; index += 1) {
    const kill = allKills[index];

    const correspondingPointGain = allPointGaints[index];

    // Now we can mutate the current kill object
    kill.pointGain = correspondingPointGain;
  }

  const ranking = sortPlayers(allKills);

  const guilds = calculateGuildScores(ranking);

  return {
    killFeed: allKills,
    playerRanking: ranking,
    guilds,
  };
};

// eslint-disable-next-line import/prefer-default-export
export { parseLog, calculateGuildScores, sortPlayers };
