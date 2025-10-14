"use client";

interface RoomObject {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  question?: string;
  correctAnswer?: string;
  hint?: string;
  points?: number;
}

interface GameCanvasProps {
  theme: string;
  objects: RoomObject[];
  answeredObjects: Set<string>;
  onObjectClick: (object: any) => void;
}

const objectIcons: Record<string, string> = {
  KEY: "🔑",
  LOCK: "🔒",
  DOOR: "🚪",
  CHEST: "📦",
  PUZZLE: "🧩",
  CODE: "🔢",
};

export default function GameCanvas({
  theme,
  objects,
  answeredObjects,
  onObjectClick,
}: GameCanvasProps) {
  const backgroundImage = theme === "ANCIENT" ? "/theme_1.png" : "/theme_2.png";

  return (
    <div
      className="position-relative border border-3 border-dark rounded-3 overflow-hidden"
      style={{
        height: "500px",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {objects.map((obj) => {
        const isAnswered = answeredObjects.has(obj.id);
        return (
          <div
            key={obj.id}
            className={`position-absolute d-flex align-items-center justify-content-center border border-3 rounded shadow ${
              isAnswered ? "bg-success bg-opacity-75" : "bg-white"
            }`}
            style={{
              left: `${obj.x}px`,
              top: `${obj.y}px`,
              width: `${obj.width}px`,
              height: `${obj.height}px`,
              cursor: "pointer",
              transition: "all 0.3s ease",
              transform: isAnswered ? "scale(0.9)" : "scale(1)",
            }}
            onClick={() => onObjectClick(obj)}
            title={isAnswered ? "Completed!" : obj.type}
          >
            <span className="fs-1 user-select-none">{objectIcons[obj.type]}</span>
            {isAnswered && (
              <i className="bi bi-check-circle-fill position-absolute top-0 end-0 text-white fs-5 m-1"></i>
            )}
          </div>
        );
      })}
    </div>
  );
}
