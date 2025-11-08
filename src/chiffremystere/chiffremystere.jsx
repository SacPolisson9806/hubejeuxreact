import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChiffreMystere() {
  const navigate = useNavigate();

  const [secret, setSecret] = useState(null);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const random = Math.floor(Math.random() * 100) + 1;
    setSecret(random);
  }, []);

  const checkGuess = () => {
    const num = Number(guess);
    setAttempts((prev) => prev + 1);

    if (!num || num < 1 || num > 100) {
      setMessage('⚠️ Entre un nombre entre 1 et 100 !');
    } else if (num === secret) {
      setMessage(`🎉 Bravo ! Tu as trouvé le chiffre ${secret} en ${attempts + 1} essais.`);
    } else if (num < secret) {
      setMessage('🔼 Trop petit !');
    } else {
      setMessage('🔽 Trop grand !');
    }

    setGuess('');
  };

  const goBack = () => {
    navigate('/hubjeux');
  };

  return (
    <>
      {/* 🔸 Style intégré */}
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

        #message {
          margin-top: 30px;
          font-size: 1.5em;
          color: #0f0;
          text-shadow: 0 0 5px #0f0;
        }

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
        <header>
          <h1>🎲 Jeu du Chiffre Mystère</h1>
          <p>Devine le chiffre choisi par l’ordinateur !</p>
        </header>

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
          <p id="message">{message}</p>
          <button className="back-button" onClick={goBack}>⬅ Retour au hub de jeux</button>
        </div>
      </div>
    </>
  );
}
