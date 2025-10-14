"use client";

import { useState } from "react";

export default function SigninBuilder({
  onAuthSuccess,
}: {
  onAuthSuccess?: (user: any) => void;
}) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        // ✅ Use new login API
        const res = await fetch("/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Invalid username or password");
          return;
        }

        localStorage.setItem("user", JSON.stringify(data));
        onAuthSuccess?.(data);
      } else {
        // ✅ Use existing POST /api/users for signup
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, role: "BUILDER" }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Could not create user");
          return;
        }

        localStorage.setItem("user", JSON.stringify(data));
        onAuthSuccess?.(data);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center h-100">
      <div className="card shadow-lg border-0" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-header border-0 pb-0">
          <h5 className="card-title fw-bold text-center">
            {mode === "login" ? "Sign In to Build" : "Create an Account"}
          </h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  placeholder="Enter password"
                  required
                />
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : mode === "login"
                  ? "Login"
                  : "Sign Up"}
              </button>
            </form>
          </div>

          <div className="card-footer border-0 d-flex justify-content-center">
            {mode === "login" ? (
              <p className="text-muted mb-0">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="btn btn-link p-0 fw-semibold"
                  onClick={() => setMode("signup")}
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-muted mb-0">
                Already have an account?{" "}
                <button
                  type="button"
                  className="btn btn-link p-0 fw-semibold"
                  onClick={() => setMode("login")}
                >
                  Login
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
  );
}
