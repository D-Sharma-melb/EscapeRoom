"use client";

import { useState, useEffect } from "react";

interface RoomDetailsModalProps {
  roomName: string;
  roomDescription: string;
  onSave: (name: string, description: string) => void;
}

export default function RoomDetailsModal({
  roomName,
  roomDescription,
  onSave,
}: RoomDetailsModalProps) {
  const [name, setName] = useState(roomName);
  const [description, setDescription] = useState(roomDescription);

  useEffect(() => {
    setName(roomName);
    setDescription(roomDescription);
  }, [roomName, roomDescription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name, description);
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-info"
        data-bs-toggle="modal"
        data-bs-target="#roomDetailsModal"
      >
        <i className="bi bi-pencil-square me-2"></i>
        Room Details
      </button>

      <div
        className="modal fade"
        id="roomDetailsModal"
        tabIndex={-1}
        aria-labelledby="roomDetailsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="roomDetailsModalLabel">
                Escape Room Details
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="roomName" className="form-label">
                    Room Name *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="roomName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="roomDescription" className="form-label">
                    Room Description
                  </label>
                  <textarea
                    className="form-control"
                    id="roomDescription"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
