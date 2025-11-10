import React from "react";

export default function LogoutWarning({ countdown, onStayConnected }) {
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
        minWidth: "300px"
      }}>
        <p>Vous serez déconnecté dans <strong>{countdown}</strong> secondes pour inactivité.</p>
        <button onClick={onStayConnected} style={{
          padding: "10px 20px",
          marginTop: "10px",
          cursor: "pointer"
        }}>
          Je reste connecté
        </button>
      </div>
    </div>
  );
}
