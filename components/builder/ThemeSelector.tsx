"use client";

interface ThemeSelectorProps {
  selectedTheme: "ANCIENT" | "SPACE";
  onThemeChange: (theme: "ANCIENT" | "SPACE") => void;
}

export default function ThemeSelector({ selectedTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <div className="btn-group" role="group">
      <button
        type="button"
        className={`btn ${selectedTheme === "ANCIENT" ? "btn-primary" : "btn-outline-primary"}`}
        onClick={() => onThemeChange("ANCIENT")}
      >
        <i className="bi bi-buildings me-2"></i>
        Ancient
      </button>
      <button
        type="button"
        className={`btn ${selectedTheme === "SPACE" ? "btn-primary" : "btn-outline-primary"}`}
        onClick={() => onThemeChange("SPACE")}
      >
        <i className="bi bi-rocket me-2"></i>
        Sci-Fi
      </button>
    </div>
  );
}
