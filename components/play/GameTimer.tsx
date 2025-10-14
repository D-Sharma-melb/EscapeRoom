"use client";

import { useEffect, useState } from "react";

interface GameTimerProps {
  totalSeconds: number;
  isRunning: boolean;
  onTimeUp: () => void;
}

export default function GameTimer({
  totalSeconds,
  isRunning,
  onTimeUp,
}: GameTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);

  useEffect(() => {
    setRemainingSeconds(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const percentage = (remainingSeconds / totalSeconds) * 100;
  const isLowTime = percentage <= 20;

  return (
    <div className="d-flex align-items-center gap-3">
      <div className="progress flex-grow-1" style={{ height: "30px" }}>
        <div
          className={`progress-bar ${
            isLowTime ? "bg-danger" : "bg-success"
          } progress-bar-striped progress-bar-animated`}
          role="progressbar"
          style={{ width: `${percentage}%` }}
          aria-valuenow={remainingSeconds}
          aria-valuemin={0}
          aria-valuemax={totalSeconds}
        >
          <span className="fw-bold">{formatTime(remainingSeconds)}</span>
        </div>
      </div>
      <i className={`bi bi-clock fs-4 ${isLowTime ? "text-danger" : "text-success"}`}></i>
    </div>
  );
}
