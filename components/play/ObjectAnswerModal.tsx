"use client";

import { useState } from "react";

interface ObjectAnswerModalProps {
  object: {
    id: string;
    type: string;
    question: string;
    hint: string;
    points: number;
  } | null;
  isAnswered: boolean;
  onSubmitAnswer: (answer: string) => void;
}

const objectIcons: Record<string, string> = {
  KEY: "🔑",
  LOCK: "🔒",
  DOOR: "🚪",
  CHEST: "📦",
  PUZZLE: "🧩",
  CODE: "🔢",
};

export default function ObjectAnswerModal({
  object,
  isAnswered,
  onSubmitAnswer,
}: ObjectAnswerModalProps) {
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onSubmitAnswer(answer.trim());
      setAnswer("");
      setShowHint(false);
    }
  };

  if (!object) return null;

  return (
    <div
      className="modal fade"
      id="objectAnswerModal"
      tabIndex={-1}
      aria-labelledby="objectAnswerModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title d-flex align-items-center gap-2" id="objectAnswerModalLabel">
              <span className="fs-3">{objectIcons[object.type]}</span>
              {object.type} Challenge
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                setAnswer("");
                setShowHint(false);
              }}
            ></button>
          </div>
          {isAnswered ? (
            <div className="modal-body text-center py-5">
              <i className="bi bi-check-circle-fill text-success fs-1 mb-3 d-block"></i>
              <h4 className="text-success">Already Answered!</h4>
              <p className="text-muted">You've already completed this challenge.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-4">
                  <h6 className="fw-bold text-primary mb-2">Question:</h6>
                  <p className="fs-5">{object.question}</p>
                </div>
                <div className="mb-3">
                  <label htmlFor="answer" className="form-label fw-bold">
                    Your Answer:
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
                {object.hint && (
                  <div className="mb-3">
                    {!showHint ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-info"
                        onClick={() => setShowHint(true)}
                      >
                        <i className="bi bi-lightbulb me-2"></i>
                        Show Hint
                      </button>
                    ) : (
                      <div className="alert alert-info mb-0">
                        <strong>💡 Hint:</strong> {object.hint}
                      </div>
                    )}
                  </div>
                )}
                <div className="text-end">
                  <span className="badge bg-warning text-dark fs-6">
                    <i className="bi bi-trophy me-1"></i>
                    {object.points} points
                  </span>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    setAnswer("");
                    setShowHint(false);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                  <i className="bi bi-send me-2"></i>
                  Submit Answer
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
