import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AccueilVoiture() {
  const navigate = useNavigate();

  const [selectedCar, setSelectedCar] = useState(null);
  const [showRules, setShowRules] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showError, setShowError] = useState(false);

  const carOptions = [
    { src: 'voitureimage/voiturerouge.png', alt: 'Rouge' },
    { src: 'voitureimage/voiturerose.png', alt: 'Rose' },
    { src: 'voitureimage/voiturebleu.png', alt: 'Bleu' }
  ];

  const handlePlay = () => {
    if (!selectedCar) {
      setShowError(true);
      return;
    }
    navigate(`/voiture?car=${encodeURIComponent(selectedCar)}`);
  };

  // 🔧 Appliquer le style global au body
  useEffect(() => {
    document.body.style.background = 'radial-gradient(circle, #000 40%, #111 100%)';
    document.body.style.color = '#0ff';
    document.body.style.fontFamily = "'Press Start 2P', cursive, sans-serif";
    document.body.style.textAlign = 'center';
    document.body.style.padding = '40px';
  }, []);

  return (
    <>
      {/* 🔸 Style intégré */}
      <style>{`
        .screen {
          max-width: 600px;
          margin: auto;
          background: #222;
          border: 4px solid #0ff;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 0 20px #0ff;
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

        .btn, #rulesBtn {
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

        .btn:hover, #rulesBtn:hover {
          background: #0a00d0;
        }

        .car-error {
          color: #ff4444;
          font-size: 12px;
          margin-top: 10px;
        }

        .car-toggle {
          margin-top: 20px;
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

        .rulesBox {
          background: #111;
          border: 2px solid #0ff;
          padding: 20px;
          border-radius: 10px;
          color: #fff;
          font-size: 12px;
          text-align: left;
          margin-top: 30px;
        }

        .rulesBox ul {
          list-style: square;
          padding-left: 20px;
        }

        .hidden {
          display: none;
        }
      `}</style>

      <div className="screen">
        <h1>🚗 Course d'Évitement</h1>
        <p className="subtitle">Évite les voitures rouges et reste en vie !</p>

        <div className="button-group">
          <button onClick={() => setShowRules(!showRules)}>📜 Règles</button>
          <button onClick={handlePlay} className="btn">🎮 Jouer</button>
          <a href="/" className="btn">↩ Retour</a>
          {showError && (
            <p className="car-error">🚫 Choisis une voiture avant de jouer !</p>
          )}
        </div>

        <div onClick={() => setShowGallery(!showGallery)} className="btn car-toggle">
          🚗 Choisir ta voiture
        </div>

        {showGallery && (
          <div className="carGallery">
            <div className="car-options">
              {carOptions.map((car, index) => (
                <img
                  key={index}
                  src={car.src}
                  alt={car.alt}
                  data-car={car.src}
                  className={`car-pick ${selectedCar === car.src ? 'selected' : ''}`}
                  style={{ width: '60px', height: '120px', imageRendering: 'pixelated' }}
                  onClick={() => {
                    setSelectedCar(car.src);
                    setShowError(false);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {showRules && (
          <div className="rulesBox">
            <h2>Règles du jeu</h2>
            <ul>
              <li>Utilise les flèches gauche/droite pour déplacer ta voiture.</li>
              <li>Évite les voitures rouges qui arrivent en face.</li>
              <li>Si tu touches une voiture ennemie, c’est perdu !</li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
