"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="vh-100 bg-theme-1 text-theme-1-fore">
      {/* Main content */}
      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 m-5">
            <section className="text-center mb-5">
              <h2 className="display-4 fw-bold mb-4">Choose a mode</h2>
              <p className="lead">
                Build your own escape room or play someone else's creation. Select a
                mode to continue.
              </p>
            </section>

            <section className="row g-4">
              <div className="col-md-6">
                <Link
                  href="/builder"
                  className="card h-100 text-decoration-none border-0 shadow"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    color: 'inherit',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="card-body p-4">
                    <h3 className="h3 fw-semibold mb-3">Builder Mode</h3>
                    <p className="card-text mb-4">
                      Create rooms, add objects, and set puzzles for players to solve.
                    </p>
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-decoration-underline fw-medium">Open Builder</span>
                      <span style={{ opacity: 0.7 }}>→</span>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-md-6">
                <Link
                  href="/play"
                  className="card h-100 text-decoration-none border-0 shadow"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    color: 'inherit',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="card-body p-4">
                    <h3 className="h3 fw-semibold mb-3">Player Mode</h3>
                    <p className="card-text mb-4">
                      Join a session, explore rooms, and solve puzzles created by
                      builders.
                    </p>
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-decoration-underline fw-medium">Start Playing</span>
                      <span style={{ opacity: 0.7 }}>→</span>
                    </div>
                  </div>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="position-fixed bottom-0 w-100 py-3 text-center">
        <small style={{ opacity: 0.9 }}>Built by Div</small>
      </footer>
    </div>
  );
}
