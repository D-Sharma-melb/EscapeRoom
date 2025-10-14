"use client";

import SigninBuilder from "@/components/SigninBuilder";
import ThemeSelector from "@/components/builder/ThemeSelector";
import ObjectSelector from "@/components/builder/ObjectSelector";
import RoomDetailsModal from "@/components/builder/RoomDetailsModal";
import TimerSlider from "@/components/builder/TimerSlider";
import BuilderCanvas from "@/components/builder/BuilderCanvas";
import ObjectConfigModal from "@/components/builder/ObjectConfigModal";
import { useEffect, useState } from "react";

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

export default function BuilderPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bootstrapLoaded, setBootstrapLoaded] = useState(false);
  
  // Room state
  const [theme, setTheme] = useState<"ANCIENT" | "SPACE">("ANCIENT");
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [timer, setTimer] = useState(600); // 10 minutes default
  const [objects, setObjects] = useState<RoomObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<RoomObject | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Check if Bootstrap is loaded
  useEffect(() => {
    const checkBootstrap = () => {
      if (typeof window !== "undefined" && (window as any).bootstrap) {
        setBootstrapLoaded(true);
        console.log("✅ Bootstrap detected and ready");
      } else {
        // Retry after a short delay
        setTimeout(checkBootstrap, 100);
      }
    };
    checkBootstrap();
  }, []);

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

  const handleAddObject = (objectType: string) => {
    const newObject: RoomObject = {
      id: `temp-${Date.now()}`,
      type: objectType,
      x: Math.random() * 400,
      y: Math.random() * 300,
      width: 80,
      height: 80,
      question: "",
      correctAnswer: "",
      hint: "",
      points: 10,
    };
    setObjects([...objects, newObject]);
  };

  const handleObjectClick = (obj: RoomObject) => {
    console.log("🖱️ Object clicked:", obj.type, obj.id);
    setSelectedObject(obj);
    
    // Check if Bootstrap is loaded
    if (!bootstrapLoaded || !(window as any).bootstrap) {
      console.error("❌ Bootstrap not loaded yet");
      alert("Please wait a moment for the page to fully load, then try again.");
      return;
    }
    
    // Trigger modal using Bootstrap - use setTimeout to ensure state update
    setTimeout(() => {
      const modalElement = document.getElementById("objectConfigModal");
      console.log("📦 Modal element found:", !!modalElement);
      
      if (modalElement) {
        try {
          // Get or create modal instance
          let modal = (window as any).bootstrap.Modal.getInstance(modalElement);
          if (!modal) {
            modal = new (window as any).bootstrap.Modal(modalElement);
          }
          modal.show();
          console.log("✅ Modal shown successfully");
        } catch (error) {
          console.error("❌ Error showing modal:", error);
          alert("Error opening configuration modal. Please try clicking again.");
        }
      } else {
        console.error("❌ Modal element not found in DOM");
        alert("Modal element not found. Please refresh the page.");
      }
    }, 50);
  };

  const handleObjectMove = (id: string, x: number, y: number) => {
    setObjects(
      objects.map((obj) => (obj.id === id ? { ...obj, x, y } : obj))
    );
  };

  const handleSaveObjectConfig = (config: {
    question: string;
    correctAnswer: string;
    hint: string;
    points: number;
  }) => {
    if (selectedObject) {
      console.log("💾 Saving object config:", config);
      setObjects(
        objects.map((obj) =>
          obj.id === selectedObject.id ? { ...obj, ...config } : obj
        )
      );
      console.log("✅ Object configuration saved locally");
    }
  };

  const handleDeleteObject = () => {
    if (selectedObject) {
      setObjects(objects.filter((obj) => obj.id !== selectedObject.id));
      setSelectedObject(null);
    }
  };

  const handleSaveRoom = async () => {
    if (!roomName.trim()) {
      alert("Please provide a room name!");
      return;
    }

    if (objects.length === 0) {
      alert("Please add at least one object to the room!");
      return;
    }

    const incompleteObjects = objects.filter(
      (obj) => !obj.question || !obj.correctAnswer
    );
    if (incompleteObjects.length > 0) {
      alert("Please configure all objects with questions and answers!");
      return;
    }

    setSaving(true);

    try {
      // Create or update room
      const roomResponse = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: roomName,
          description: roomDescription,
          theme,
          timer,
          createdById: user.id,
        }),
      });

      if (!roomResponse.ok) {
        throw new Error("Failed to save room");
      }

      const room = await roomResponse.json();
      setCurrentRoomId(room.id);

      // Delete existing objects if updating
      if (currentRoomId) {
        await fetch(`/api/rooms/${currentRoomId}/objects`, {
          method: "DELETE",
        });
      }

      // Save all objects
      console.log(`💾 Saving ${objects.length} objects to database...`);
      for (const obj of objects) {
        console.log(`  → Saving object: ${obj.type} with question: "${obj.question}"`);
        const response = await fetch(`/api/rooms/${room.id}/objects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(obj),
        });
        
        if (!response.ok) {
          console.error(`❌ Failed to save object ${obj.type}`);
          throw new Error(`Failed to save object ${obj.type}`);
        }
        
        const savedObj = await response.json();
        console.log(`  ✅ Saved object with ID: ${savedObj.id}`);
      }

      console.log("🎉 All objects saved successfully!");
      alert("Room saved successfully! ✅");
    } catch (error) {
      console.error("Error saving room:", error);
      alert("Failed to save room. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset everything?")) {
      setTheme("ANCIENT");
      setRoomName("");
      setRoomDescription("");
      setTimer(600);
      setObjects([]);
      setCurrentRoomId(null);
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      setUser(null);
      console.log("👋 User logged out successfully");
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
          backgroundImage: "url(/theme_1.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <SigninBuilder
          onAuthSuccess={(authenticatedUser) => {
            setUser(authenticatedUser);
          }}
        />
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* User Info & Logout */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-0">
                <i className="bi bi-hammer me-2"></i>
                Escape Room Builder
              </h4>
              <small className="text-muted">
                Welcome, <strong>{user.username}</strong>
              </small>
            </div>
            <button
              className="btn btn-outline-danger"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
          <hr />
        </div>
      </div>

      {/* Top Controls */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-3">
          <ThemeSelector selectedTheme={theme} onThemeChange={setTheme} />
        </div>
        <div className="col-md-6 text-center">
          <RoomDetailsModal
            roomName={roomName}
            roomDescription={roomDescription}
            onSave={(name, description) => {
              setRoomName(name);
              setRoomDescription(description);
            }}
          />
        </div>
        <div className="col-md-3 text-end">
          <ObjectSelector onObjectSelect={handleAddObject} />
        </div>
      </div>

      {/* Room Name Display */}
      {roomName && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="alert alert-info mb-0">
              <h5 className="mb-1">
                <i className="bi bi-door-open me-2"></i>
                {roomName}
              </h5>
              {roomDescription && (
                <p className="mb-0 text-muted">{roomDescription}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="row mb-4">
        <div className="col-12">
          <BuilderCanvas
            theme={theme}
            objects={objects}
            onObjectClick={handleObjectClick}
            onObjectMove={handleObjectMove}
          />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="row align-items-center">
        <div className="col-md-6">
          <TimerSlider timer={timer} onTimerChange={setTimer} />
        </div>
        <div className="col-md-6 text-end">
          <button
            className="btn btn-outline-warning me-2"
            onClick={handleReset}
            disabled={saving}
          >
            <i className="bi bi-arrow-counterclockwise me-2"></i>
            Reset
          </button>
          <button
            className="btn btn-success"
            onClick={handleSaveRoom}
            disabled={saving}
          >
            {saving ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Saving...
              </>
            ) : (
              <>
                <i className="bi bi-save me-2"></i>
                Save Room
              </>
            )}
          </button>
        </div>
      </div>

      {/* Object Config Modal */}
      <ObjectConfigModal
        objectId={selectedObject?.id || null}
        currentConfig={{
          question: selectedObject?.question || "",
          correctAnswer: selectedObject?.correctAnswer || "",
          hint: selectedObject?.hint || "",
          points: selectedObject?.points || 10,
        }}
        onSave={handleSaveObjectConfig}
        onDelete={handleDeleteObject}
      />
    </div>
  );
}
