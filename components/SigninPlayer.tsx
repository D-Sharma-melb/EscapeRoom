"use client";

import { useState } from "react";

interface SigninPlayerProps {
  onAuthSuccess: (user: any) => void;
}

export default function SigninPlayer({ onAuthSuccess }: SigninPlayerProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await fetch("/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Login failed");
        }

        const user = await response.json();
        localStorage.setItem("user", JSON.stringify(user));
        onAuthSuccess(user);
      } else {
        // Sign up as PLAYER
        const response = await fetch("/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            username, 
            password,
            role: "PLAYER" // Always create as PLAYER for play mode
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Sign up failed");
        }

        const user = await response.json();
        localStorage.setItem("user", JSON.stringify(user));
        onAuthSuccess(user);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="position-absolute top-50 start-50 translate-middle">
      <div className="card shadow-lg" style={{ width: "400px" }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <i className="bi bi-controller fs-1 text-primary"></i>
            <h3 className="mt-2">
              {isLogin ? "Player Login" : "Player Sign Up"}
            </h3>
            <p className="text-muted mb-0">
              {isLogin
                ? "Enter your credentials to play"
                : "Create an account to start playing"}
            </p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-bold">
                Username
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-person"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-bold">
                Password
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mb-3"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {isLogin ? "Logging in..." : "Signing up..."}
                </>
              ) : (
                <>
                  <i className={`bi ${isLogin ? "bi-box-arrow-in-right" : "bi-person-plus"} me-2`}></i>
                  {isLogin ? "Login" : "Sign Up"}
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <button
              className="btn btn-link text-decoration-none"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Login"}
            </button>
          </div>

          <hr />

          <div className="text-center">
            <small className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Playing as PLAYER role
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
