import { createLazyFileRoute } from "@tanstack/react-router";
import { ProgressBar } from "../../../components/ProgressBar/ProgressBar.tsx";
import { userQueryOptions } from "../../../utils/queryOptions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { cn } from "../../../lib/utils";
import { getLevel } from "../../../utils/levels";
import useGameStore from "../../../store";

export const Route = createLazyFileRoute("/_auth/state")({
  component: () => <StateScreen />,
});

function StateScreen() {
  const { data: user } = useSuspenseQuery(userQueryOptions());
  const totalPoints = useGameStore.getState().totalPoints;
  const handleClick = () => {
    window.location.href = `https://t.me/share/url?url=${user.inviteLink}`;
  };
  const level = getLevel(totalPoints)!;
  return (
    <div
      className={cn(
        "flex flex-col h-screen justify-between items-center gap-2 px-3 pb-16"
      )}
    >
      <div className={cn("flex justify-between items-center w-full")}>
        <div>{`${user.firstName} ${user.lastName ?? ""}`}</div>
        <div className="flex items-center gap-5">
          <div>Current bot</div>
          <div>{level?.levenNumber} lvl</div>
        </div>
      </div>
      <div>{totalPoints} points</div>
      <div className="flex w-full items-center justify-center relative">
        <ProgressBar
          progress={
            ((totalPoints - level.points) /
              (level.nextLevelPoints - level.points)) *
            100
          }
        />
        <p className="absolute text-sm text-white">
          XP {totalPoints - level.points}/{level.nextLevelPoints - level.points}
        </p>
      </div>
      {/*<BotImage />*/}
      <div className="flex w-full items-center justify-center mt-3 relative">
        <ProgressBar progress={user.liquidity} />
        <p className="absolute text-sm text-white">Daily energy (Liquidity)</p>
      </div>
      <div>Liquidity pools aviable: {user.liquidityPools}</div>
      <button className="bg-white rounded-xl p-2" onClick={handleClick}>
        Request Liquidity Pool
      </button>
    </div>
  );
}
