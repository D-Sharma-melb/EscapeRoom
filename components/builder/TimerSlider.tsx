"use client";

interface TimerSliderProps {
  timer: number;
  onTimerChange: (value: number) => void;
}

export default function TimerSlider({ timer, onTimerChange }: TimerSliderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="d-flex align-items-center gap-3">
      <label htmlFor="timerSlider" className="form-label mb-0 text-nowrap">
        <i className="bi bi-clock me-2"></i>
        Timer:
      </label>
      <input
        type="range"
        className="form-range"
        id="timerSlider"
        min="60"
        max="1800"
        step="30"
        value={timer}
        onChange={(e) => onTimerChange(parseInt(e.target.value))}
        style={{ minWidth: "200px" }}
      />
      <span className="badge bg-secondary text-nowrap">{formatTime(timer)}</span>
    </div>
  );
}
