import { create } from "zustand";
import { FallingObject } from "../routes/_auth/game/~types/fallingObject";

interface GameState {
  xp: number;
  setXp: (points: number) => void;
  liquidity: number;
  setLiquidity: (points: number) => void;
  totalPoints: number;
  setTotalPoints: (points: number) => void;
  isPaused: boolean;
  setIsPaused: (isPaused: boolean) => void;
  playerPosition: { x: number; y: number };
  setPlayerPosition: (position: { x: number; y?: number }) => void;
  isGameStarted: boolean;
  setIsGameStarted: (isGameStarted: boolean) => void;
  fallingObjects: FallingObject[];
  setFallingObjects: (objects: FallingObject[]) => void;
}

const useGameStore = create<GameState>((set, get) => ({
  xp: 0,
  setXp: (points: number) => {
    set({ xp: points });
  },
  liquidity: 0,
  setLiquidity: (points: number) => {
    set({ liquidity: points });
  },
  totalPoints: 0,
  setTotalPoints: (points: number) => {
    set({ totalPoints: points });
  },
  isPaused: false,
  setIsPaused: (isPaused: boolean) => {
    set({ isPaused: isPaused });
  },
  playerPosition: { x: window.innerWidth / 2, y: window.innerHeight - 213 },
  setPlayerPosition: (position) => {
    set({
      playerPosition: {
        x: position.x,
        y: position.y ? position.y : get().playerPosition.y,
      },
    });
  },
  isGameStarted: false,
  setIsGameStarted: (isGameStarted) => {
    set({ isGameStarted: isGameStarted });
  },
  fallingObjects: [],
  setFallingObjects: (objects) => {
    set({ fallingObjects: objects });
  },
}));

export default useGameStore;
