import { useEffect, useState } from 'react';
import { createLazyFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { userQueryOptions } from "../../../utils/queryOptions";
import { useLiquidity } from "./~hooks/useLiquidity";
import * as PIXI from "pixi.js";
import { Sprite, Container, Stage } from "@pixi/react";
import useGameStore from "../../../store";
import { GameHeader } from './~components/GameHeader.tsx';
import { GameOverModal } from './~components/GameOverModal.tsx';
import { useGameAnimation } from './~hooks/useGameAnimation.tsx';
import api from '../../../api';

export const Route = createLazyFileRoute("/_auth/game")({
  component: () => <GameScreen />,
});

export function GameScreen() {
  const [startGame, setStartGame] = useState<Date>(new Date())
  const { data: user } = useSuspenseQuery(userQueryOptions());
  const {
    xp,
    liquidity,
    isPaused,
    setIsPaused,
  } = useGameStore();

  const {
    isModalVisible,
    playerPositionRef,
    fallingObjectsRef,
    handleMouseMove,
    handleTouchMove
  } = useGameAnimation()

  useLiquidity()

  const botTexture = PIXI.Texture.WHITE;
  const fallingObjectTexture = PIXI.Texture.WHITE;

  useEffect(() => {
    const id = user.telegramId

    if (isPaused && id) {
      api.setSessionGame(id, startGame);
    } else {
      setStartGame(new Date())
    }
  }, [user.telegramId, isPaused]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div className="flex flex-col justify-center items-center w-full h-full pb-5">
      <GameHeader totalPoints={user.pointsBalance + xp} liquidity={liquidity} />
      <div
        className="w-full m-3 h-full bg-white relative overflow-hidden pb-5"
        tabIndex={0}
        onTouchMove={handleTouchMove}
        onTouchMoveCapture={handleTouchMove}
      >
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          options={{ backgroundColor: 0xffffff }}
        >
          <Container sortableChildren={true}>
            <Sprite
              texture={botTexture}
              x={playerPositionRef.current.x}
              y={playerPositionRef.current.y!}
              anchor={0.5}
              width={60}
              height={20}
              tint={0x000000}
              zIndex={1000}
            />
            {fallingObjectsRef.current.map((obj) => (
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
