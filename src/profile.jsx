import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profil() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("Joueur");
  const [playerLevel, setPlayerLevel] = useState(1);
  const [playerXP, setPlayerXP] = useState(0);
  const [xpForNextLevel, setXpForNextLevel] = useState(100);

  useEffect(() => {
    // Bloque le scroll
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Nettoyage à la sortie du composant
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem("playerName");
    if (storedName) setPlayerName(storedName);
    else navigate("/hubjeux");

    const storedLevel = parseInt(localStorage.getItem("playerLevel") || "1", 10);
    const storedXP = parseInt(localStorage.getItem("playerXP") || "0", 10);
    setPlayerLevel(storedLevel);
    setPlayerXP(storedXP);
  }, [navigate]);

  const xpPercentage = Math.min((playerXP / xpForNextLevel) * 100, 100);

  return (
    <div className="profil-page">
      <style>{`
        html, body { margin:0; padding:0; height:100%; width:100%; font-family:Poppins, sans-serif; }
        body::before { content:""; position:fixed; top:0; left:0; width:100%; height:100%; background: radial-gradient(circle at top, #0a0a2a, #030314, #0a0a2a); background-size:400% 400%; animation: gradientMove 15s ease infinite; z-index:-1; }
        @keyframes gradientMove {0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}
        .profil-page { height:100vh; width:100vw; display:flex; flex-direction:column; justify-content:center; align-items:center; color:white; padding:0 20px; }
        .profile-box { background: rgba(255,255,255,0.05); backdrop-filter: blur(15px); border:1px solid rgba(255,255,255,0.1); border-radius:20px; padding:40px 60px; text-align:center; width:350px; transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .profile-box:hover { transform:translateY(-5px); box-shadow:0 0 35px rgba(0,180,255,0.3); }
        .avatar { width:120px; height:120px; border-radius:50%; background:#7ec8e3; display:flex; align-items:center; justify-content:center; font-size:50px; margin-bottom:20px; }
        .player-name { font-size:28px; background: linear-gradient(90deg, #00d4ff, #00ffaa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:10px; }
        .player-level { font-size:18px; color:#a0cfff; margin-bottom:10px; }
        .xp-bar-container { background: rgba(255,255,255,0.1); border-radius:10px; width:100%; height:20px; margin-bottom:20px; overflow:hidden; }
        .xp-bar { background: linear-gradient(90deg, #00d4ff, #00ffaa); height:100%; width: ${xpPercentage}%; transition: width 0.5s ease; }
        .btn-quetes, .retour { width:100%; padding:12px 0; margin-top:15px; border:none; border-radius:10px; font-weight:bold; cursor:pointer; font-size:16px; transition: all 0.3s ease; }
        .btn-quetes { background: linear-gradient(90deg, #00d4ff, #00ffaa); color:#000; }
        .btn-quetes:hover { transform:scale(1.05); }
        .retour { background: rgba(255,255,255,0.05); color:white; }
        .retour:hover { background: rgba(255,255,255,0.1); }
      `}</style>

      <div className="profile-box">
        <div className="avatar">🎮</div>
        <div className="player-name">{playerName}</div>
        <div className="player-level">Niveau {playerLevel}</div>
        <div className="xp-bar-container">
          <div className="xp-bar"></div>
        </div>

        <button className="btn-quetes" onClick={() => navigate("/quete")}>
          🗡️ Voir les Quêtes
        </button>
        <button className="retour" onClick={() => navigate("/hubjeux")}>
          ↩ Retour au Hub
        </button>
      </div>
    </div>
  );
}
