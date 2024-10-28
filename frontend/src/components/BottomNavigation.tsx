import api from "../api";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { Link } from "@tanstack/react-router";
import useGameStore from "../store";

type NavigationVariants = "game" | "state" | "rewards" | "pause" | "exit";

interface NavigationItem {
  text: string;
  url?: string;
  onClick?: () => void;
}

const navigationItemsMap: Record<NavigationVariants, NavigationItem> = {
  game: {
    text: "Trading (Game)",
    url: "/game",
  },
  state: {
    text: "State",
    url: "/state",
  },
  rewards: {
    text: "Rewards",
    url: "/rewards",
  },
  pause: {
    text: "Pause",
    url: "",
    onClick: async () => {
      const isPaused = useGameStore.getState().isPaused;
      useGameStore.getState().setIsPaused(!isPaused);
    },
  },
  exit: {
    text: "Exit",
    url: "/",
    onClick: async () => {
      const newTotalPoints =
        useGameStore.getState().totalPoints + useGameStore.getState().xp;
      await api.updateUser({
        pointsBalance: newTotalPoints,
        liquidity: useGameStore.getState().liquidity,
      });
      useGameStore.getState().setIsPaused(false);
      useGameStore.getState().setXp(0);
      useGameStore.getState().setTotalPoints(newTotalPoints);
    },
  },
};

interface BottomNavigationItemProps {
  variant: NavigationVariants;
  active?: boolean;
}

function BottomNavigationItem({ variant, active }: BottomNavigationItemProps) {
  const { text, url, onClick } = navigationItemsMap[variant];
  return (
    <Link to={url} onClick={onClick}>
      <Button
        variant="navbar"
        className={cn(active ? "bg-blue-300 text-black" : "bg-blue-500")}
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-medium">{text}</p>
        </div>
      </Button>
    </Link>
  );
}

interface BottomNavigationProps {
  currentUrl: string;
}
function BottomNavigation({ currentUrl }: BottomNavigationProps) {
  const isTheGameStarted = currentUrl.includes("game");
  return (
    <footer
      id="navbar"
      className={cn(
        "fixed bottom-0 w-full z-[100]",
        "flex flex-row items-center justify-between",
        "pointer-events-auto"
      )}
    >
      <BottomNavigationItem variant="game" active={isTheGameStarted} />
      <BottomNavigationItem
        variant={isTheGameStarted ? "pause" : "state"}
        active={currentUrl.includes("state")}
      />
      <BottomNavigationItem
        variant={isTheGameStarted ? "exit" : "rewards"}
        active={currentUrl.includes("rewards")}
      />
    </footer>
  );
}

export default BottomNavigation;
