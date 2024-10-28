import { useState, useEffect } from "react";

export function usePlayerPosition(): number {
  const [playerPosition, setPlayerPosition] = useState(50); // Player starts at the center

  const updatePlayerPosition = (newPosition: number) => {
    if (newPosition >= 0 && newPosition <= 90) {
      setPlayerPosition(newPosition);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault(); // Prevents the default touchmove behavior
    const touchX = e.changedTouches[0].clientX;
    const newPosition = (touchX / window.innerWidth) * 100;
    updatePlayerPosition(newPosition);
  };

  const handleMouseClick = (e: MouseEvent) => {
    const mouseX = e.clientX;
    const newPosition = (mouseX / window.innerWidth) * 100;
    updatePlayerPosition(newPosition);
  };

  useEffect(() => {
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("click", handleMouseClick);

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("click", handleMouseClick);
    };
  }, []);

  return playerPosition;
}
