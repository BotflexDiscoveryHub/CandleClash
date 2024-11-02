import { useEffect, useState } from 'react';
import api from "../../../../api";
import { useSuspenseQuery } from '@tanstack/react-query';
import { userQueryOptions } from '../../../../utils/queryOptions';
import useGameStore from "../../../../store";

export function useLiquidity(): number {
  const { data: user } = useSuspenseQuery(userQueryOptions());
  const { xp, liquidity, isPaused, setLiquidity, setTotalPoints } = useGameStore();
  const [startGame, setStartGame] = useState<Date>(new Date());

  const setNewUserInfo = async () => {
    const userUpdatedInfo = await api.updateUser({
      telegramId: user.telegramId,
      liquidity: liquidity,
      pointsBalance: user.pointsBalance + xp,
      collectedItems: user.collectedItems + xp
    });
    await api.getRewards();
    await api.setSessionGame(user.telegramId, startGame);

    setLiquidity(userUpdatedInfo.liquidity)
  }

  useEffect(() => {
    if (isPaused && user.telegramId) {
      setNewUserInfo()
    } else {
      setStartGame(new Date())
    }
  }, [user.telegramId, isPaused]);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        if (liquidity > 0) {
          setLiquidity(liquidity - 1);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [liquidity, isPaused]);


  useEffect(() => {
    if (liquidity === 0 && user.liquidityPools > 0) {
      api.updateUser({
        telegramId: user.telegramId,
        liquidity: 100,
        liquidityPools: user.liquidityPools - 1,
      });
      setLiquidity(100);
    }
  }, [liquidity, isPaused]);

  useEffect(() => {
    if (user.telegramId) {
      setLiquidity(user.liquidity)
      setTotalPoints(user.pointsBalance)
    }
  }, [user]);

  return liquidity;
}
