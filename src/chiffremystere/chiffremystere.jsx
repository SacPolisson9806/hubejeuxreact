import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ChiffreMystere() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Récupère la difficulté depuis la page d’accueil
  const difficulty = location.state?.difficulty || 'normal';

  // 🔹 États du jeu
  const [secret, setSecret] = useState(null);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(null);

  // 🔹 Génère un nombre aléatoire selon la difficulté
  useEffect(() => {
    let max = 100;
    if (difficulty === 'facile') max = 50;
    if (difficulty === 'difficile') max = 500;
    const random = Math.floor(Math.random() * max) + 1;
    setSecret(random);
  }, [difficulty]);

  // 🔹 Vérifie la tentative du joueur
  const checkGuess = () => {
    const num = Number(guess);
    setAttempts(prev => prev + 1);

    if (!num || num < 1 || num > (difficulty === 'facile' ? 50 : difficulty === 'difficile' ? 500 : 100)) {
      setMessage('⚠️ Entre un nombre valide selon la difficulté !');
    } else if (num === secret) {
      setScore(1); // 1 victoire
      setMessage(`🎉 Bravo ${localStorage.getItem('playerName')} ! Tu as trouvé le chiffre ${secret} en ${attempts + 1} essais.`);

      // 🔹 Envoi d’une victoire au backend
      fetch("http://localhost:5000/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game: "ChiffreMystere",
          username: localStorage.getItem("playerName") || "Invité",
          score: 1,
        }),
      })
      .then(res => res.json())
      .then(data => {
        if (!data.success) console.error("❌ Erreur serveur :", data.message);
      })
      .catch(err => console.error("❌ Erreur serveur :", err));
    } else if (num < secret) {
      setMessage('🔼 Trop petit !');
    } else {
      setMessage('🔽 Trop grand !');
    }

    setGuess('');
  };

  const goBack = () => navigate('/chiffremystereaccueil');

  return (
    <>
      <style>{`
        body {
          font-family: 'Orbitron', sans-serif;
          background: rgba(0, 0, 0, 1);
          color: #00ffff;
          text-align: center;
          padding: 40px 20px;
        }
        header h1 { font-size: 3em; color: #ff00ff; margin-bottom: 10px; text-shadow: 0 0 10px #ff00ff; }
        header p { font-size: 1.2em; color: #333; margin-bottom: 30px; }
        #game { margin-top: 20px; }
        input[type="number"] {
          padding: 10px; font-size: 1.5em; border: 2px solid #00ffff; border-radius: 8px;
          background: #111; color: #00ffff; width: 120px; text-align: center; box-shadow: 0 0 10px #00ffff;
          margin-right: 10px;
        }
        button {
          padding: 10px 20px; font-size: 1.2em; border: none; border-radius: 8px;
          background: #00ffff; color: #000; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
        }
        button:hover { transform: scale(1.05); box-shadow: 0 0 10px #00ffff; }
        #message { margin-top: 30px; font-size: 1.5em; color: #0f0; text-shadow: 0 0 5px #0f0; }
        .back-button {
          display: inline-block; margin-top: 40px; padding: 10px 20px; background: #333;
          color: white; text-decoration: none; border-radius: 6px; font-size: 1em; transition: background 0.3s;
        }
        .back-button:hover { background: #555; }
      `}</style>

      <div>
        <header>
          <h1>🎲 Jeu du Chiffre Mystère</h1>
          <p>Difficulté : <strong>{difficulty}</strong></p>
          <p>Devine le chiffre choisi par l’ordinateur !</p>
        </header>

        <div id="game">
          <input
            type="number"
            min="1"
            max={difficulty === 'facile' ? 50 : difficulty === 'difficile' ? 500 : 100}
            placeholder="Essai"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            disabled={score !== null}
          />
          <button onClick={checkGuess} disabled={score !== null}>Essayer</button>

          <p id="message">{message}</p>

          <button className="back-button" onClick={goBack}>
            ⬅ Retour à l'accueil
          </button>
        </div>
      </div>
    </>
  );
}
