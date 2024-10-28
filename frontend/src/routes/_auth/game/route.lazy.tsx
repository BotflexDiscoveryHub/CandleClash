import React, { useCallback, useEffect, useState } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ProgressBar } from "../../../components/ui/progress-bar";
import { FallingObject } from "./~types/fallingObject";
import { useSuspenseQuery } from "@tanstack/react-query";
import { userQueryOptions } from "../../../utils/queryOptions";
import { useLiquidity } from "./~hooks/useLiquidity";
import { useNavigate } from "@tanstack/react-router";
import * as PIXI from "pixi.js";
import { Sprite, Container, Stage } from "@pixi/react";
import api from "../../../api";
import { getLevel } from "../../../utils/levels";
import useGameStore from "../../../store";
import { debounce } from '../../../utils/debounce.ts';

export const Route = createLazyFileRoute("/_auth/game")({
  component: () => <GameScreen />,
});

function GameScreen() {
  const { data: user } = useSuspenseQuery(userQueryOptions());
  const {
    liquidity,
    xp,
    setXp,
    isPaused,
    setIsPaused,
    playerPosition,
    setPlayerPosition,
  } = useGameStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fallingObjects, setFallingObjects] = useState<FallingObject[]>([]);
  useLiquidity();

  const handleTouchMove = useCallback(
    debounce((e) => {
      if (isPaused) return;
      setPlayerPosition({
        x: Number(e.touches[0].clientX),
      });
    }, 50),
    []
  );

  useEffect(() => {
    const addFallingObject = () => {
      if (isPaused) return;
      const randomColor = Math.random() > 0.5 ? "green" : "red";
      setFallingObjects((prevObjects: FallingObject[]) => [
        ...prevObjects,
        {
          x: Math.random() * window.innerWidth, // Adjust for actual screen width
          y: 0,
          color: randomColor,
          id: Date.now(),
          isHidden: false,
        } as FallingObject,
      ]);
    };

    const interval = setInterval(addFallingObject, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    let animationFrameId: number;

    const updateFallingObjects = () => {
      if (isPaused) return;

      setFallingObjects(
        (prevObjects) =>
          prevObjects
            .map((obj) => ({
              ...obj,
              y: obj.y + 3, // Adjust object position
            }))
            .filter((obj) => obj.y < window.innerHeight) // Remove objects off-screen
      );

      animationFrameId = requestAnimationFrame(updateFallingObjects);
    };

    animationFrameId = requestAnimationFrame(updateFallingObjects);

    setFallingObjects(
      fallingObjects.filter((obj: FallingObject) => {
        if (
          obj.y > playerPosition.y! - 60 && // Object is near the bottom
          obj.x > playerPosition.x - 30 && // Object is in player range
          obj.x < playerPosition.x + 30
        ) {
          obj.isHidden = true;
          if (obj.color === "green") {
            if (!isModalVisible) setXp(xp + 1); // Increase XP for catching
          } else if (obj.color === "red") {
            const newXp = xp - 1;
            if (newXp < 0 || liquidity <= 0) {
              setIsModalVisible(true);
              setIsPaused(true);
            } else {
              setXp(newXp > 0 ? newXp : 0);
            }
          }
          return false;
        }
        return true;
      })
    );

    return () => cancelAnimationFrame(animationFrameId); // Cleanup on unmount
  }, [playerPosition, isPaused]);

  const botTexture = PIXI.Texture.WHITE;
  const fallingObjectTexture = PIXI.Texture.WHITE;
  return (
    <div className="flex flex-col justify-center items-center w-full h-full pb-5">
      <GameHeader
        totalPoints={user.pointsBalance + xp}
        liquidity={liquidity}
      />
      <div
        className="w-full m-3 h-full bg-white relative overflow-hidden pb-5"
        tabIndex={0}
        onTouchMove={handleTouchMove}
        onTouchMoveCapture={handleTouchMove}
        onMouseMove={async (e) => {
          if (!isPaused) setPlayerPosition({ x: e.clientX });
        }}
      >
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          options={{ backgroundColor: 0xffffff }}
        >
          <Container sortableChildren={true}>
            <Sprite
              texture={botTexture}
              x={playerPosition.x}
              y={playerPosition.y!}
              anchor={0.5}
              width={60}
              height={20}
              tint={0x000000}
              zIndex={1000}
            />
            {fallingObjects.map((obj: FallingObject) => (
              <Sprite
                key={obj.id}
                texture={fallingObjectTexture}
                x={obj.x}
                y={obj.y}
                width={20}
                height={50}
                tint={obj.color === "green" ? 0x00ff00 : 0xff0000}
                zIndex={-100}
                visible={!obj.isHidden}
              />
            ))}
          </Container>
        </Stage>
      </div>

      {isModalVisible && (
        <GameOverModal
          totalPoints={user.pointsBalance + xp}
          xp={xp}
          liquidity={liquidity}
          setIsPaused={setIsPaused}
        />
      )}
    </div>
  );
}

interface GameHeaderProps {
  liquidity: number;
  totalPoints: number;
}

const GameHeader: React.FC<GameHeaderProps> = React.memo(
  ({ liquidity, totalPoints }) => {
    console.log(totalPoints, 'totalPoints')
    const level = getLevel(totalPoints)!;
    return (
      <div className="flex flex-col justify-center items-center w-full gap-2 px-3">
        <div className="px-3 bg-red-300 rounded-xl mb-1 mt-4 text-sm">
          Total points: {totalPoints}
        </div>
        <div className="flex w-full items-center justify-center">
          <ProgressBar
            progress={
              ((totalPoints - level.points) /
                (level.nextLevelPoints - level.points)) *
              100
            }
          />
          <p className="absolute text-white">
            XP {totalPoints - level.points}/
            {level.nextLevelPoints - level.points}
          </p>
        </div>
        <div className="flex w-full items-center justify-center">
          <ProgressBar progress={liquidity} />
          <p className="absolute text-white">Liquidity</p>
        </div>
      </div>
    );
  }
);

interface GameOverModalProps {
  xp: number;
  liquidity: number;
  totalPoints: number;
  setIsPaused: (isPaused: boolean) => void;
}

function GameOverModal({
  xp,
  liquidity,
  totalPoints,
  setIsPaused,
}: GameOverModalProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
      <div className="bg-white p-5 rounded-lg flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Game Over</h2>
        <p>Your {liquidity === 0 ? "liquidity" : "XP"} has reached zero.</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={async () => {
            await api.updateUser({
              pointsBalance: totalPoints + xp < 0 ? 0 : totalPoints + xp,
              liquidity,
            });
            setIsPaused(false);
            navigate({ to: "/" });
          }}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
