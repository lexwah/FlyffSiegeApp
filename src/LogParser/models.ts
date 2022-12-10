export enum BonusPointType {
  DEFENDER = 'defender',
  SHUTDOWN = 'shutdown',
  RESURRECTING = 'resurrecting',
  UNKNOWN = 'unknown'
}

export interface Player {
  name: string,
  isDefender?: boolean,
  isGuildLeader?: boolean,
  guild: string,
  kills: number,
  deaths: number,
  points: number,
  searchKey?: string,
  ranking?: number
}

export interface Guild {
  name: string,
  points: number,
  resPoints: number
}

export interface PointGain {
  basic: number,
  bonus?: number,
  total?: number,
  bonusType?: BonusPointType
}

export interface Kill {
  killer: Player,
  target: Player,

  // This is optional because it won't be populated right away
  pointGain?: PointGain
}
