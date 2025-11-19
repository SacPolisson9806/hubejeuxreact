import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profil() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("Joueur");
  const [playerLevel, setPlayerLevel] = useState(1);

  // Récupération du nom depuis le localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("playerName");
    if (storedName) setPlayerName(storedName);
    else navigate("/hubejeux"); // redirection si pas connecté
  }, [navigate]);

  return (
    <div className="profil-page">
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; font-family: 'Arial', sans-serif; }
        .profil-page { min-height:100vh; background:#1e1e2f; color:#fff; padding:40px 20px; text-align:center; }

        .profile-header { display:flex; flex-direction:column; align-items:center; margin-bottom:60px; }
        .avatar { width:120px; height:120px; border-radius:50%; background:#7ec8e3; display:flex; align-items:center; justify-content:center; font-size:50px; margin-bottom:15px; }
        .player-name { font-size:24px; color:#7ec8e3; font-weight:bold; }
        .player-level { font-size:16px; color:#a0cfff; margin-bottom:20px; }

        .btn-quetes {
          padding:15px 30px;
          background:#7ec8e3;
          border:none;
          border-radius:10px;
          color:#000;
          font-weight:bold;
          font-size:16px;
          cursor:pointer;
          transition:0.3s;
        }
        .btn-quetes:hover { background:#5aaedc; color:#fff; }

        .retour {
          display:inline-block;
          margin-top:40px;
          padding:12px 25px;
          background:#7ec8e3;
          border:none;
          border-radius:8px;
          color:#000;
          text-decoration:none;
          font-weight:bold;
          transition:0.3s;
        }
        .retour:hover { background:#5aaedc; color:#fff; }
      `}</style>

      <div className="profile-header">
        <div className="avatar">🎮</div>
        <div className="player-name">{playerName}</div>
        <div className="player-level">Niveau {playerLevel}</div>
        <button className="btn-quetes" onClick={() => navigate("/quete")}>
          🗡️ Voir les Quêtes
        </button>
      </div>

      <button className="retour" onClick={() => navigate("/hubjeux")}>
        ↩ Retour au Hub
      </button>
    </div>
  );
}
