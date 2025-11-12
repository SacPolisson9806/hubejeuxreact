// src/chiffremystere/ChiffreMystereLeaderboard.jsx
import React, { useEffect, useState } from "react";

export default function ChiffreMystereLeaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // 🔹 Récupère toutes les victoires pour le jeu "ChiffreMystere"
    fetch("http://localhost:5000/scores/chiffremystere")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        // 🔹 Adapter selon la structure de ton backend
        const allScores = Array.isArray(data) ? data : data.scores || [];

        // 🔹 Compte le nombre de victoires par joueur
        const victories = {};
        allScores.forEach((entry) => {
          const name = entry.Username || "Invité";
          victories[name] = (entry.Score || 0);
        });

        // 🔹 Transforme en tableau trié du plus grand nombre de victoires
        const grouped = Object.keys(victories)
          .map((name) => ({ Username: name, Victoires: victories[name] }))
          .sort((a, b) => b.Victoires - a.Victoires);

        setScores(grouped);
      })
      .catch((err) => console.error("Erreur fetch leaderboard:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <h3 style={{ color: "#00ffff" }}>🏆 Victoires - Chiffre Mystère</h3>
      {loading ? (
        <p style={{ color: "#fff" }}>Chargement...</p>
      ) : scores.length === 0 ? (
        <p style={{ color: "#fff" }}>Aucun joueur n’a encore gagné.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            color: "#fff",
            backgroundColor: "#2c2c3c",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#00ffff" }}>
              <th style={{ padding: "10px" }}>Rang</th>
              <th style={{ padding: "10px" }}>Pseudo</th>
              <th style={{ padding: "10px" }}>Victoires</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #444" }}>
                <td style={{ padding: "8px" }}>{idx + 1}</td>
                <td style={{ padding: "8px" }}>{s.Username}</td>
                <td style={{ padding: "8px" }}>{s.Victoires}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
