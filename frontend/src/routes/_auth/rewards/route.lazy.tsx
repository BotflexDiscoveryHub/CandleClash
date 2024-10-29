import { createLazyFileRoute } from "@tanstack/react-router";
import { cn } from "../../../lib/utils";
import { ProgressBar } from "../../../components/ui/progress-bar";
import IconGift from "../../../assets/IconGift";
import { useSuspenseQuery } from "@tanstack/react-query";
import { userQueryOptions } from "../../../utils/queryOptions";
import { getLevel } from "../../../utils/levels";
import { checkRewards } from './~methods';

export const Route = createLazyFileRoute("/_auth/rewards")({
  component: RewardsScreen,
});

function RewardsScreen() {
  const { data: user } = useSuspenseQuery(userQueryOptions());

  console.log(checkRewards(user))
  return (
    <div
      className={cn(
        "flex flex-col h-screen justify-around items-center overflow-x-hidden overflow-y-scroll px-4 pb-6"
      )}
    >
      <p className={cn("bg-blue-300 w-full text-center rounded-xl")}>REWARDS</p>
      <div
        className={cn(
          "flex flex-col justify-around w-full items-center"
        )}
      >
        <div
          className={cn(
            "flex flex-col justify-end bg-blue-300 w-full h-40 items-center text-center gap-1 pb-4 rounded-xl"
          )}
        >
          <IconGift />
          <p>YOUR AIRDROP</p>
          <p>Claim your tokens</p>
        </div>
      </div>
      <Achievements />
    </div>
  );
}

function Achievements() {
  const { data: user } = useSuspenseQuery(userQueryOptions());
  const level = getLevel(user.pointsBalance)!;
  return (
    <div
      className={cn(
        "flex flex-col items-center w-full mx-2 px-2 rounded bg-white"
      )}
    >
      <p className="text-center text-lg font-medium my-3">Achievements</p>
      <div className="flex flex-col w-full gap-2">
        <div className={cn("flex flex-col items-center w-full gap-1")}>
          <ProgressBar progress={(user.datesOfVisits.length / 5) * 100} />
          <p className="text-xs font-medium">Играть 5 дней подряд</p>
        </div>
        <div className={cn("flex flex-col items-center w-full gap-1")}>
          <ProgressBar progress={(level.levenNumber / 3) * 100} />
          <p className="text-xs font-medium">Дойти до 3 уровня</p>
        </div>
        <div className={cn("flex flex-col items-center w-full gap-1")}>
          <ProgressBar progress={(user.datesOfVisits.length / 30) * 100} />
          <p className="text-xs font-medium">
            Играть каждый день в течении месяца
          </p>
        </div>
        <div className={cn("flex flex-col items-center w-full gap-1")}>
          <ProgressBar progress={(level.levenNumber / 15) * 100} />
          <p className="text-xs font-medium">Дойти до 15 уровня</p>
        </div>
      </div>
    </div>
  );
}
