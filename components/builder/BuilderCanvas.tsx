"use client";

import { useState } from "react";

interface RoomObject {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  question: string;
  correctAnswer: string;
  hint: string;
  points: number;
}

interface BuilderCanvasProps {
  theme: "ANCIENT" | "SPACE";
  objects: RoomObject[];
  onObjectClick: (object: RoomObject) => void;
  onObjectMove: (id: string, x: number, y: number) => void;
}

const objectIcons: Record<string, string> = {
  KEY: "🔑",
  LOCK: "🔒",
  DOOR: "🚪",
  CHEST: "📦",
  PUZZLE: "🧩",
  CODE: "🔢",
};

export default function BuilderCanvas({
  theme,
  objects,
  onObjectClick,
  onObjectMove,
}: BuilderCanvasProps) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const backgroundImage = theme === "ANCIENT" ? "/theme_1.png" : "/theme_2.png";

  const handleMouseDown = (e: React.MouseEvent, obj: RoomObject) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(obj.id);
    setIsDragging(false);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;

    setIsDragging(true);
    const canvas = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - canvas.left - dragOffset.x;
    const y = e.clientY - canvas.top - dragOffset.y;

    // Clamp to canvas bounds
    const clampedX = Math.max(0, Math.min(x, canvas.width - 80));
    const clampedY = Math.max(0, Math.min(y, canvas.height - 80));

    onObjectMove(dragging, clampedX, clampedY);
  };

  const handleMouseUp = () => {
    setDragging(null);
    // Don't reset isDragging immediately
    setTimeout(() => setIsDragging(false), 50);
  };

  const handleObjectClick = (e: React.MouseEvent, obj: RoomObject) => {
    e.stopPropagation();
    console.log("🎯 Object click handler called:", obj.type, "isDragging:", isDragging);
    if (!isDragging) {
      onObjectClick(obj);
    } else {
      console.log("Click ignored - was dragging");
    }
  };

  return (
    <div
      className="position-relative border border-3 rounded-3 overflow-hidden"
      style={{
        height: "500px",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        cursor: dragging ? "grabbing" : "default",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {objects.map((obj) => (
        <div
          key={obj.id}
          className={`position-absolute d-flex align-items-center justify-content-center border border-2 rounded shadow ${
            obj.question ? "bg-success bg-opacity-25 border-success" : "bg-white border-dark"
          }`}
          style={{
            left: `${obj.x}px`,
            top: `${obj.y}px`,
            width: `${obj.width}px`,
            height: `${obj.height}px`,
            cursor: "grab",
            transition: dragging === obj.id ? "none" : "all 0.1s",
          }}
          onMouseDown={(e) => handleMouseDown(e, obj)}
          onClick={(e) => handleObjectClick(e, obj)}
          title={`${obj.type}${obj.question ? " - Configured ✓" : " - Click to configure"}`}
        >
          <span className="fs-1 user-select-none">{objectIcons[obj.type]}</span>
          {obj.question && (
            <span className="position-absolute top-0 end-0 translate-middle badge rounded-pill bg-success">
              <i className="bi bi-check-lg"></i>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
