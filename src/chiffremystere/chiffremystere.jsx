import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChiffreMystere() {
  const navigate = useNavigate();

  // 🔹 États du jeu
  const [secret, setSecret] = useState(null);  // Le chiffre mystère à deviner
  const [guess, setGuess] = useState('');      // La tentative actuelle du joueur
  const [attempts, setAttempts] = useState(0); // Nombre d’essais effectués
  const [message, setMessage] = useState('');  // Message de feedback à afficher

  // 🔹 Génère un nombre aléatoire entre 1 et 100 au chargement du composant
  useEffect(() => {
    const random = Math.floor(Math.random() * 100) + 1;
    setSecret(random);
  }, []);

  // 🔹 Vérifie la tentative du joueur
  const checkGuess = () => {
    const num = Number(guess);
    setAttempts((prev) => prev + 1); // Incrémente le compteur d’essais

    // Vérifie la validité et la comparaison du nombre
    if (!num || num < 1 || num > 100) {
      setMessage('⚠️ Entre un nombre entre 1 et 100 !'); // Hors limites
    } else if (num === secret) {
      setMessage(`🎉 Bravo ! Tu as trouvé le chiffre ${secret} en ${attempts + 1} essais.`); // Gagné
    } else if (num < secret) {
      setMessage('🔼 Trop petit !'); // Trop bas
    } else {
      setMessage('🔽 Trop grand !'); // Trop haut
    }

    setGuess(''); // Vide le champ après chaque tentative
  };

  // 🔹 Retourne à la page du hub de jeux
  const goBack = () => {
    navigate('/hubjeux');
  };

  return (
    <>
      {/* 🎨 Style intégré directement dans le composant */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Orbitron', sans-serif;
          background: rgb(238, 232, 232) !important;
          color: #00ffff;
          text-align: center;
          padding: 40px 20px;
        }

        header h1 {
          font-size: 3em;
          color: #ff00ff;
          margin-bottom: 10px;
          text-shadow: 0 0 10px #ff00ff;
        }

        header p {
          font-size: 1.2em;
          color: #333;
          margin-bottom: 30px;
        }

        #game {
          margin-top: 20px;
        }

        /* 🎯 Champ de saisie pour le nombre */
        input[type="number"] {
          padding: 10px;
          font-size: 1.5em;
          border: 2px solid #00ffff;
          border-radius: 8px;
          background: #111;
          color: #00ffff;
          width: 120px;
          text-align: center;
          box-shadow: 0 0 10px #00ffff;
          margin-right: 10px;
        }

        /* 🟦 Bouton de validation */
        button {
          padding: 10px 20px;
          font-size: 1.2em;
          border: none;
          border-radius: 8px;
          background: #00ffff;
          color: #000;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 10px #00ffff;
        }

        /* 💬 Message de feedback (trop grand, petit, ou trouvé) */
        #message {
          margin-top: 30px;
          font-size: 1.5em;
          color: #0f0;
          text-shadow: 0 0 5px #0f0;
        }

        /* 🔙 Bouton de retour vers le hub */
        .back-button {
          display: inline-block;
          margin-top: 40px;
          padding: 10px 20px;
          background: #333;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-size: 1em;
          transition: background 0.3s;
        }

        .back-button:hover {
          background: #555;
        }
      `}</style>

      <div>
        {/* 🧩 En-tête du jeu */}
        <header>
          <h1>🎲 Jeu du Chiffre Mystère</h1>
          <p>Devine le chiffre choisi par l’ordinateur !</p>
        </header>

        {/* 🎮 Zone de jeu */}
        <div id="game">
          <input
            type="number"
            id="guess"
            min="1"
            max="100"
            placeholder="1-100"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
          />
          <button onClick={checkGuess}>Essayer</button>

          {/* 📢 Message de résultat */}
          <p id="message">{message}</p>

          {/* 🔙 Bouton de retour */}
          <button className="back-button" onClick={goBack}>
            ⬅ Retour au hub de jeux
          </button>
        </div>
      </div>
    </>
  );
}
