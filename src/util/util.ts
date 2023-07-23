export enum FlyffServer {
  UNSPECIFIED = 'unspecified',
  MUSHPOIE = 'mushpoie',
  FLARINE = 'flarine',
  ARIES = 'aries',
  BURUDENG = 'burudeng',
  GENESE = 'genese',
  TOTEMIA = 'totemia',
  GLAPHAN = 'glaphan',
  LAWOLF = 'lawolf',
  MIA = 'mia',
  JAPAN = 'リシス',
  TAIWAN = '獨眼蝙蝠',
  FWC = 'fwc'
}

// consolidate these two into a capitalize() function?
export const labelForServer = (server: string): string => `${server.charAt(0).toLocaleUpperCase()}${server.slice(1)}`;
export const labelForKillBonus = (bonus: string): string => `${bonus.charAt(0).toLocaleUpperCase()}${bonus.slice(1)}`;

export interface Siege {
  siegeId: string,
  dateSubmitted: Date,
  siegeDate: Date,
  server: FlyffServer,
  mvp: string,
  winner: string,
  vodCount?: number
}

/**
 * The siege log timestamps come from the uploader's local time
 * This function strips the hours from the timestamp, and adjusts for the the in-game time difference,
 * to give a clearer picture of when in the siege kills took place (better correlates with POV videos) *
 */
export const formatTimestamp = (timestamp: string): string => {
  const mins = timestamp.split(':')[1];
  let firstMinDigit = Number(mins.charAt(0));
  const secondMinDigit = Number(mins.charAt(1));
  if (firstMinDigit > 0) {
    firstMinDigit -= 2;
  } else if (firstMinDigit === 0) {
    firstMinDigit = 4;
  }

  /**
   * Due to server sync, there's actually about a 9-10 second difference between what is recorded in the logs,
   * and what is displayed in-game. This is a hacky way to account for that.
   */
  let seconds = Number(timestamp.split(':')[2]) - 9;
  if (seconds < 0) seconds = 0;
  return `${firstMinDigit}${secondMinDigit}:${seconds < 10 ? `0${seconds}` : `${seconds}`}`;
};
