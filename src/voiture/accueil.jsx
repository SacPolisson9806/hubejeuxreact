import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Leaderboard from "../Leaderboard";

/*
  🔹 Composant principal de l'accueil du jeu "Course d'Évitement"
  - Permet de choisir sa voiture
  - Afficher les règles et le classement
  - Lancer le jeu
*/
export default function Accueil() {
  const navigate = useNavigate(); // Hook pour naviguer vers une autre route

  // 🏎️ États pour gérer la sélection de voiture et l'affichage des panneaux
  const [selectedCar, setSelectedCar] = useState(null); // La voiture choisie par le joueur
  const [showRules, setShowRules] = useState(false);    // Affichage du panneau de règles
  const [showGallery, setShowGallery] = useState(false); // Affichage de la galerie de voitures
  const [showScores, setShowScores] = useState(false);  // Affichage du panneau de scores
  const [showError, setShowError] = useState(false);    // Message d'erreur si aucune voiture choisie

  // 🔹 Récupération automatique du pseudo depuis le stockage local
  const playerName = localStorage.getItem("playerName") || "";

  // 🏎️ Options de voitures disponibles
  const carOptions = [
    { src: "voitureimage/voiturerouge.png", alt: "Rouge" },
    { src: "voitureimage/voiturerose.png", alt: "Rose" },
    { src: "voitureimage/voiturebleu.png", alt: "Bleu" },
  ];

  // 🔹 Fonction appelée au clic sur "Jouer"
  const handlePlay = () => {
    if (!selectedCar) {           // Vérifie si une voiture est sélectionnée
      setShowError(true);         // Affiche un message d'erreur si non
      return;
    }
    if (!playerName) {            // Vérifie si le joueur est connecté
      alert("🚨 Connecte-toi pour jouer !");
      return;
    }
    // Navigation vers la page du jeu en passant la voiture sélectionnée dans l'URL
    navigate(`/voiture?car=${encodeURIComponent(selectedCar)}`);
  };

  // 🔹 useEffect pour styliser la page dès le chargement
  useEffect(() => {
    document.body.style.background = "radial-gradient(circle, #000 40%, #111 100%)";
    document.body.style.color = "#0ff";
    document.body.style.fontFamily = "'Press Start 2P', cursive, sans-serif";
    document.body.style.textAlign = "center";
    document.body.style.padding = "40px";
  }, []); // [] => s'exécute une seule fois au montage du composant

  return (
    <>
      {/* 🔹 Styles internes pour la page */}
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

        /* 📜 Panneau des règles (gauche) */
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
        }

        .rules-panel.open {
          transform: translateX(0);
        }

        /* 🏆 Panneau des scores (droite) */
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
        }

        .score-panel.open {
          transform: translateX(0);
        }
      `}</style>

      <div className="screen">
        {/* Titre du jeu */}
        <h1>🚗 Course d'Évitement</h1>
        <p className="subtitle">Évite les voitures rouges et reste en vie !</p>

        {/* 🔹 Boutons principaux */}
        <div className="button-group">
          <button onClick={() => setShowRules(!showRules)}>📜 Règles</button>
          <button onClick={() => setShowScores(!showScores)}>🏆 Scores</button>
          <button onClick={handlePlay} className="btn">🎮 Jouer</button>
          <div onClick={() => setShowGallery(!showGallery)} className="btn">
            🚗 Choisir ta voiture
          </div>
          <a href="/hubjeux" className="btn">↩ Retour</a>

          {/* Message d'erreur si aucune voiture choisie */}
          {showError && <p className="car-error">🚫 Choisis une voiture avant de jouer !</p>}
        </div>

        {/* 🔹 Galerie de voitures */}
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
                    setSelectedCar(car.src); // Sélection de la voiture
                    setShowError(false);     // Supprime le message d'erreur si affiché
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* 📜 Panneau des règles */}
        <div className={`rules-panel ${showRules ? "open" : ""}`}>
          <h2>📜 Règles du jeu</h2>
          <ul>
            <li>🚗 Choisis ta voiture préférée parmi les modèles disponibles dans l’onglet <strong>“Choisir voiture”</strong>.</li>
            <li>🎮 Utilise les flèches <strong>← / →</strong> pour te faufiler entre les voitures ennemies.</li>
            <li>💥 Évite à tout prix les voitures rouges — un seul choc et la partie est terminée !</li>
            <li>🧠 Reste concentré : plus tu tiens longtemps, plus ton score grimpe !</li>
            <li>🏆 Tente de décrocher la première place dans l’onglet <strong>“Scores”</strong>… et surtout, <strong>défends ton trône</strong> aussi longtemps que possible !</li>
          </ul>
        </div>

        {/* 🏆 Panneau des scores */}
        <div className={`score-panel ${showScores ? "open" : ""}`}>
          <h2>🏆 Classement - Course d'Évitement</h2>
          <Leaderboard game="accueil" />
        </div>
      </div>
    </>
  );
}
