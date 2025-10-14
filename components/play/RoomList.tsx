"use client";

interface Room {
  id: string;
  name: string;
  description: string;
  theme: string;
  timer: number;
  objects?: any[];
}

interface RoomListProps {
  rooms: Room[];
  onSelectRoom: (room: any) => void;
  user?: any;
  onLogout?: () => void;
}

export default function RoomList({ 
  rooms, 
  onSelectRoom,
  user,
  onLogout 
}: RoomListProps) {
  const getThemeIcon = (theme: string) => {
    return theme === "ANCIENT" ? "🏛️" : "🚀";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  return (
    <div className="container py-5">
      {/* User Info & Logout */}
      {user && onLogout && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-0">
                  <i className="bi bi-controller me-2"></i>
                  Escape Room Player
                </h4>
                <small className="text-muted">
                  Welcome, <strong>{user.username}</strong>
                </small>
              </div>
              <button
                className="btn btn-outline-danger"
                onClick={onLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </button>
            </div>
            <hr />
          </div>
        </div>
      )}

      <h2 className="text-center mb-5 display-5 fw-bold">
        <i className="bi bi-controller me-3"></i>
        Choose Your Escape Room
      </h2>
      <div className="row g-4">
        {rooms.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info text-center" role="alert">
              <i className="bi bi-info-circle me-2"></i>
              No escape rooms available yet. Visit the Builder to create one!
            </div>
          </div>
        ) : (
          rooms.map((room) => (
            <div key={room.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm hover-shadow transition">
                <div className="card-body">
                  <h5 className="card-title d-flex align-items-center gap-2">
                    <span className="fs-3">{getThemeIcon(room.theme)}</span>
                    {room.name}
                  </h5>
                  <p className="card-text text-muted">
                    {room.description || "No description provided"}
                  </p>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="badge bg-primary">
                      <i className="bi bi-clock me-1"></i>
                      {formatTime(room.timer)}
                    </span>
                    <span className="badge bg-secondary">
                      {room.theme}
                    </span>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0 pb-3">
                  <button
                    className="btn btn-success w-100"
                    onClick={() => onSelectRoom(room)}
                  >
                    <i className="bi bi-play-fill me-2"></i>
                    Start Game
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
