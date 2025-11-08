import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Leaderboard from "../Leaderboard";

export default function Accueil() {
  const navigate = useNavigate();

  const [selectedCar, setSelectedCar] = useState(null);
  const [showRules, setShowRules] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showScores, setShowScores] = useState(false);
  const [showError, setShowError] = useState(false);

  const carOptions = [
    { src: "voitureimage/voiturerouge.png", alt: "Rouge" },
    { src: "voitureimage/voiturerose.png", alt: "Rose" },
    { src: "voitureimage/voiturebleu.png", alt: "Bleu" },
  ];

  const handlePlay = () => {
    if (!selectedCar) {
      setShowError(true);
      return;
    }
    navigate(`/voiture?car=${encodeURIComponent(selectedCar)}`);
  };

  useEffect(() => {
    document.body.style.background = "radial-gradient(circle, #000 40%, #111 100%)";
    document.body.style.color = "#0ff";
    document.body.style.fontFamily = "'Press Start 2P', cursive, sans-serif";
    document.body.style.textAlign = "center";
    document.body.style.padding = "40px";
  }, []);

  return (
    <>
      <style>{`
        .screen {
          max-width: 600px;
          margin: auto;
          background: #222;
          border: 4px solid #0ff;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 0 20px #0ff;
          position: relative;
          overflow: hidden;
        }

        h1 {
          font-size: 28px;
          margin-bottom: 10px;
          color: #ff0;
        }

        .subtitle {
          font-size: 14px;
          margin-bottom: 30px;
          color: #0ff;
        }

        .button-group {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 20px;
        }

        .btn {
          padding: 12px;
          background: #0c00f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.3s;
        }

        .btn:hover {
          background: #0a00d0;
        }

        .car-error {
          color: #ff4444;
          font-size: 12px;
          margin-top: 10px;
        }

        .carGallery {
          margin-top: 20px;
        }

        .car-options {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 10px;
        }

        .car-pick:hover {
          transform: scale(1.1);
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.25); }
          100% { transform: scale(1); }
        }

        .car-pick.selected {
          transform: scale(1.2);
          background-color: #000;
          animation: pulse 0.3s ease;
        }

        /* 🧭 Panneau à GAUCHE (Règles) */
        .rules-panel {
          position: fixed;
          top: 0;
          left: 0;
          height: 100%;
          width: 320px;
          background: rgba(0, 0, 0, 0.95);
          border-right: 3px solid #0ff;
          box-shadow: 5px 0 20px rgba(0, 255, 255, 0.3);
          padding: 20px;
          color: white;
          transform: translateX(-100%);
          transition: transform 0.4s ease-in-out;
          overflow-y: auto;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .rules-panel.open {
          transform: translateX(0);
        }

        /* 🏆 Panneau à DROITE (Scores) */
        .score-panel {
          position: fixed;
          top: 0;
          right: 0;
          height: 100%;
          width: 320px;
          background: rgba(0, 0, 0, 0.95);
          border-left: 3px solid #0ff;
          box-shadow: -5px 0 20px rgba(0, 255, 255, 0.3);
          padding: 20px;
          color: white;
          transform: translateX(100%);
          transition: transform 0.4s ease-in-out;
          overflow-y: auto;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .score-panel.open {
          transform: translateX(0);
        }

        .close-btn {
          background: #0c00f6;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px;
          font-size: 12px;
          cursor: pointer;
          margin-top: 20px;
          width: 100%;
        }

        .close-btn:hover {
          background: #0a00d0;
        }
      `}</style>

      <div className="screen">
        <h1>🚗 Course d'Évitement</h1>
        <p className="subtitle">Évite les voitures rouges et reste en vie !</p>

        <div className="button-group">
          <button onClick={() => setShowRules(!showRules)}>📜 Règles</button>
          <button onClick={() => setShowScores(!showScores)}>🏆 Scores</button>
          <button onClick={handlePlay} className="btn">🎮 Jouer</button>
          <div onClick={() => setShowGallery(!showGallery)} className="btn">
            🚗 Choisir ta voiture
          </div>
          <a href="/hubjeux" className="btn">↩ Retour</a>

          {showError && (
            <p className="car-error">🚫 Choisis une voiture avant de jouer !</p>
          )}
        </div>

        {showGallery && (
          <div className="carGallery">
            <div className="car-options">
              {carOptions.map((car, index) => (
                <img
                  key={index}
                  src={car.src}
                  alt={car.alt}
                  className={`car-pick ${selectedCar === car.src ? "selected" : ""}`}
                  style={{ width: "60px", height: "120px", imageRendering: "pixelated" }}
                  onClick={() => {
                    setSelectedCar(car.src);
                    setShowError(false);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* 📜 Panneau des règles (à gauche) */}
        <div className={`rules-panel ${showRules ? "open" : ""}`}>
          <div>
            <h2>📜 Règles du jeu</h2>
            <ul>
              <li>Utilise les flèches gauche/droite pour déplacer ta voiture.</li>
              <li>Évite les voitures rouges qui arrivent en face.</li>
              <li>Si tu touches une voiture ennemie, c’est perdu !</li>
            </ul>
          </div>
          <button className="close-btn" onClick={() => setShowRules(false)}>❌ Fermer</button>
        </div>

        {/* 🏆 Panneau des scores (à droite) */}
        <div className={`score-panel ${showScores ? "open" : ""}`}>
          <div>
            <h2>🏆 Classement - Course d'Évitement</h2>
            <Leaderboard game="accueil" />
          </div>
          <button className="close-btn" onClick={() => setShowScores(false)}>❌ Fermer</button>
        </div>
      </div>
    </>
  );
}
