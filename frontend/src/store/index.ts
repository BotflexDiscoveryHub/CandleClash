import { create } from "zustand";
import { FallingObject } from "../routes/_auth/game/~types/fallingObject";
import { Boost } from '../routes/_auth/rewards/~types';

interface GameState {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  startGame: Date;
  setStartGame: (date: Date) => void;
  boosts: Boost[];
  xp: number;
  setXp: (points: number) => void;
  collectedItems: number;
  setCollectedItems: (points: number) => void;
  liquidity: number;
  setLiquidity: (points: number) => void;
  totalPoints: number;
  setTotalPoints: (points: number) => void;
  isPaused: boolean;
  setIsPaused: (isPaused: boolean) => void;
  isPlay: boolean;
  setIsPlay: (isPlay: boolean) => void;
  isMode: boolean;
  setIsMode: (isMode: boolean) => void;
  playerPosition: { x: number; y: number };
  setPlayerPosition: (position: { x: number; y?: number }) => void;
  isGameStarted: boolean;
  setIsGameStarted: (isGameStarted: boolean) => void;
  fallingObjects: FallingObject[];
  setFallingObjects: (objects: FallingObject[]) => void;
  isDataLoaded: boolean;
  setIsDataLoaded: (isLoad: boolean) => void;
}

const useGameStore = create<GameState>((set, get) => ({
  isLoading: false,
  setIsLoading: (value: boolean) => {
    set({ isLoading: value });
  },
  startGame: new Date(),
  setStartGame: (date: Date) => {
    set({ startGame: date });
  },
  boosts: [],
  xp: 0,
  setXp: (points: number) => {
    set({ xp: points });
  },
  collectedItems: 0,
  setCollectedItems: (points: number) => {
    set({ collectedItems: points });
  },
  liquidity: 0,
  setLiquidity: (points: number) => {
    set({ liquidity: points });
  },
  totalPoints: 0,
  setTotalPoints: (points: number) => {
    set({ totalPoints: points });
  },
  isMode: false,
  setIsMode: (isMode: boolean) => {
    set({ isMode });
  },
  isPlay: false,
  setIsPlay: (isPlay: boolean) => {
    set({ isPlay });
  },
  isPaused: true,
  setIsPaused: (isPaused: boolean) => {
    set({ isPaused: isPaused });
  },
  playerPosition: { x: window.innerWidth / 2, y: window.innerHeight - 116 },
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
  isDataLoaded: false,
  setIsDataLoaded: (isLoad: boolean) => {
    set({ isDataLoaded: isLoad });
  },
}));

export default useGameStore;
