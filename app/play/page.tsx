"use client";

import { useEffect, useState } from "react";
import RoomList from "@/components/play/RoomList";
import GameCanvas from "@/components/play/GameCanvas";
import GameTimer from "@/components/play/GameTimer";
import GameResultModal from "@/components/play/GameResultModal";
import ObjectAnswerModal from "@/components/play/ObjectAnswerModal";
import SigninPlayer from "@/components/SigninPlayer";

interface Room {
  id: string;
  name: string;
  description: string;
  theme: string;
  timer: number;
  objects: RoomObject[];
}

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

export default function PlayPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<RoomObject | null>(null);
  const [answeredObjects, setAnsweredObjects] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check if user is stored in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      fetch(`/api/users/${parsedUser.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("User not found");
          return res.json();
        })
        .then((user) => {
          setUser(user);
          loadRooms();
        })
        .catch((err) => {
          console.error("Error validating user:", err);
          localStorage.removeItem("user");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loadRooms = async () => {
    try {
      const response = await fetch("/api/rooms");
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Error loading rooms:", error);
    }
  };

  const handleSelectRoom = async (room: Room) => {
    setSelectedRoom(room);
    setAnsweredObjects(new Set());
    setScore(0);
    setGameStarted(false);
    setGameEnded(false);
  };

  const handleStartGame = async () => {
    if (!selectedRoom || !user) return;

    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: selectedRoom.id,
          playerId: user.id,
        }),
      });

      const session = await response.json();
      setSessionId(session.id);
      setGameStarted(true);
    } catch (error) {
      console.error("Error starting game:", error);
      alert("Failed to start game. Please try again.");
    }
  };

  const handleObjectClick = (object: RoomObject) => {
    setSelectedObject(object);
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById("objectAnswerModal")
    );
    modal.show();
  };

  const handleSubmitAnswer = async (answer: string) => {
    if (!selectedObject || !sessionId) return;

    try {
      const response = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          objectId: selectedObject.id,
          answer,
        }),
      });

      const attempt = await response.json();

      if (attempt.isCorrect) {
        setAnsweredObjects(new Set([...answeredObjects, selectedObject.id]));
        setScore((prev) => prev + attempt.pointsAwarded);

        // Show success message
        const toast = document.createElement("div");
        toast.className = "toast-container position-fixed top-0 end-0 p-3";
        toast.innerHTML = `
          <div class="toast show" role="alert">
            <div class="toast-header bg-success text-white">
              <strong class="me-auto">✅ Correct!</strong>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
              +${attempt.pointsAwarded} points!
            </div>
          </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);

        // Check if all objects are answered
        if (
          answeredObjects.size + 1 ===
          (selectedRoom?.objects.length || 0)
        ) {
          setTimeout(() => {
            handleGameEnd(true);
          }, 1000);
        }
      } else {
        // Show error message
        const toast = document.createElement("div");
        toast.className = "toast-container position-fixed top-0 end-0 p-3";
        toast.innerHTML = `
          <div class="toast show" role="alert">
            <div class="toast-header bg-danger text-white">
              <strong class="me-auto">❌ Incorrect</strong>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
              Try again!
            </div>
          </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const handleGameEnd = async (success: boolean) => {
    setGameEnded(true);
    setIsSuccess(success);
    setGameStarted(false);

    // Update session status
    if (sessionId) {
      try {
        await fetch(`/api/sessions`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: sessionId,
            status: success ? "COMPLETED" : "EXPIRED",
            endedAt: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.error("Error updating session:", error);
      }
    }

    const modal = new (window as any).bootstrap.Modal(
      document.getElementById("gameResultModal")
    );
    modal.show();
  };

  const handleRestart = () => {
    if (selectedRoom) {
      handleSelectRoom(selectedRoom);
    }
  };

  const handleBackToRooms = () => {
    setSelectedRoom(null);
    setGameStarted(false);
    setGameEnded(false);
    loadRooms();
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      setUser(null);
      setSelectedRoom(null);
      setGameStarted(false);
      setGameEnded(false);
      console.log("👋 Player logged out successfully");
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "calc(100vh - 80px)" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="position-relative"
        style={{
          height: "calc(100vh - 80px)",
          backgroundImage: "url(/theme_2.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <SigninPlayer
          onAuthSuccess={(authenticatedUser) => {
            setUser(authenticatedUser);
            loadRooms();
          }}
        />
      </div>
    );
  }

  if (!selectedRoom) {
    return (
      <RoomList 
        rooms={rooms} 
        onSelectRoom={handleSelectRoom}
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  const totalPoints =
    selectedRoom.objects.reduce((sum, obj) => sum + obj.points, 0) || 0;

  return (
    <div className="container-fluid py-4">
      {/* User Info & Logout */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">
                <i className="bi bi-controller me-2"></i>
                Playing as: <strong>{user.username}</strong>
              </h5>
            </div>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={handleLogout}
              disabled={gameStarted && !gameEnded}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
          <hr />
        </div>
      </div>

      {/* Header */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-3">
          <button
            className="btn btn-outline-secondary"
            onClick={handleBackToRooms}
            disabled={gameStarted}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Rooms
          </button>
        </div>
        <div className="col-md-6 text-center">
          <h3 className="mb-0">
            <i className="bi bi-door-open me-2"></i>
            {selectedRoom.name}
          </h3>
        </div>
        <div className="col-md-3 text-end">
          <span className="badge bg-primary fs-5">
            <i className="bi bi-trophy me-2"></i>
            {score} / {totalPoints}
          </span>
        </div>
      </div>

      {/* Timer */}
      {gameStarted && (
        <div className="row mb-3">
          <div className="col-12">
            <GameTimer
              totalSeconds={selectedRoom.timer}
              isRunning={gameStarted}
              onTimeUp={() => handleGameEnd(false)}
            />
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="row mb-4">
        <div className="col-12">
          {!gameStarted ? (
            <div
              className="position-relative border border-3 border-dark rounded-3 overflow-hidden d-flex align-items-center justify-content-center"
              style={{
                height: "500px",
                backgroundImage: `url(${
                  selectedRoom.theme === "ANCIENT"
                    ? "/theme_1.png"
                    : "/theme_2.png"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="text-center bg-white bg-opacity-75 p-5 rounded shadow">
                <h2 className="mb-4">Ready to Escape?</h2>
                <p className="mb-4 text-muted">
                  {selectedRoom.objects.length} challenges await you!
                </p>
                <button
                  className="btn btn-success btn-lg"
                  onClick={handleStartGame}
                >
                  <i className="bi bi-play-fill me-2"></i>
                  Start Game
                </button>
              </div>
            </div>
          ) : (
            <GameCanvas
              theme={selectedRoom.theme}
              objects={selectedRoom.objects}
              answeredObjects={answeredObjects}
              onObjectClick={handleObjectClick}
            />
          )}
        </div>
      </div>

      {/* Progress */}
      {gameStarted && (
        <div className="row">
          <div className="col-12">
            <div className="progress" style={{ height: "30px" }}>
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{
                  width: `${
                    (answeredObjects.size / selectedRoom.objects.length) * 100
                  }%`,
                }}
              >
                <span className="fw-bold">
                  {answeredObjects.size} / {selectedRoom.objects.length}{" "}
                  Completed
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ObjectAnswerModal
        object={selectedObject}
        isAnswered={selectedObject ? answeredObjects.has(selectedObject.id) : false}
        onSubmitAnswer={handleSubmitAnswer}
      />
      <GameResultModal
        isSuccess={isSuccess}
        score={score}
        totalPoints={totalPoints}
        onRestart={handleRestart}
        onBackToRooms={handleBackToRooms}
      />
    </div>
  );
}
