import React from "react";

export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      padding: "40px",
      fontFamily: "Arial",
      background: "#f8fafc"
    }}>
      <h1>Camera Box Size Calculator</h1>

      <p>
        This is the starter version of the Box Sizing app.
      </p>

      <button
        onClick={() => alert("Camera feature coming next")}
        style={{
          padding: "12px 20px",
          borderRadius: "10px",
          border: "none",
          background: "#2563eb",
          color: "white",
          cursor: "pointer"
        }}
      >
        Start Camera
      </button>
    </div>
  );
}