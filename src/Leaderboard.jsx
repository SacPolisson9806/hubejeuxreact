// src/Leaderboard.jsx
import React, { useEffect, useState } from "react";

export default function Leaderboard({ game }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!game) return;
    setLoading(true);

    fetch(`http://localhost:5000/scores/${game}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Tri du meilleur au plus bas
          const sorted = data.scores.sort((a, b) => b.Score - a.Score);
          setScores(sorted);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [game]);

  return (
    <div style={{ maxWidth: 500, margin: "20px auto", textAlign: "center" }}>
      <h3 style={{ color: "#00bfff" }}>🏆 Classement - {game}</h3>
      {loading ? (
        <p style={{ color: "#fff" }}>Chargement...</p>
      ) : scores.length === 0 ? (
        <p style={{ color: "#fff" }}>Aucun score pour ce jeu.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            color: "#fff",
            backgroundColor: "#2c2c3c",
            borderRadius: "10px",
            overflow: "hidden"
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#00bfff" }}>
              <th style={{ padding: "10px" }}>Rang</th>
              <th style={{ padding: "10px" }}>Pseudo</th>
              <th style={{ padding: "10px" }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #444" }}>
                <td style={{ padding: "8px" }}>{idx + 1}</td>
                <td style={{ padding: "8px" }}>{s.Username}</td>
                <td style={{ padding: "8px" }}>{s.Score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
