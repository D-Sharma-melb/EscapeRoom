"use client";

interface GameResultModalProps {
  isSuccess: boolean;
  score: number;
  totalPoints: number;
  onRestart: () => void;
  onBackToRooms: () => void;
}

export default function GameResultModal({
  isSuccess,
  score,
  totalPoints,
  onRestart,
  onBackToRooms,
}: GameResultModalProps) {
  return (
    <div
      className="modal fade"
      id="gameResultModal"
      tabIndex={-1}
      aria-labelledby="gameResultModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div
            className={`modal-header ${
              isSuccess ? "bg-success" : "bg-danger"
            } text-white`}
          >
            <h5 className="modal-title" id="gameResultModalLabel">
              {isSuccess ? (
                <>
                  <i className="bi bi-trophy-fill me-2"></i>
                  Congratulations!
                </>
              ) : (
                <>
                  <i className="bi bi-clock-history me-2"></i>
                  Time's Up!
                </>
              )}
            </h5>
          </div>
          <div className="modal-body text-center py-5">
            {isSuccess ? (
              <>
                <i className="bi bi-check-circle-fill text-success fs-1 mb-3 d-block"></i>
                <h4 className="mb-3">You Escaped!</h4>
                <p className="text-muted mb-4">
                  You've successfully completed all challenges!
                </p>
              </>
            ) : (
              <>
                <i className="bi bi-x-circle-fill text-danger fs-1 mb-3 d-block"></i>
                <h4 className="mb-3">Better Luck Next Time!</h4>
                <p className="text-muted mb-4">
                  Time ran out before you could escape.
                </p>
              </>
            )}
            <div className="card bg-light border-0 mb-4">
              <div className="card-body">
                <h2 className="display-4 fw-bold mb-0">
                  {score} / {totalPoints}
                </h2>
                <p className="text-muted mb-0">Points</p>
              </div>
            </div>
          </div>
          <div className="modal-footer justify-content-center">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={onBackToRooms}
              data-bs-dismiss="modal"
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Rooms
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onRestart}
              data-bs-dismiss="modal"
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Play Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
