import { useEffect } from "react";
import api from "../../../../api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { userQueryOptions } from "../../../../utils/queryOptions";
import useGameStore from "../../../../store";

export function useLiquidity(): number {
  const { data: user } = useSuspenseQuery(userQueryOptions());
  const { liquidity, setLiquidity } = useGameStore();

  useEffect(() => {
    setTimeout(() => {
      // if (liquidity > 0) setLiquidity(liquidity - 1);
    }, 2500);
    if (liquidity === 0 && user.liquidityPools > 0) {
      api.updateUser({
        telegramId: user.telegramId,
        liquidity: 100,
        liquidityPools: user.liquidityPools - 1,
      });
      setLiquidity(100);
    }
  }, [liquidity]);
  return liquidity;
}
