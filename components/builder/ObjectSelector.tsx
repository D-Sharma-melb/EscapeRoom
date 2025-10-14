"use client";

interface ObjectSelectorProps {
  onObjectSelect: (objectType: string) => void;
}

const objectTypes = [
  { type: "KEY", icon: "🔑", label: "Key" },
  { type: "LOCK", icon: "🔒", label: "Lock" },
  { type: "DOOR", icon: "🚪", label: "Door" },
  { type: "CHEST", icon: "📦", label: "Chest" },
  { type: "PUZZLE", icon: "🧩", label: "Puzzle" },
  { type: "CODE", icon: "🔢", label: "Code" },
];

export default function ObjectSelector({ onObjectSelect }: ObjectSelectorProps) {
  return (
    <div className="dropdown">
      <button
        className="btn btn-success dropdown-toggle"
        type="button"
        id="objectDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="bi bi-plus-circle me-2"></i>
        Add Object
      </button>
      <ul className="dropdown-menu" aria-labelledby="objectDropdown">
        {objectTypes.map((obj) => (
          <li key={obj.type}>
            <button
              className="dropdown-item d-flex align-items-center"
              onClick={() => onObjectSelect(obj.type)}
            >
              <span className="me-2 fs-5">{obj.icon}</span>
              {obj.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
