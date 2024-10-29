export type User = {
  id: number;
  telegramId: string;
  username: string;
  firstName: string;
  lastName: string;
  languageCode: string;
  inviteLink: string;
  pointsBalance: number;
  liquidity: number;
  liquidityPools: number;
  liquidityPoolsUpdateDate: string;
  datesOfVisits: string[];
  lastRequestAt: number;
  rewards: string[];
}
