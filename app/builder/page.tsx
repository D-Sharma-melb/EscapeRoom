"use client";

import SigninBuilder from "@/components/SigninBuilder";
import { useEffect, useState } from "react";


export default function BuilderPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <SigninBuilder onAuthSuccess={(authenticatedUser) => {
      setUser(authenticatedUser);
    }} />;
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold">
          Welcome, {user.username}! 
        </h1>
        <p className="lead">
          Start building your escape room below.
        </p>
      </div>

      <div className="border rounded-3 p-5 bg-light text-center">
        <h5>Escape Room Builder Workspace</h5>
        <p className="text-muted">Drag & drop objects and set puzzles here.</p>
      </div>

      <div className="text-center mt-4">
        <button
          className="btn btn-outline-danger"
          onClick={() => {
            localStorage.removeItem("user");
            setUser(null);
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
