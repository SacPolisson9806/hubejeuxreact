// src/chiffremystere/ChiffreMystereAccueil.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import ChiffreMystereLeaderboard from "./ChiffreMystereLeaderboard";

export default function ChiffreMystereAccueil() {
  const navigate = useNavigate();

  // 🔹 Fonction pour démarrer le jeu avec la difficulté choisie
  const startGame = (difficulty) => {
    navigate("/chiffremystere", { state: { difficulty } });
  };

  return (
    <>
      {/* === STYLES GÉNÉRAUX === */}
      <style>{`
        body {
          font-family: 'Orbitron', sans-serif;
          background: rgba(0, 0, 0, 1) !important;
          color: #00ffff;
          margin: 0;
          overflow-x: hidden;
        }

        .page-container {
          display: flex;
          min-height: 100vh;
        }
      `}</style>

      {/* === STYLES CONTENU CENTRAL === */}
      <style>{`
        .main-content {
          flex: 1;
          text-align: center;
          padding: 50px 20px;
        }

        h1 {
          font-size: 3.5em;
          color: #ff00ff;
          text-shadow: 0 0 20px #ff00ff;
          margin-bottom: 10px;
        }

        p {
          font-size: 1.2em;
          color: #00ffff;
          margin-bottom: 30px;
          text-shadow: 0 0 5px #00ffff44;
        }

        .difficulty-buttons {
          margin-top: 20px;
        }

        .difficulty-buttons button {
          margin: 10px;
          padding: 15px 30px;
          font-size: 1.2em;
          background: #00ffff;
          border: none;
          border-radius: 12px;
          color: #000;
          cursor: pointer;
          font-weight: bold;
          box-shadow: 0 0 15px #00ffff88;
          transition: 0.3s;
        }

        .difficulty-buttons button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 25px #00ffff;
        }

        .rules {
          background: rgba(17, 17, 17, 0.9);
          border: 2px solid #00ffff44;
          box-shadow: 0 0 15px #00ffff33;
          border-radius: 15px;
          padding: 25px;
          margin: 40px auto;
          color: #00ffff;
          max-width: 600px;
          text-align: left;
          line-height: 1.5;
        }

        .rules h2 {
          text-align: center;
          color: #ff00ff;
          margin-bottom: 15px;
          text-shadow: 0 0 10px #ff00ff;
        }

        .back-button {
          margin-top: 30px;
          padding: 12px 25px;
          font-size: 1em;
          background: #333;
          border: none;
          border-radius: 8px;
          color: #00ffff;
          cursor: pointer;
          transition: background 0.3s, transform 0.3s;
          text-shadow: 0 0 5px #00ffff;
        }

        .back-button:hover {
          background: #555;
          transform: scale(1.05);
        }
      `}</style>

      {/* === STYLES PANNEAU DE SCORE === */}
      <style>{`
        .score-panel {
          width: 400px;
          background: linear-gradient(180deg, #111, #222);
          border-left: 3px solid #00ffff;
          box-shadow: -5px 0 25px #00ffff33;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 30px 15px;
          overflow-y: auto;
        }

        .score-panel h3 {
          color: #00ffff;
          text-shadow: 0 0 10px #00ffff;
          margin-bottom: 20px;
        }

        /* Scroll stylé */
        .score-panel::-webkit-scrollbar {
          width: 6px;
        }
        .score-panel::-webkit-scrollbar-thumb {
          background-color: #00ffff77;
          border-radius: 4px;
        }

        @media (max-width: 900px) {
          .page-container {
            flex-direction: column-reverse;
          }
          .score-panel {
            width: 100%;
            border-left: none;
            border-top: 3px solid #00ffff;
            box-shadow: 0 -5px 25px #00ffff33;
          }
        }
      `}</style>

      {/* === STRUCTURE DE LA PAGE === */}
      <div className="page-container">
        {/* Contenu central : titre, règles, difficultés et bouton retour */}
        <div className="main-content">
          <h1>🎮 Chiffre Mystère</h1>
          <p>Choisis ta difficulté et tente de deviner le nombre secret !</p>

          {/* Boutons de difficulté */}
          <div className="difficulty-buttons">
            <button onClick={() => startGame("facile")}>Facile (1–50)</button>
            <button onClick={() => startGame("normal")}>Normal (1–100)</button>
            <button onClick={() => startGame("difficile")}>Difficile (1–500)</button>
          </div>

          {/* Règles du jeu */}
          <div className="rules">
            <h2>📜 Règles du jeu</h2>
            <p>
              L’ordinateur choisit un chiffre secret selon la difficulté.  
              À toi de le deviner en un minimum d’essais !  
              Après chaque tentative, tu sauras si ton nombre est trop grand ou trop petit.  
              Chaque victoire compte pour ton score global !
            </p>
          </div>

          {/* Bouton retour hub */}
          <button className="back-button" onClick={() => navigate("/hubjeux")}>
            ⬅ Retour au hub de jeux
          </button>
        </div>

        {/* Panneau de score sur le côté droit */}
        <div className="score-panel">
          <h3>🏆 Victoires</h3>
          <ChiffreMystereLeaderboard />
        </div>
      </div>
    </>
  );
}
