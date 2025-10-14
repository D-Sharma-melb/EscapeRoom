"use client";

import { useState, useEffect } from "react";

interface ObjectConfig {
  question: string;
  correctAnswer: string;
  hint: string;
  points: number;
}

interface ObjectConfigModalProps {
  objectId: string | null;
  currentConfig: ObjectConfig;
  onSave: (config: ObjectConfig) => void;
  onDelete: () => void;
}

export default function ObjectConfigModal({
  objectId,
  currentConfig,
  onSave,
  onDelete,
}: ObjectConfigModalProps) {
  const [config, setConfig] = useState<ObjectConfig>(currentConfig);

  useEffect(() => {
    setConfig(currentConfig);
  }, [currentConfig, objectId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(config);
  };

  return (
    <div
      className="modal fade"
      id="objectConfigModal"
      tabIndex={-1}
      aria-labelledby="objectConfigModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title" id="objectConfigModalLabel">
              <i className="bi bi-gear-fill me-2"></i>
              Configure Object
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="question" className="form-label fw-bold">
                  Question *
                </label>
                <textarea
                  className="form-control"
                  id="question"
                  rows={2}
                  value={config.question}
                  onChange={(e) =>
                    setConfig({ ...config, question: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="correctAnswer" className="form-label fw-bold">
                  Correct Answer *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="correctAnswer"
                  value={config.correctAnswer}
                  onChange={(e) =>
                    setConfig({ ...config, correctAnswer: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="hint" className="form-label fw-bold">
                  Hint (Optional)
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="hint"
                  value={config.hint}
                  onChange={(e) =>
                    setConfig({ ...config, hint: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label htmlFor="points" className="form-label fw-bold">
                  Points
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="points"
                  min="1"
                  max="100"
                  value={config.points}
                  onChange={(e) =>
                    setConfig({ ...config, points: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger me-auto"
                onClick={onDelete}
                data-bs-dismiss="modal"
              >
                <i className="bi bi-trash me-2"></i>
                Delete
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                <i className="bi bi-check-lg me-2"></i>
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
