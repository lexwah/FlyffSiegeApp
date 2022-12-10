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
  JAPAN = 'リシス'
}

export const labelForServer = (server: string): string => `${server.charAt(0).toLocaleUpperCase()}${server.slice(1)}`;

export interface Siege {
  siegeId: string,
  dateSubmitted: Date,
  siegeDate: Date,
  server: FlyffServer,
  mvp: string,
  winner: string
}
