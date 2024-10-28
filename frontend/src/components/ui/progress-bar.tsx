import React from "react";
import { cn } from "../../lib/utils";

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  progress: number;
  className?: string;
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  return (
    <div className="flex w-full items-center relative">
      <div
        className={cn(
          `flex items-center w-full h-5 bg-red-500 relative ${className}`
        )}
      >
        <div
          className="bg-green-500 h-full relative"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
