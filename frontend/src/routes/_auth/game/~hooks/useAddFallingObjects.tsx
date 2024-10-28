import { useEffect, useState } from "react";
import { FallingObject } from "../~types/fallingObject";

export function useFallingObjects() {
  const [fallingObjects, setFallingObjects] = useState<FallingObject[]>([]);

  useEffect(() => {
    const addFallingObject = () => {
      const randomColor: "green" | "red" = Math.random() > 0.5 ? "green" : "red";
      const newObject = {
        x: Math.random() * window.innerWidth, // Adjust for actual screen width
        y: 0,
        color: randomColor,
        id: Date.now(),
        isHidden: false,
      } as FallingObject;

      setFallingObjects((prevObjects) => [...prevObjects, newObject]);
    };

    let animationFrameId: number;

    const updateFallingObjects = () => {
      setFallingObjects((prevObjects) =>
        prevObjects
        .map((obj) => ({ ...obj, y: obj.y + 3 }))
        .filter((obj) => obj.y < window.innerHeight)
      );

      animationFrameId = requestAnimationFrame(updateFallingObjects);
    };

    animationFrameId = requestAnimationFrame(updateFallingObjects);

    const interval = setInterval(addFallingObject, 1000);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return fallingObjects;
}
