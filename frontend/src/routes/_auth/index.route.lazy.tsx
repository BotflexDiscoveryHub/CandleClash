import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { Button } from "../../components/ui/button";
import { BotImage } from "../../components/BotImage";

export const Route = createLazyFileRoute("/_auth/")({
  component: HomeScreen,
});

function HomeScreen() {
  return (
    <div className="flex flex-col justify-evenly items-center mx-4 h-screen">
      <BotImage />
      <Link className="w-full" to="/game">
        <Button variant="start">PLAY</Button>
      </Link>
    </div>
  );
}
