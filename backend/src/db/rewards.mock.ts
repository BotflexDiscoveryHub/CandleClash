import { RewardsEntity } from './rewards.entity';

const hour = 60;
const day = 1440;

export const rewards: RewardsEntity[] = [
  {
    id: 1,
    rewardId: 'play_1_hour',
    title: 'Play for 1 hour without stopping',
    type: 'TIME',
    condition: 3600,
    lootboxPoints: 50,
  },
  {
    id: 2,
    rewardId: 'collect_200_points',
    title: 'Accumulate 200 points in the game',
    type: 'POINTS',
    condition: 200,
    boost: {
      type: 'points',
      multiplier: 2,
      duration: hour * 3,
      isPercentage: false,
    },
  },
  {
    id: 3,
    rewardId: 'login_3_days',
    title: 'Log in to the game every day for 3 consecutive days',
    type: 'ACTIVITY',
    condition: 3,
    liquidityPools: 3,
  },
  {
    id: 4,
    rewardId: 'collect_700_points_5_days',
    title: 'Accumulate 700 points within the first 5 days of playing',
    type: 'CHALLENGE',
    condition: 700,
    lootboxPoints: 75,
  },
  {
    id: 5,
    rewardId: 'catch_100_green_candles',
    title: 'Catch 100 green candles',
    type: 'ITEMS',
    condition: 100,
    liquidityPools: 3,
  },
  {
    id: 6,
    rewardId: 'level_up_3_days',
    title: 'Level up every day for 3 consecutive days',
    type: 'CHALLENGE',
    condition: 3,
    lootboxPoints: 100,
  },
  {
    id: 7,
    rewardId: 'login_7_days',
    title: 'Log in to the game every day for 7 consecutive days',
    type: 'ACTIVITY',
    condition: 7,
    boost: {
      type: 'points',
      multiplier: 1.2,
      duration: day * 2,
      isPercentage: true,
    },
  },
  {
    id: 8,
    rewardId: 'collect_1000_points',
    title: 'Accumulate 1000 points',
    type: 'POINTS',
    condition: 1000,
    lootboxPoints: 150,
  },
  {
    id: 9,
    rewardId: 'catch_200_green_candles',
    title: 'Catch 200 green candles',
    type: 'ITEMS',
    condition: 200,
    liquidityPools: 3,
  },
  {
    id: 10,
    rewardId: 'level_5_in_10_days',
    title: 'Reach level 5 within 10 days',
    type: 'CHALLENGE',
    condition: 5,
    boost: {
      type: 'points',
      multiplier: 2,
      duration: hour * 5,
      isPercentage: false,
    },
  },
  {
    id: 11,
    rewardId: 'login_14_days',
    title: 'Log in to the game every day for 14 consecutive days',
    type: 'ACTIVITY',
    condition: 14,
    liquidityPools: 5,
  },
  {
    id: 12,
    rewardId: 'collect_2000_points',
    title: 'Accumulate 2000 points',
    type: 'POINTS',
    condition: 2000,
    lootboxPoints: 200,
  },
  {
    id: 13,
    rewardId: 'catch_500_green_candles',
    title: 'Catch 500 green candles',
    type: 'ITEMS',
    condition: 500,
    lootboxPoints: 250,
  },
  {
    id: 14,
    rewardId: 'reach_level_8',
    title: 'Reach level 8',
    type: 'LEVEL',
    condition: 8,
    liquidityPools: 5,
  },
  {
    id: 15,
    rewardId: 'login_21_days',
    title: 'Log in to the game every day for 21 consecutive days',
    type: 'ACTIVITY',
    condition: 21,
    boost: {
      type: 'points',
      multiplier: 1.3,
      duration: day * 5,
      isPercentage: true,
    },
  },
  {
    id: 16,
    rewardId: 'collect_3000_points',
    title: 'Accumulate 3000 points',
    type: 'POINTS',
    condition: 3000,
    lootboxPoints: 300,
  },
  {
    id: 17,
    rewardId: 'catch_1000_green_candles',
    title: 'Catch 1000 green candles',
    type: 'ITEMS',
    condition: 1000,
    liquidityPools: 10,
  },
  {
    id: 18,
    rewardId: 'level_10_in_30_days',
    title: 'Reach level 10 within 30 days',
    type: 'CHALLENGE',
    condition: 10,
    boost: {
      type: 'points',
      multiplier: 2,
      duration: hour * 10,
      isPercentage: true,
    },
  },
  {
    id: 19,
    rewardId: 'collect_5000_points',
    title: 'Accumulate 5000 points',
    type: 'POINTS',
    condition: 5000,
    lootboxPoints: 500,
  },
  {
    id: 20,
    rewardId: 'login_30_days',
    title: 'Log in to the game every day for 30 consecutive days',
    type: 'ACTIVITY',
    condition: 30,
    boost: {
      type: 'points',
      multiplier: 1.6,
      duration: day * 5,
      isPercentage: true,
    },
  },
  {
    id: 21,
    rewardId: 'catch_2000_green_candles',
    title: 'Catch 2000 green candles',
    type: 'ITEMS',
    condition: 2000,
    liquidityPools: 10,
  },
  {
    id: 22,
    rewardId: 'reach_level_20',
    title: 'Reach level 20',
    type: 'LEVEL',
    condition: 20,
    // boost: 'Эксклюзивный лутбокс с неограниченной ликвидностью на 3 дня', //пока хз как сделать
  },
];
